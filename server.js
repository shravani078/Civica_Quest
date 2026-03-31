/**
 * CivicaQuest Backend Server — Node.js + Express
 * Full REST API with Auth, XP, Quiz, Civic Progress, Election & Classroom
 * Run: npm install && node server.js
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'civicaquest-super-secret-key-change-in-production';

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','PATCH'] }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.static(path.join(__dirname, '../civica_enhanced')));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// ── In-Memory DB (replace with MongoDB/PostgreSQL in production) ───────────────
const DB = {
  users: {},
  quizResults: [],
  civicProgress: {},
  mcqHistory: {},
  activity: {},
  scores: [],
  elections: {},
  classrooms: {},
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const calcLevel = xp => Math.max(1, Math.floor(xp / 500) + 1);
const getLevelTitle = level => {
  const t = ['','Civic Novice','Active Citizen','Informed Voter','Policy Analyst',
             'Civic Leader','Democracy Champion','Constitutional Scholar',
             'Statesman',"People's Champion",'Grand Civic Master'];
  return t[Math.min(level, 10)] || 'Grand Civic Master';
};
const todayStr = () => new Date().toISOString().split('T')[0];
const safeUser = u => { const s = {...u}; delete s.password; return s; };

// ── Auth Middleware ────────────────────────────────────────────────────────────
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Missing or invalid token' });
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token expired or invalid' });
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 🔐 AUTH ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password || !displayName)
      return res.status(400).json({ error: 'email, password, and displayName required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    if (Object.values(DB.users).find(u => u.email === email.toLowerCase()))
      return res.status(409).json({ error: 'Email already registered' });

    const uid = uuidv4();
    const now = new Date().toISOString();
    DB.users[uid] = {
      uid, email: email.toLowerCase(), displayName,
      password: await bcrypt.hash(password, 10),
      xp: 0, level: 1, badges: [],
      createdAt: now, lastLogin: now, photoURL: null, bio: '',
    };
    DB.civicProgress[uid] = {
      chaptersRead: [], mcqAttempted: 0, mcqCorrect: 0, casesStudied: [],
      flashcardsReviewed: 0, totalCivicXP: 0, studyStreak: 0,
      lastStreakDate: '', lastStudied: now,
    };

    const token = jwt.sign({ uid, email: email.toLowerCase() }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { ...safeUser(DB.users[uid]), levelTitle: getLevelTitle(1) } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'email and password required' });

    const user = Object.values(DB.users).find(u => u.email === email.toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid email or password' });

    user.lastLogin = new Date().toISOString();
    const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { ...safeUser(user), levelTitle: getLevelTitle(user.level) } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/auth/demo — guest/demo access
app.post('/api/auth/demo', (req, res) => {
  const uid = 'demo-' + uuidv4();
  const token = jwt.sign({ uid, email: 'demo@civicaquest.app', isDemo: true }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, user: { uid, displayName: 'Demo Student', xp: 0, level: 1, badges: [], isDemo: true, levelTitle: 'Civic Novice' } });
});

// POST /api/auth/refresh
app.post('/api/auth/refresh', authenticate, (req, res) => {
  const token = jwt.sign({ uid: req.user.uid, email: req.user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// ══════════════════════════════════════════════════════════════════════════════
// 👤 USER PROFILE ROUTES
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/users/me', authenticate, (req, res) => {
  const user = DB.users[req.user.uid];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ ...safeUser(user), levelTitle: getLevelTitle(user.level) });
});

app.patch('/api/users/me', authenticate, (req, res) => {
  const user = DB.users[req.user.uid];
  if (!user) return res.status(404).json({ error: 'User not found' });
  ['displayName','photoURL','bio'].forEach(f => { if (req.body[f] !== undefined) user[f] = req.body[f]; });
  res.json({ ...safeUser(user), levelTitle: getLevelTitle(user.level) });
});

// ══════════════════════════════════════════════════════════════════════════════
// 🏅 XP & BADGES
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/xp/add', authenticate, (req, res) => {
  const { amount, reason = '' } = req.body;
  if (!amount || isNaN(amount) || amount <= 0)
    return res.status(400).json({ error: 'Valid positive amount required' });

  const user = DB.users[req.user.uid];
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.xp = (user.xp || 0) + Number(amount);
  const newLevel = calcLevel(user.xp);
  const levelUp = newLevel > user.level;
  user.level = newLevel;

  // Log daily activity
  if (!DB.activity[req.user.uid]) DB.activity[req.user.uid] = [];
  const today = todayStr();
  const todayAct = DB.activity[req.user.uid].find(a => a.date === today);
  if (todayAct) todayAct.xp += Number(amount);
  else DB.activity[req.user.uid].push({ date: today, xp: Number(amount), mcq: 0, chapters: 0 });

  res.json({ xp: user.xp, level: user.level, levelTitle: getLevelTitle(user.level), levelUp, xpAdded: amount, reason });
});

app.get('/api/xp/stats', authenticate, (req, res) => {
  const user = DB.users[req.user.uid];
  if (!user) return res.status(404).json({ error: 'User not found' });
  const nextXP = user.level * 500;
  const curXP = (user.level - 1) * 500;
  const progress = Math.min(100, Math.round(((user.xp - curXP) / (nextXP - curXP)) * 100));
  res.json({ xp: user.xp, level: user.level, levelTitle: getLevelTitle(user.level), nextLevelXP: nextXP, progressToNext: progress, badges: user.badges || [] });
});

app.post('/api/badges/award', authenticate, (req, res) => {
  const { badge } = req.body;
  if (!badge) return res.status(400).json({ error: 'Badge name required' });
  const user = DB.users[req.user.uid];
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!user.badges) user.badges = [];
  if (!user.badges.includes(badge)) user.badges.push(badge);
  res.json({ badges: user.badges, awarded: badge });
});

// ══════════════════════════════════════════════════════════════════════════════
// 📝 QUIZ ROUTES
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/quiz/submit', authenticate, (req, res) => {
  const { quizName, answers, score, totalQuestions, topic } = req.body;
  if (!quizName || score === undefined || !totalQuestions)
    return res.status(400).json({ error: 'quizName, score, totalQuestions required' });

  const accuracy = Math.round((score / totalQuestions) * 100);
  const xpEarned = Math.round(accuracy * 0.5 + score * 10);
  const result = { id: uuidv4(), userId: req.user.uid, quizName, topic, answers, score, totalQuestions, accuracy, xpEarned, createdAt: new Date().toISOString() };
  DB.quizResults.push(result);

  const user = DB.users[req.user.uid];
  if (user) { user.xp = (user.xp || 0) + xpEarned; user.level = calcLevel(user.xp); }

  if (!DB.mcqHistory[req.user.uid]) DB.mcqHistory[req.user.uid] = [];
  DB.mcqHistory[req.user.uid].unshift({ topic, score, total: totalQuestions, accuracy, xpEarned, timestamp: new Date().toISOString() });
  DB.mcqHistory[req.user.uid] = DB.mcqHistory[req.user.uid].slice(0, 50);

  res.status(201).json({ result, xpEarned, accuracy, levelTitle: getLevelTitle(user?.level || 1) });
});

app.get('/api/quiz/history', authenticate, (req, res) => {
  const history = DB.quizResults.filter(q => q.userId === req.user.uid).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20);
  res.json(history);
});

app.get('/api/quiz/stats', authenticate, (req, res) => {
  const r = DB.quizResults.filter(q => q.userId === req.user.uid);
  if (!r.length) return res.json({ totalAttempts: 0, avgAccuracy: 0, totalXPEarned: 0, bestScore: 0 });
  res.json({
    totalAttempts: r.length,
    avgAccuracy: Math.round(r.reduce((a,q) => a+q.accuracy, 0) / r.length),
    totalXPEarned: r.reduce((a,q) => a+q.xpEarned, 0),
    bestScore: Math.max(...r.map(q => q.accuracy)),
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 📊 CIVIC PROGRESS
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/civic/progress', authenticate, (req, res) => {
  res.json(DB.civicProgress[req.user.uid] || { chaptersRead:[], mcqAttempted:0, mcqCorrect:0, casesStudied:[], flashcardsReviewed:0, totalCivicXP:0, studyStreak:0 });
});

app.patch('/api/civic/progress', authenticate, (req, res) => {
  if (!DB.civicProgress[req.user.uid]) DB.civicProgress[req.user.uid] = {
    chaptersRead:[], mcqAttempted:0, mcqCorrect:0, casesStudied:[],
    flashcardsReviewed:0, totalCivicXP:0, studyStreak:0, lastStreakDate:'', lastStudied: new Date().toISOString(),
  };
  const p = DB.civicProgress[req.user.uid];
  const { chapterRead, caseStudied, mcqResult, flashcardsReviewed, xpEarned } = req.body;

  if (chapterRead && !p.chaptersRead.includes(chapterRead)) p.chaptersRead.push(chapterRead);
  if (caseStudied && !p.casesStudied.includes(caseStudied)) p.casesStudied.push(caseStudied);
  if (mcqResult) { p.mcqAttempted++; if (mcqResult.correct) p.mcqCorrect++; }
  if (flashcardsReviewed) p.flashcardsReviewed += Number(flashcardsReviewed);
  if (xpEarned) p.totalCivicXP += Number(xpEarned);

  const today = todayStr();
  if (p.lastStreakDate !== today) {
    const yesterday = new Date(Date.now()-86400000).toISOString().split('T')[0];
    p.studyStreak = p.lastStreakDate === yesterday ? p.studyStreak + 1 : 1;
    p.lastStreakDate = today;
  }
  p.lastStudied = new Date().toISOString();
  res.json(p);
});

app.get('/api/civic/mcq-history', authenticate, (req, res) => res.json(DB.mcqHistory[req.user.uid] || []));

app.post('/api/civic/mcq-session', authenticate, (req, res) => {
  const { topic, score, total, accuracy, xpEarned } = req.body;
  if (!DB.mcqHistory[req.user.uid]) DB.mcqHistory[req.user.uid] = [];
  const session = { topic, score, total, accuracy, xpEarned, timestamp: new Date().toISOString() };
  DB.mcqHistory[req.user.uid].unshift(session);
  DB.mcqHistory[req.user.uid] = DB.mcqHistory[req.user.uid].slice(0, 50);
  res.status(201).json(session);
});

// ══════════════════════════════════════════════════════════════════════════════
// 📅 ACTIVITY
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/activity', authenticate, (req, res) => {
  const activity = (DB.activity[req.user.uid] || []).sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,30);
  res.json(activity);
});

app.post('/api/activity/log', authenticate, (req, res) => {
  const { xp=0, mcq=0, chapters=0 } = req.body;
  if (!DB.activity[req.user.uid]) DB.activity[req.user.uid] = [];
  const today = todayStr();
  const existing = DB.activity[req.user.uid].find(a => a.date === today);
  if (existing) { existing.xp+=xp; existing.mcq+=mcq; existing.chapters+=chapters; return res.json(existing); }
  const entry = { date: today, xp, mcq, chapters };
  DB.activity[req.user.uid].push(entry);
  res.status(201).json(entry);
});

// ══════════════════════════════════════════════════════════════════════════════
// 🏆 GAME SCORES
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/scores', authenticate, (req, res) => {
  const { gameType, score, metadata = {} } = req.body;
  if (!gameType || score === undefined) return res.status(400).json({ error: 'gameType and score required' });
  const entry = { id: uuidv4(), userId: req.user.uid, displayName: DB.users[req.user.uid]?.displayName || 'Anonymous', gameType, score, metadata, createdAt: new Date().toISOString() };
  DB.scores.push(entry);
  res.status(201).json(entry);
});

app.get('/api/scores/:gameType', (req, res) => {
  const top = DB.scores.filter(s => s.gameType === req.params.gameType).sort((a,b) => b.score-a.score).slice(0,10).map(s => ({...s, userId: undefined}));
  res.json(top);
});

app.get('/api/scores/me/:gameType', authenticate, (req, res) => {
  const mine = DB.scores.filter(s => s.userId === req.user.uid && s.gameType === req.params.gameType).sort((a,b) => b.score-a.score);
  res.json({ best: mine[0] || null, history: mine.slice(0,10) });
});

// ══════════════════════════════════════════════════════════════════════════════
// 🗳️ ELECTION SIMULATOR
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/election/create', authenticate, (req, res) => {
  const { title, candidates, constituency } = req.body;
  if (!title || !candidates?.length) return res.status(400).json({ error: 'title and candidates required' });
  const id = uuidv4();
  DB.elections[id] = { id, title, candidates: candidates.map(c => ({...c, id: uuidv4(), votes:0})), constituency: constituency||'General', createdBy: req.user.uid, status:'open', voters:[], createdAt: new Date().toISOString() };
  res.status(201).json(DB.elections[id]);
});

app.post('/api/election/:id/vote', authenticate, (req, res) => {
  const el = DB.elections[req.params.id];
  if (!el) return res.status(404).json({ error: 'Election not found' });
  if (el.status !== 'open') return res.status(400).json({ error: 'Election is closed' });
  if (el.voters.includes(req.user.uid)) return res.status(409).json({ error: 'Already voted' });
  const candidate = el.candidates.find(c => c.id === req.body.candidateId);
  if (!candidate) return res.status(400).json({ error: 'Invalid candidate' });
  candidate.votes++;
  el.voters.push(req.user.uid);
  res.json({ message: 'Vote cast successfully', candidate: candidate.name });
});

app.get('/api/election/:id/results', (req, res) => {
  const el = DB.elections[req.params.id];
  if (!el) return res.status(404).json({ error: 'Election not found' });
  const total = el.candidates.reduce((a,c) => a+c.votes, 0);
  const results = el.candidates.map(c => ({...c, percentage: total ? Math.round((c.votes/total)*100) : 0})).sort((a,b) => b.votes-a.votes);
  res.json({ ...el, results, totalVotes: total });
});

app.patch('/api/election/:id/close', authenticate, (req, res) => {
  const el = DB.elections[req.params.id];
  if (!el) return res.status(404).json({ error: 'Election not found' });
  if (el.createdBy !== req.user.uid) return res.status(403).json({ error: 'Only creator can close election' });
  el.status = 'closed';
  res.json({ message: 'Election closed', id: el.id });
});

// ══════════════════════════════════════════════════════════════════════════════
// 🏫 CLASSROOM
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/classroom/create', authenticate, (req, res) => {
  const { name, subject = 'Civics' } = req.body;
  if (!name) return res.status(400).json({ error: 'Classroom name required' });
  const code = Math.random().toString(36).substr(2,6).toUpperCase();
  const id = uuidv4();
  DB.classrooms[id] = { id, name, subject, code, teacher: req.user.uid, students:[], assignments:[], createdAt: new Date().toISOString() };
  res.status(201).json(DB.classrooms[id]);
});

app.post('/api/classroom/join', authenticate, (req, res) => {
  const classroom = Object.values(DB.classrooms).find(c => c.code === req.body.code?.toUpperCase());
  if (!classroom) return res.status(404).json({ error: 'Invalid classroom code' });
  if (!classroom.students.includes(req.user.uid)) classroom.students.push(req.user.uid);
  res.json({ message: 'Joined classroom', classroom: { id: classroom.id, name: classroom.name, code: classroom.code } });
});

app.get('/api/classroom/my', authenticate, (req, res) => {
  const mine = Object.values(DB.classrooms).filter(c => c.teacher === req.user.uid || c.students.includes(req.user.uid));
  res.json(mine.map(c => ({ id:c.id, name:c.name, subject:c.subject, code:c.code, role: c.teacher === req.user.uid ? 'teacher':'student', studentCount: c.students.length })));
});

// ══════════════════════════════════════════════════════════════════════════════
// 📈 DASHBOARD SUMMARY
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/dashboard', authenticate, (req, res) => {
  const user = DB.users[req.user.uid];
  if (!user) return res.status(404).json({ error: 'User not found' });
  const myQuizzes = DB.quizResults.filter(q => q.userId === req.user.uid);
  res.json({
    user: { ...safeUser(user), levelTitle: getLevelTitle(user.level) },
    civicProgress: DB.civicProgress[req.user.uid] || {},
    quizStats: {
      totalAttempts: myQuizzes.length,
      avgAccuracy: myQuizzes.length ? Math.round(myQuizzes.reduce((a,q)=>a+q.accuracy,0)/myQuizzes.length) : 0,
    },
    recentActivity: (DB.activity[req.user.uid] || []).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,7),
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 🌐 HEALTH & FALLBACK
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/health', (req, res) => res.json({ status:'ok', app:'CivicaQuest Backend', version:'1.0.0', timestamp: new Date().toISOString(), users: Object.keys(DB.users).length }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../civica_enhanced/index.html'));
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║     CivicaQuest Backend — Node.js        ║
║     http://localhost:${PORT}                 ║
╚══════════════════════════════════════════╝`);
});

module.exports = app;
