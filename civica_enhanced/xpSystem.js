import { auth, db } from "./firebase.js";
import { doc, updateDoc, increment, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function addXP(amount, reason = "") {
  const user = auth.currentUser;
  if (!user) return 0;
  try {
    await updateDoc(doc(db, "users", user.uid), { xp: increment(amount) });
    const snap = await getDoc(doc(db, "users", user.uid));
    const newXP = snap.data()?.xp || 0;
    const newLevel = Math.max(1, Math.floor(newXP / 500) + 1);
    await updateDoc(doc(db, "users", user.uid), { level: newLevel });
    return amount;
  } catch(e) { console.error("XP update error:", e); return 0; }
}
export function calcLevel(xp) { return Math.max(1, Math.floor(xp / 500) + 1); }
export function getLevelTitle(level) {
  const t = ['','Civic Novice','Active Citizen','Informed Voter','Policy Analyst','Civic Leader','Democracy Champion','Constitutional Scholar','Statesman','People\'s Champion','Grand Civic Master'];
  return t[Math.min(level, 10)] || 'Grand Civic Master';
}
