/**
 * CivicaQuest Enhanced AI Assistant v5.0
 * Full React-based multilingual voice chatbot with stunning UI
 * Features: Voice input/output in 22 Indian languages, animated orb, particles
 */

// ─── React Components via CDN ───────────────────────────────────────────────
const { useState, useEffect, useRef, useCallback } = React;

// ─── Language voice codes for SpeechSynthesis & SpeechRecognition ───────────
const LANG_VOICE_CODES = {
  en:  'en-IN', hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN',
  mr:  'mr-IN', ta: 'ta-IN', gu: 'gu-IN', kn: 'kn-IN',
  ml:  'ml-IN', pa: 'pa-IN', or: 'or-IN', as: 'as-IN',
  ur:  'ur-IN', sa: 'sa-IN', ne: 'ne-NP',
  mai: 'hi-IN', kon: 'hi-IN', mni: 'bn-IN', doi: 'hi-IN',
  bo:  'hi-IN', ks: 'hi-IN', sd: 'ur-IN'
};

// ─── Civic knowledge base ────────────────────────────────────────────────────
const CIVIC_KNOWLEDGE = {
  voting: `🗳️ **Indian Voting Process**\n\n1. Register with valid Voter ID\n2. Get ink mark on finger at polling booth\n3. Officer activates the EVM ballot unit\n4. Press button next to your candidate\n5. VVPAT prints a paper slip for 7 seconds\n6. Your vote is securely recorded!\n\nPractice in the Voting Simulator! 🏃‍♂️`,
  vvpat: `📋 **VVPAT (Voter Verifiable Paper Audit Trail)**\n\nVVPAT adds transparency to EVM voting:\n✅ Prints candidate name + symbol\n✅ Slip visible for 7 seconds\n✅ Stored in sealed box for auditing\n✅ Ensures vote accuracy\n\nIntroduced in 2014 for greater trust!`,
  parliament: `🏛️ **Indian Parliament (संसद)**\n\n3 Parts:\n👑 President of India\n👥 Lok Sabha — 543 elected members\n🎓 Rajya Sabha — 245 members\n\nPowers:\n📜 Legislation\n💰 Budget approval\n🔍 Government oversight\n\nTry Parliament Simulator!`,
  constitution: `📜 **Indian Constitution**\nAdopted: 26 Jan 1950\n\n6 Fundamental Rights:\n1️⃣ Right to Equality (Art 14-18)\n2️⃣ Right to Freedom (Art 19-22)\n3️⃣ Right against Exploitation (Art 23-24)\n4️⃣ Freedom of Religion (Art 25-28)\n5️⃣ Cultural & Educational Rights (Art 29-30)\n6️⃣ Constitutional Remedies (Art 32)\n\nTest knowledge in Quiz! 📝`,
  budget: `💰 **Government Budget**\n\nKey sectors:\n📚 Education — 2.9% of GDP\n🏥 Healthcare — 2.1% of GDP\n🛡️ Defense — 2.4% of GDP\n🏗️ Infrastructure — ₹10L Cr+\n👨‍🌾 Agriculture — 18% of GDP\n\nPlay Budget Game to experience real allocation decisions!`,
  xp: `⭐ **XP & Gamification System**\n\n🎯 Earn XP by:\n• Completing modules (+50 XP each)\n• Daily missions (+20-40 XP)\n• Asking questions (+5 XP randomly)\n• Getting badges\n\n🏅 Level up every 100 XP\n🔓 Unlock new features as you grow!\n\nCheck your Portfolio for stats!`,
  help: `🤖 **I can help you with:**\n\n🗳️ Voting & EVM process\n📜 Constitution & rights\n🏛️ Parliament & law-making\n💰 Budget & governance\n🎮 Platform features\n⭐ XP, badges & missions\n🌐 Any civic topic!\n\nType or use 🎤 voice input to ask me anything!`
};

function getLocalReply(text) {
  const t = text.toLowerCase();
  if (t.includes('vvpat')) return CIVIC_KNOWLEDGE.vvpat;
  if (t.includes('vote') || t.includes('evm') || t.includes('voting')) return CIVIC_KNOWLEDGE.voting;
  if (t.includes('parliament') || t.includes('lok sabha') || t.includes('rajya')) return CIVIC_KNOWLEDGE.parliament;
  if (t.includes('constitution') || t.includes('fundamental right')) return CIVIC_KNOWLEDGE.constitution;
  if (t.includes('budget')) return CIVIC_KNOWLEDGE.budget;
  if (t.includes('xp') || t.includes('badge') || t.includes('level') || t.includes('mission')) return CIVIC_KNOWLEDGE.xp;
  if (t.includes('help') || t.includes('guide') || t.includes('how')) return CIVIC_KNOWLEDGE.help;
  return null;
}

