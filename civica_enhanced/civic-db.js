/**
 * civic-db.js — CivicaQuest Firestore Data Layer
 * Handles all reads/writes for the Civic Learning Centre.
 * Uses the existing firebase.js config (same project, same auth).
 *
 * Firestore structure added under each user document:
 *
 * users/{uid}/
 *   xp, level, badges, ...  (existing fields)
 *   civicProgress: {
 *     chaptersRead:    string[]   — chapter IDs read
 *     mcqAttempted:   number
 *     mcqCorrect:     number
 *     casesStudied:   string[]   — case IDs studied
 *     flashcardsReviewed: number
 *     lastStudied:    timestamp
 *     studyStreak:    number
 *     lastStreakDate: string      — YYYY-MM-DD
 *     totalCivicXP:   number
 *   }
 *   civicMCQHistory: [           — subcollection (last 50 sessions)
 *     { topic, score, total, accuracy, xpEarned, timestamp }
 *   ]
 *   civicActivity: [             — subcollection (last 30 days)
 *     { date: YYYY-MM-DD, xp, mcq, chapters }
 *   ]
 */

import { auth, db } from "./firebase.js";
import {
  doc, getDoc, setDoc, updateDoc,
  collection, addDoc, query, orderBy, limit, getDocs,
  serverTimestamp, increment, arrayUnion, Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  const u = auth.currentUser;
  if (!u) throw new Error("Not logged in");
  return u.uid;
}

function userRef() { return doc(db, "users", uid()); }
function civicRef() { return doc(db, "users", uid(), "civicData", "progress"); }
function historyCol() { return collection(db, "users", uid(), "civicMCQHistory"); }
function activityCol() { return collection(db, "users", uid(), "civicActivity"); }

function todayStr() { return new Date().toISOString().split("T")[0]; }

// ── Initialise civic progress doc if missing ─────────────────────────────────

export async function ensureCivicDoc() {
  try {
    const ref = civicRef();
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        chaptersRead: [],
        mcqAttempted: 0,
        mcqCorrect: 0,
        casesStudied: [],
        flashcardsReviewed: 0,
        lastStudied: serverTimestamp(),
        studyStreak: 0,
        lastStreakDate: "",
        totalCivicXP: 0
      });
    }
    return snap.data() || {};
  } catch (e) {
    console.warn("CivicDB ensureCivicDoc:", e.message);
    return {};
  }
}

// ── Load all civic progress ───────────────────────────────────────────────────

export async function loadCivicProgress() {
  try {
    await ensureCivicDoc();
    const snap = await getDoc(civicRef());
    const data = snap.exists() ? snap.data() : {};
    // Also sync streak
    data.studyStreak = await _updateStreak(data);
    return data;
  } catch (e) {
    console.warn("CivicDB loadCivicProgress:", e.message);
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem("cq_civic_progress") || "{}");
  }
}

// ── Streak logic ──────────────────────────────────────────────────────────────

async function _updateStreak(data) {
  const today = todayStr();
  const last = data.lastStreakDate || "";
  if (last === today) return data.studyStreak || 0;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];

  let newStreak = last === yStr ? (data.studyStreak || 0) + 1 : 1;
  try {
    await updateDoc(civicRef(), {
      studyStreak: newStreak,
      lastStreakDate: today,
      lastStudied: serverTimestamp()
    });
  } catch (e) { /* offline */ }
  return newStreak;
}

// ── Mark chapter as read ──────────────────────────────────────────────────────

export async function markChapterRead(chapterId, xpReward = 10) {
  const today = todayStr();
  try {
    // Firestore
    await updateDoc(civicRef(), {
      chaptersRead: arrayUnion(chapterId),
      totalCivicXP: increment(xpReward),
      lastStudied: serverTimestamp()
    });
    // Award XP on main user doc
    await updateDoc(userRef(), { xp: increment(xpReward) });
    // Log activity
    await _logActivity(today, { xp: xpReward, chapters: 1 });
  } catch (e) {
    console.warn("CivicDB markChapterRead:", e.message);
  }
  // Always sync localStorage as offline fallback
  const p = JSON.parse(localStorage.getItem("cq_civic_progress") || "{}");
  p.chaptersRead = [...new Set([...(p.chaptersRead || []), chapterId])];
  p.totalCivicXP = (p.totalCivicXP || 0) + xpReward;
  localStorage.setItem("cq_civic_progress", JSON.stringify(p));
  // Legacy cq_notes_read key
  const nr = JSON.parse(localStorage.getItem("cq_notes_read") || "[]");
  if (!nr.includes(chapterId)) {
    localStorage.setItem("cq_notes_read", JSON.stringify([...nr, chapterId]));
  }
}

// ── Save MCQ session ──────────────────────────────────────────────────────────

