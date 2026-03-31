/**
 * CivicaQuest — Backend API Client
 * Drop this file into civica_enhanced/ and import it in your HTML files.
 *
 * Usage:
 *   <script src="api.js"></script>
 *   const { token, user } = await CivicAPI.auth.login(email, password);
 */

const CivicAPI = (() => {
  const BASE = 'http://localhost:3000/api'; // Change to your deployed URL in production

  // ── Token Storage ────────────────────────────────────────────────────────────
  const getToken = () => localStorage.getItem('civicaquest_token');
  const setToken = t => localStorage.setItem('civicaquest_token', t);
  const clearToken = () => localStorage.removeItem('civicaquest_token');

  // ── Core Fetch ───────────────────────────────────────────────────────────────
  async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const res = await fetch(`${BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API request failed');
    return data;
  }

  // ── Auth ─────────────────────────────────────────────────────────────────────
  const auth = {
    async register(email, password, displayName) {
      const r = await apiFetch('/auth/register', { method: 'POST', body: { email, password, displayName } });
      setToken(r.token);
      return r;
    },
    async login(email, password) {
      const r = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
      setToken(r.token);
      return r;
    },
    async demo() {
      const r = await apiFetch('/auth/demo', { method: 'POST' });
      setToken(r.token);
      return r;
    },
    logout() { clearToken(); window.location.href = 'auth.html'; },
    isLoggedIn: () => !!getToken(),
  };

  // ── User ─────────────────────────────────────────────────────────────────────
  const user = {
    me: () => apiFetch('/users/me'),
    update: (data) => apiFetch('/users/me', { method: 'PATCH', body: data }),
  };

  // ── XP ───────────────────────────────────────────────────────────────────────
  const xp = {
    add: (amount, reason) => apiFetch('/xp/add', { method: 'POST', body: { amount, reason } }),
    stats: () => apiFetch('/xp/stats'),
    awardBadge: (badge) => apiFetch('/badges/award', { method: 'POST', body: { badge } }),
  };

  // ── Quiz ─────────────────────────────────────────────────────────────────────
  const quiz = {
    submit: (quizName, answers, score, totalQuestions, topic) =>
      apiFetch('/quiz/submit', { method: 'POST', body: { quizName, answers, score, totalQuestions, topic } }),
    history: () => apiFetch('/quiz/history'),
    stats: () => apiFetch('/quiz/stats'),
  };

  // ── Civic Progress ───────────────────────────────────────────────────────────
  const civic = {
    getProgress: () => apiFetch('/civic/progress'),
    updateProgress: (data) => apiFetch('/civic/progress', { method: 'PATCH', body: data }),
    getMCQHistory: () => apiFetch('/civic/mcq-history'),
    saveMCQSession: (topic, score, total, accuracy, xpEarned) =>
      apiFetch('/civic/mcq-session', { method: 'POST', body: { topic, score, total, accuracy, xpEarned } }),
  };

  // ── Activity ─────────────────────────────────────────────────────────────────
  const activity = {
    get: () => apiFetch('/activity'),
    log: (xp, mcq, chapters) => apiFetch('/activity/log', { method: 'POST', body: { xp, mcq, chapters } }),
  };

  // ── Scores ───────────────────────────────────────────────────────────────────
  const scores = {
    submit: (gameType, score, metadata) =>
      apiFetch('/scores', { method: 'POST', body: { gameType, score, metadata } }),
    getTop: (gameType) => apiFetch(`/scores/${gameType}`),
    getMyBest: (gameType) => apiFetch(`/scores/me/${gameType}`),
  };

  // ── Election ─────────────────────────────────────────────────────────────────
  const election = {
    create: (title, candidates, constituency) =>
      apiFetch('/election/create', { method: 'POST', body: { title, candidates, constituency } }),
    vote: (id, candidateId) =>
      apiFetch(`/election/${id}/vote`, { method: 'POST', body: { candidateId } }),
    results: (id) => apiFetch(`/election/${id}/results`),
    close: (id) => apiFetch(`/election/${id}/close`, { method: 'PATCH' }),
  };

  // ── Classroom ─────────────────────────────────────────────────────────────────
  const classroom = {
    create: (name, subject) =>
      apiFetch('/classroom/create', { method: 'POST', body: { name, subject } }),
    join: (code) => apiFetch('/classroom/join', { method: 'POST', body: { code } }),
    myClassrooms: () => apiFetch('/classroom/my'),
  };

  // ── Dashboard ─────────────────────────────────────────────────────────────────
  const dashboard = {
    get: () => apiFetch('/dashboard'),
  };

  return { auth, user, xp, quiz, civic, activity, scores, election, classroom, dashboard };
})();

// Make globally available
window.CivicAPI = CivicAPI;