// ─── Message component ───────────────────────────────────────────────────────
function Message({ msg, onSpeak }) {
  const isBot = msg.role === 'bot';
  const formattedText = msg.text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  return React.createElement('div', {
    className: `cq-msg ${isBot ? 'cq-msg-bot' : 'cq-msg-user'}`,
    style: { animationDelay: '0ms' }
  },
    isBot && React.createElement('div', { className: 'cq-msg-avatar' }, '🤖'),
    React.createElement('div', { className: 'cq-msg-bubble' },
      React.createElement('div', {
        className: 'cq-msg-text',
        dangerouslySetInnerHTML: { __html: formattedText }
      }),
      isBot && msg.text.length > 20 && React.createElement('button', {
        className: 'cq-speak-btn',
        onClick: () => onSpeak(msg.text.replace(/[*#🎤🤖]/g, '')),
        title: 'Read aloud'
      }, '🔊')
    )
  );
}

// ─── Voice Orb Component ─────────────────────────────────────────────────────
function VoiceOrb({ isListening, isSpeaking, onClick }) {
  return React.createElement('button', {
    className: `cq-voice-orb ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`,
    onClick,
    title: isListening ? 'Stop listening' : 'Voice input'
  },
    React.createElement('div', { className: 'cq-orb-inner' },
      isListening
        ? React.createElement('div', { className: 'cq-orb-waves' },
            [1,2,3].map(i => React.createElement('div', { key: i, className: 'cq-orb-wave', style: { animationDelay: `${i * 0.15}s` } }))
          )
        : React.createElement('span', { className: 'cq-orb-icon' }, '🎤')
    )
  );
}

// ─── Language Selector ───────────────────────────────────────────────────────
function LangSelector({ currentLang, onChangeLang, langs }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef();

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = Object.entries(langs).filter(([code, info]) =>
    !search || info.name.toLowerCase().includes(search.toLowerCase()) || info.native.includes(search) || code.includes(search.toLowerCase())
  );

  return React.createElement('div', { className: 'cq-lang-sel', ref },
    React.createElement('button', {
      className: 'cq-lang-sel-btn',
      onClick: () => setOpen(o => !o),
      title: 'Change language'
    },
      React.createElement('span', null, '🌐'),
      React.createElement('span', null, (langs[currentLang]?.native || 'EN').slice(0, 4)),
      React.createElement('span', { className: 'cq-caret' }, open ? '▴' : '▾')
    ),
    open && React.createElement('div', { className: 'cq-lang-sel-dropdown' },
      React.createElement('input', {
        className: 'cq-lang-sel-search',
        placeholder: '🔍 Search language...',
        value: search,
        onChange: e => setSearch(e.target.value),
        autoFocus: true
      }),
      React.createElement('div', { className: 'cq-lang-sel-grid' },
        filtered.map(([code, info]) =>
          React.createElement('button', {
            key: code,
            className: `cq-lang-sel-opt ${currentLang === code ? 'active' : ''}`,
            onClick: () => { onChangeLang(code); setOpen(false); setSearch(''); }
          },
            React.createElement('span', { className: 'cq-lang-native' }, info.native),
            React.createElement('span', { className: 'cq-lang-en' }, info.name)
          )
        )
      )
    )
  );
}

// ─── Main Chatbot App ────────────────────────────────────────────────────────
function CivicaChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{
    id: 1, role: 'bot',
    text: '👋 Namaste! I\'m **Priya**, your AI civic guide!\n\nI speak **22 Indian languages** and can answer via **voice** too!\n\nAsk me:\n🗳️ "How does EVM work?"\n📜 "What are fundamental rights?"\n🏛️ "Tell me about Parliament"\n\nOr tap 🎤 to speak!'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [elderMode, setElderMode] = useState(false);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [pulse, setPulse] = useState(false);
  const [tab, setTab] = useState('chat'); // 'chat' | 'missions'
  const [missions, setMissions] = useState([
    { id: 'm1', title: 'Explore a Module', xp: 20, done: false },
    { id: 'm2', title: 'Complete a Quiz', xp: 40, done: false },
    { id: 'm3', title: 'Ask the AI 3 questions', xp: 30, done: false, count: 0 }
  ]);

  const logRef = useRef();
  const recRef = useRef(null);
  const LANGS = window.CQ_LANG?.LANGUAGES || {
    en: { name: 'English', native: 'English', dir: 'ltr' },
    hi: { name: 'Hindi', native: 'हिन्दी', dir: 'ltr' },
    bn: { name: 'Bengali', native: 'বাংলা', dir: 'ltr' },
    te: { name: 'Telugu', native: 'తెలుగు', dir: 'ltr' },
    mr: { name: 'Marathi', native: 'मराठी', dir: 'ltr' },
    ta: { name: 'Tamil', native: 'தமிழ்', dir: 'ltr' },
    gu: { name: 'Gujarati', native: 'ગુજરાતી', dir: 'ltr' },
    kn: { name: 'Kannada', native: 'ಕನ್ನಡ', dir: 'ltr' },
    ml: { name: 'Malayalam', native: 'മലയാളം', dir: 'ltr' },
    pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', dir: 'ltr' },
    ur: { name: 'Urdu', native: 'اردو', dir: 'rtl' }
  };

  // Sync language with global CQ_LANG
  useEffect(() => {
    const saved = localStorage.getItem('cq_language') || 'en';
    setCurrentLang(saved);
    const savedState = JSON.parse(localStorage.getItem('cq_state') || '{}');
    if (savedState.xp) setXp(savedState.xp);
    if (savedState.level) setLevel(savedState.level);
    if (savedState.elderMode) setElderMode(savedState.elderMode);
  }, []);

  // Pulse the button periodically
  useEffect(() => {
    const t = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 600); }, 8000);
    return () => clearInterval(t);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  const addXP = useCallback((amount, reason = '') => {
    setXp(prev => {
      const newXp = prev + amount;
      const newLevel = Math.max(1, Math.floor(newXp / 100) + 1);
      setLevel(newLevel);
      const state = JSON.parse(localStorage.getItem('cq_state') || '{}');
      localStorage.setItem('cq_state', JSON.stringify({ ...state, xp: newXp, level: newLevel }));
      showToast(`+${amount} XP ${reason}`);
      return newXp;
    });
  }, []);

  const showToast = (msg) => {
    const el = document.getElementById('cq-toast-global') || document.getElementById('cq_toast');
    if (el) {
      el.textContent = msg;
      el.classList.add('show');
      el.style.opacity = '1';
      setTimeout(() => { el.classList.remove('show'); el.style.opacity = '0'; }, 2500);
    }
  };

  const speak = useCallback((text, lang = null) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[*🎤🤖👋📜🗳️🏛️💰⭐🔓✅📋👑👥🎓]/g, ''));
    u.lang = LANG_VOICE_CODES[lang || currentLang] || 'en-IN';
    u.rate = elderMode ? 0.8 : 1.0;
    u.pitch = 1.1;
    setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [currentLang, elderMode]);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showToast('⚠️ Voice not supported in this browser'); return; }

    if (isListening) {
      recRef.current?.stop();
      setIsListening(false);
      return;
    }

    const rec = new SR();
    recRef.current = rec;
    rec.lang = LANG_VOICE_CODES[currentLang] || 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setIsListening(true);

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      setTimeout(() => sendMessage(transcript), 300);
    };
    rec.onerror = () => { setIsListening(false); showToast('🎤 Could not hear you, try again'); };
    rec.onend = () => setIsListening(false);
    rec.start();
  }, [isListening, currentLang]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    const userMsg = { id: Date.now(), role: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Update missions
    setMissions(prev => prev.map(m => {
      if (m.id === 'm3' && !m.done) {
        const newCount = (m.count || 0) + 1;
        if (newCount >= 3) { addXP(m.xp, '• Mission: Ask AI 3 questions'); return { ...m, done: true, count: newCount }; }
        return { ...m, count: newCount };
      }
      return m;
    }));

    // Random XP for asking
    if (Math.random() < 0.4) addXP(5, '• Curious learner');

    // Try local knowledge first
    const localReply = getLocalReply(msg);
    const langCode = currentLang;
    const langInfo = LANGS[langCode];

    if (localReply && langCode === 'en') {
      setTimeout(() => {
        const botMsg = { id: Date.now() + 1, role: 'bot', text: localReply };
        setMessages(prev => [...prev, botMsg]);
        setLoading(false);
        if (elderMode) speak(localReply);
      }, 600);
      return;
    }

    // Use AI API for non-English or complex questions
    try {
      const systemPrompt = langCode !== 'en'
        ? `You are Priya, CivicaQuest AI civic education assistant for Indian students Class 9-12. Respond ONLY in ${langInfo?.name || 'Hindi'} (${langInfo?.native || 'हिन्दी'}). Keep proper nouns EVM, VVPAT, Lok Sabha, Rajya Sabha, CivicaQuest unchanged. Be helpful, friendly, educational. Keep responses under 150 words. Use emojis.`
        : `You are Priya, CivicaQuest AI civic education assistant for Indian students Class 9-12. Focus on Indian civics, constitution, democracy, elections, parliament, government. Be friendly, use emojis, keep responses under 150 words. Mention relevant platform features (Voting Simulator, Parliament Sim, Quiz, Budget Game) when relevant.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 350,
          system: systemPrompt,
          messages: [
            ...messages.slice(-6).map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text })),
            { role: "user", content: msg }
          ]
        })
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || (localReply || '🤔 I can help with Indian civics! Try asking about voting, constitution, or parliament.');

      const botMsg = { id: Date.now() + 1, role: 'bot', text: reply };
      setMessages(prev => [...prev, botMsg]);
      if (elderMode) speak(reply);
    } catch (e) {
      const fallback = localReply || getLocalReply('help');
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: fallback }]);
    }
    setLoading(false);
  }, [input, messages, currentLang, elderMode, speak, addXP]);

  const handleLangChange = (code) => {
    setCurrentLang(code);
    if (window.CQ_LANG) window.CQ_LANG.applyLanguage(code);
    localStorage.setItem('cq_language', code);
    showToast(`🌐 ${LANGS[code]?.native || code}`);
  };

  const completeMission = (id) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id && !m.done) { addXP(m.xp, `• Mission: ${m.title}`); return { ...m, done: true }; }
      return m;
    }));
  };

  const progressPct = (xp % 100);

  return React.createElement(React.Fragment, null,
    // ── Floating Trigger Button ──
    React.createElement('button', {
      className: `cq-fab ${open ? 'cq-fab-open' : ''} ${pulse ? 'cq-fab-pulse' : ''}`,
      onClick: () => setOpen(o => !o),
      'aria-label': 'Open AI Assistant'
    },
      open
        ? React.createElement('span', { style: { fontSize: '1.4rem' } }, '✕')
        : React.createElement('div', { className: 'cq-fab-inner' },
            React.createElement('div', { className: 'cq-fab-orb' },
              React.createElement('span', { className: 'cq-fab-icon' }, '🤖'),
              React.createElement('div', { className: 'cq-fab-ring' })
            ),
            React.createElement('div', { className: 'cq-fab-badge' }, level)
          )
    ),

    // ── Chat Panel ──
    open && React.createElement('div', {
      className: `cq-panel ${open ? 'cq-panel-open' : ''}`,
      dir: LANGS[currentLang]?.dir || 'ltr'
    },
      // Header
      React.createElement('div', { className: 'cq-panel-header' },
        React.createElement('div', { className: 'cq-panel-avatar' },
          React.createElement('div', { className: 'cq-avatar-orb' }, '🤖'),
          React.createElement('div', { className: 'cq-status-dot' })
        ),
        React.createElement('div', { className: 'cq-panel-info' },
          React.createElement('div', { className: 'cq-panel-name' }, 'Priya AI'),
          React.createElement('div', { className: 'cq-panel-sub' },
            React.createElement('span', { className: 'cq-online-dot' }),
            ' Online • 22 Languages'
          )
        ),
        React.createElement('div', { className: 'cq-panel-controls' },
          React.createElement('button', {
            className: `cq-ctrl-btn ${elderMode ? 'active' : ''}`,
            onClick: () => { setElderMode(e => !e); showToast(elderMode ? 'Elder Mode OFF' : '👴 Elder Mode ON'); },
            title: 'Elder Mode'
          }, '👴'),
          React.createElement(LangSelector, { currentLang, onChangeLang: handleLangChange, langs: LANGS }),
          React.createElement('button', {
            className: 'cq-ctrl-btn cq-close-btn',
            onClick: () => setOpen(false)
          }, '✕')
        )
      ),

      // XP Bar
      React.createElement('div', { className: 'cq-xp-bar' },
        React.createElement('div', { className: 'cq-xp-info' },
          React.createElement('span', null, `⚡ ${xp} XP`),
          React.createElement('span', null, `Level ${level}`)
        ),
        React.createElement('div', { className: 'cq-xp-track' },
          React.createElement('div', {
            className: 'cq-xp-fill',
            style: { width: `${progressPct}%` }
          })
        )
      ),

      // Tabs
      React.createElement('div', { className: 'cq-tabs' },
        React.createElement('button', {
          className: `cq-tab ${tab === 'chat' ? 'active' : ''}`,
          onClick: () => setTab('chat')
        }, '💬 Chat'),
        React.createElement('button', {
          className: `cq-tab ${tab === 'missions' ? 'active' : ''}`,
          onClick: () => setTab('missions')
        }, '🎯 Missions')
      ),

      // Content
      tab === 'chat'
        ? React.createElement(React.Fragment, null,
            // Message log
            React.createElement('div', { className: 'cq-msg-log', ref: logRef },
              messages.map(msg => React.createElement(Message, { key: msg.id, msg, onSpeak: speak })),
              loading && React.createElement('div', { className: 'cq-msg cq-msg-bot' },
                React.createElement('div', { className: 'cq-msg-avatar' }, '🤖'),
                React.createElement('div', { className: 'cq-msg-bubble' },
                  React.createElement('div', { className: 'cq-typing' },
                    [1,2,3].map(i => React.createElement('span', { key: i, className: 'cq-dot', style: { animationDelay: `${i * 0.15}s` } }))
                  )
                )
              )
            ),

            // Quick prompts
            messages.length <= 2 && React.createElement('div', { className: 'cq-quick-prompts' },
              ['How does EVM work?', 'What is Parliament?', 'Fundamental Rights', 'Budget Game help'].map(q =>
                React.createElement('button', {
                  key: q,
                  className: 'cq-quick-btn',
                  onClick: () => sendMessage(q)
                }, q)
              )
            ),

            // Input area
            React.createElement('div', { className: 'cq-input-area' },
              React.createElement(VoiceOrb, { isListening, isSpeaking, onClick: startListening }),
              React.createElement('input', {
                className: 'cq-input',
                placeholder: window.CQ_LANG?.t('ai.placeholder') || 'Ask me anything...',
                value: input,
                onChange: e => setInput(e.target.value),
                onKeyDown: e => e.key === 'Enter' && sendMessage(),
                dir: LANGS[currentLang]?.dir || 'ltr'
              }),
              React.createElement('button', {
                className: 'cq-send-btn',
                onClick: () => sendMessage(),
                disabled: !input.trim() && !loading
              }, '➤')
            )
          )
        : // Missions tab
          React.createElement('div', { className: 'cq-missions' },
            React.createElement('div', { className: 'cq-missions-header' }, '🎯 Daily Missions'),
            missions.map(m =>
              React.createElement('div', {
                key: m.id,
                className: `cq-mission ${m.done ? 'done' : ''}`
              },
                React.createElement('div', { className: 'cq-mission-check' }, m.done ? '✅' : '⬜'),
                React.createElement('div', { className: 'cq-mission-info' },
                  React.createElement('div', { className: 'cq-mission-title' }, m.title),
                  React.createElement('div', { className: 'cq-mission-xp' }, `+${m.xp} XP`),
                  m.id === 'm3' && !m.done && React.createElement('div', { className: 'cq-mission-progress' }, `Asked: ${m.count || 0}/3`)
                ),
                !m.done && m.id !== 'm3' && React.createElement('button', {
                  className: 'cq-mission-btn',
                  onClick: () => completeMission(m.id)
                }, 'Complete')
              )
            ),
            React.createElement('div', { className: 'cq-missions-tip' },
              '💡 Complete all missions for the Daily Achiever badge!'
            )
          )
    )
  );
}

// ─── Inject React chatbot ────────────────────────────────────────────────────
function initCivicaBot() {
  const container = document.createElement('div');
  container.id = 'cq-react-bot';
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(CivicaChatbot), container);
}

// Wait for React to load
function waitForReact(cb, attempts = 0) {
  if (window.React && window.ReactDOM) { cb(); return; }
  if (attempts > 50) { console.warn('React not available, chatbot disabled'); return; }
  setTimeout(() => waitForReact(cb, attempts + 1), 100);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => waitForReact(initCivicaBot));
} else {
  waitForReact(initCivicaBot);
}

window.CivicaChatbot = CivicaChatbot;