export async function saveMCQSession({ topic, score, total, xpEarned }) {
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const today = todayStr();
  try {
    // Update progress doc
    await updateDoc(civicRef(), {
      mcqAttempted: increment(total),
      mcqCorrect: increment(score),
      totalCivicXP: increment(xpEarned),
      lastStudied: serverTimestamp()
    });
    // Award XP on main user doc
    await updateDoc(userRef(), { xp: increment(xpEarned) });
    // Add to MCQ history subcollection (keep last 50)
    await addDoc(historyCol(), {
      topic, score, total, accuracy, xpEarned,
      timestamp: serverTimestamp()
    });
    // Log activity
    await _logActivity(today, { xp: xpEarned, mcq: total });
  } catch (e) {
    console.warn("CivicDB saveMCQSession:", e.message);
  }
  // localStorage fallback
  const p = JSON.parse(localStorage.getItem("cq_civic_progress") || "{}");
  p.mcqAttempted = (p.mcqAttempted || 0) + total;
  p.mcqCorrect = (p.mcqCorrect || 0) + score;
  p.totalCivicXP = (p.totalCivicXP || 0) + xpEarned;
  localStorage.setItem("cq_civic_progress", JSON.stringify(p));
}

// ── Mark case study as read ───────────────────────────────────────────────────

export async function markCaseStudied(caseId, xpReward = 10) {
  const today = todayStr();
  try {
    await updateDoc(civicRef(), {
      casesStudied: arrayUnion(caseId),
      totalCivicXP: increment(xpReward),
      lastStudied: serverTimestamp()
    });
    await updateDoc(userRef(), { xp: increment(xpReward) });
    await _logActivity(today, { xp: xpReward });
  } catch (e) {
    console.warn("CivicDB markCaseStudied:", e.message);
  }
  const p = JSON.parse(localStorage.getItem("cq_civic_progress") || "{}");
  p.casesStudied = [...new Set([...(p.casesStudied || []), caseId])];
  localStorage.setItem("cq_civic_progress", JSON.stringify(p));
  const cs = JSON.parse(localStorage.getItem("cq_cases_studied") || "[]");
  if (!cs.includes(caseId)) localStorage.setItem("cq_cases_studied", JSON.stringify([...cs, caseId]));
}

// ── Log daily activity (for streak chart) ────────────────────────────────────

async function _logActivity(dateStr, { xp = 0, mcq = 0, chapters = 0 } = {}) {
  try {
    const ref = doc(activityCol(), dateStr);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, {
        xp: increment(xp),
        mcq: increment(mcq),
        chapters: increment(chapters)
      });
    } else {
      await setDoc(ref, { date: dateStr, xp, mcq, chapters });
    }
  } catch (e) { /* offline — skip */ }
}

// ── Load last 7 days activity (for progress dashboard chart) ─────────────────

export async function loadWeeklyActivity() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  const result = days.map(d => ({ date: d, xp: 0, mcq: 0, chapters: 0 }));
  try {
    for (let i = 0; i < days.length; i++) {
      const snap = await getDoc(doc(activityCol(), days[i]));
      if (snap.exists()) Object.assign(result[i], snap.data());
    }
  } catch (e) {
    console.warn("CivicDB loadWeeklyActivity:", e.message);
  }
  return result;
}

// ── Load MCQ history (last 10 sessions) ──────────────────────────────────────

export async function loadMCQHistory(limitN = 10) {
  try {
    const q = query(historyCol(), orderBy("timestamp", "desc"), limit(limitN));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch (e) {
    console.warn("CivicDB loadMCQHistory:", e.message);
    return [];
  }
}

// ── Leaderboard helper — top 10 users by civicXP ─────────────────────────────

export async function loadCivicLeaderboard(limitN = 10) {
  try {
    // We read from the top-level users collection civicProgress.totalCivicXP
    // Simple approach: load from existing leaderboard collection
    const q = query(
      collection(db, "leaderboard"),
      orderBy("xp", "desc"),
      limit(limitN)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch (e) {
    console.warn("CivicDB loadCivicLeaderboard:", e.message);
    return [];
  }
}

// ── Unlock badge ──────────────────────────────────────────────────────────────

export async function unlockBadge(badgeId) {
  try {
    await updateDoc(userRef(), { badges: arrayUnion(badgeId) });
  } catch (e) {
    console.warn("CivicDB unlockBadge:", e.message);
  }
  const st = JSON.parse(localStorage.getItem("cq_state") || "{}");
  st.badges = [...new Set([...(st.badges || []), badgeId])];
  localStorage.setItem("cq_state", JSON.stringify(st));
}

// ── Compute exam readiness score (0–100) ──────────────────────────────────────

export function computeReadiness(progress, totalChapters = 4, totalCases = 12) {
  const chapterPct = Math.min(100,
    ((progress.chaptersRead || []).length / totalChapters) * 100);
  const mcqAcc = progress.mcqAttempted > 0
    ? (progress.mcqCorrect / progress.mcqAttempted) * 100 : 0;
  const casePct = Math.min(100,
    ((progress.casesStudied || []).length / totalCases) * 100);
  // Weighted: chapters 30%, MCQ accuracy 50%, cases 20%
  return Math.round(chapterPct * 0.3 + mcqAcc * 0.5 + casePct * 0.2);
}
