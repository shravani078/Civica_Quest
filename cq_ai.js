/**
 * CivicaQuest AI Assistant - Enhanced Version
 * Features: Voice assistant, chatbot, elder mode, missions, XP/badges, feature guidance
 */

const CQ = {
  state: {
    elderMode: false,
    xp: 0,
    level: 1,
    badges: [],
    lastDailyReset: null,
    missions: [],
    completedMissions: [],
    hasSeenTutorial: false
  }
};

function cqLoad() {
  try {
    const saved = JSON.parse(localStorage.getItem("cq_state") || "{}");
    CQ.state = { ...CQ.state, ...saved };
  } catch (e) {}
  cqRecalcLevel();
  cqDailyResetIfNeeded();
  cqApplyElderMode(CQ.state.elderMode, true);
  
  // Show welcome tutorial for new users
  if (!CQ.state.hasSeenTutorial) {
    setTimeout(() => cqShowWelcomeTutorial(), 2000);
  }
}

function cqSave() {
  localStorage.setItem("cq_state", JSON.stringify(CQ.state));
}

function cqRecalcLevel() {
  CQ.state.level = Math.max(1, Math.floor(CQ.state.xp / 100) + 1);
}

function cqAddXP(amount, reason="") {
  CQ.state.xp += amount;
  cqRecalcLevel();
  cqSave();
  cqToast(`+${amount} XP ${reason ? "• " + reason : ""}`);
  cqUpdateHUD();
}

function cqUnlockBadge(name) {
  if (!CQ.state.badges.includes(name)) {
    CQ.state.badges.push(name);
    cqSave();
    cqToast(`🏅 Badge Unlocked: ${name}`);
    cqSpeak(`Congratulations! You earned the ${name} badge!`);
  }
  cqUpdateHUD();
}

function cqToast(msg) {
  let t = document.getElementById("cq_toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "cq_toast";
    t.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #111;
      color: #fff;
      padding: 12px 16px;
      border-radius: 12px;
      z-index: 99999;
      font-size: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      transition: opacity 0.3s;
    `;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  setTimeout(() => { t.style.opacity = "0"; }, 2500);
}

function cqSpeak(text) {
  if (!("speechSynthesis" in window)) {
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  u.rate = CQ.state.elderMode ? 0.85 : 1.0;
  u.pitch = 1.0;
  u.lang = "en-IN";
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

function cqApplyElderMode(on, silent=false) {
  CQ.state.elderMode = on;
  document.documentElement.classList.toggle("cq-elder", on);
  cqSave();
  cqUpdateHUD();
  if (!silent) {
    cqToast(on ? "👴 Elder Mode Enabled" : "Elder Mode Disabled");
    if (on) cqSpeak("Elder mode is now enabled. Text is larger and speech is slower.");
  }
}

function cqDailyResetIfNeeded() {
  const today = new Date().toISOString().slice(0,10);
  if (CQ.state.lastDailyReset !== today) {
    CQ.state.lastDailyReset = today;
    CQ.state.completedMissions = [];
    CQ.state.missions = [
      { id: "m1", title: "Explore a Civic Feature", xp: 20 },
      { id: "m2", title: "Complete a Quiz or Game", xp: 40 },
      { id: "m3", title: "Learn About Voting Process", xp: 30 }
    ];
    cqSave();
  }
}

function cqCompleteMission(id) {
  const mission = CQ.state.missions.find(m => m.id === id);
  if (!mission) return;
  if (CQ.state.completedMissions.includes(id)) return;

  CQ.state.completedMissions.push(id);
  cqAddXP(mission.xp, "Mission: " + mission.title);
  cqSave();

  if (CQ.state.completedMissions.length === 3) {
    cqUnlockBadge("Daily Achiever");
  }
}

function cqGetFeatureGuide(feature) {
  const guides = {
    voting: {
      title: "🗳️ Voting Simulator Guide",
      steps: [
        "Learn how EVM (Electronic Voting Machine) works",
        "Understand VVPAT - paper trail verification",
        "Practice voter registration process",
        "Experience secure ballot casting",
        "View real-time election results"
      ],
      tip: "The voting simulator teaches you the complete democratic process from registration to results!"
    },
    budget: {
      title: "💰 Budget Allocation Game",
      steps: [
        "Understand government budget priorities",
        "Learn to balance different sectors",
        "Make strategic allocation decisions",
        "See impact of your choices",
        "Compete for high scores"
      ],
      tip: "Good budgeting requires balancing education, healthcare, defense, and infrastructure!"
    },
    quiz: {
      title: "📜 Constitution Quiz",
      steps: [
        "Test your knowledge of Indian Constitution",
        "Learn about fundamental rights",
        "Understand directive principles",
        "Study constitutional amendments",
        "Track your improvement"
      ],
      tip: "The Constitution is the supreme law - knowing it makes you a better citizen!"
    },
    parliament: {
      title: "🏛️ Parliament Simulator",
      steps: [
        "Experience law-making process",
        "Understand Lok Sabha and Rajya Sabha",
        "Learn about bill passage",
        "Participate in debates",
        "See democracy in action"
      ],
      tip: "Parliament is where laws are made - see how your representatives work!"
    },
    leaderboard: {
      title: "🏆 Leaderboard System",
      steps: [
        "View rankings of all players",
        "Track your personal progress",
        "Compare scores with others",
        "Earn badges and achievements",
        "Climb the ranks by playing"
      ],
      tip: "Compete globally and improve your civic knowledge ranking!"
    }
  };

  return guides[feature] || guides.voting;
}

function cqShowFeatureGuide(featureName) {
  const guide = cqGetFeatureGuide(featureName);
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;
  
  modal.innerHTML = `
    <div style="
      background: white;
      border-radius: 20px;
      padding: 30px;
      max-width: 500px;
      width: 100%;
      color: #333;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    ">
      <h2 style="margin-top: 0; color: #667eea;">${guide.title}</h2>
      <h4 style="color: #666;">How to Use:</h4>
      <ol style="line-height: 2; padding-left: 20px;">
        ${guide.steps.map(step => `<li>${step}</li>`).join('')}
      </ol>
      <div style="
        background: #e6f7ff;
        padding: 15px;
        border-radius: 10px;
        margin: 20px 0;
        border-left: 4px solid #1890ff;
      ">
        <strong>💡 Pro Tip:</strong> ${guide.tip}
      </div>
      <div style="display: flex; gap: 10px;">
        <button onclick="cqSpeak('${guide.tip}')" style="
          flex: 1;
          padding: 12px;
          background: #48bb78;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        ">🔊 Read Aloud</button>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="
          flex: 1;
          padding: 12px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        ">Got It!</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

function cqShowWelcomeTutorial() {
  CQ.state.hasSeenTutorial = true;
  cqSave();
  
  const tutorial = document.createElement('div');
  tutorial.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;
  
  tutorial.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 25px;
      padding: 40px;
      max-width: 600px;
      width: 100%;
      color: white;
      box-shadow: 0 25px 80px rgba(0,0,0,0.5);
      text-align: center;
    ">
      <div style="font-size: 4rem; margin-bottom: 20px;">🤖</div>
      <h1 style="margin-top: 0; font-size: 2rem;">Welcome to CivicaQuest!</h1>
      <p style="font-size: 1.2rem; line-height: 1.6; margin: 20px 0;">
        I'm your AI assistant, here to help you become a better citizen!
      </p>
      <div style="
        background: rgba(255,255,255,0.1);
        padding: 20px;
        border-radius: 15px;
        margin: 25px 0;
        text-align: left;
      ">
        <h3>✨ What I Can Do:</h3>
        <ul style="line-height: 2; font-size: 1.1rem;">
          <li>📖 Guide you through each feature</li>
          <li>🔊 Provide voice assistance</li>
          <li>🎯 Track your progress & missions</li>
          <li>💬 Answer civic questions</li>
          <li>👴 Enable elder-friendly mode</li>
        </ul>
      </div>
      <p style="font-size: 1.1rem; opacity: 0.9;">
        Click the <strong>AI Helper</strong> button anytime for assistance!
      </p>
      <button onclick="this.closest('div[style*=fixed]').remove(); cqSpeak('Welcome to CivicaQuest! Lets start learning together.');" style="
        padding: 15px 40px;
        background: white;
        color: #667eea;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 700;
        font-size: 1.1rem;
        margin-top: 20px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      ">Let's Get Started! 🚀</button>
    </div>
  `;
  
  document.body.appendChild(tutorial);
}

function cqChatbotReply(userText) {
  const t = (userText || "").toLowerCase().trim();

  // Enhanced responses with more detail
  const rules = [
    { 
      keys: ["how to vote", "voting process", "evm"], 
      reply: "The voting process in India:\n1️⃣ Show your Voter ID\n2️⃣ Get ink mark on finger\n3️⃣ Officer enables the ballot unit\n4️⃣ Press the button next to your candidate\n5️⃣ VVPAT prints a slip showing your choice\n6️⃣ Your vote is securely recorded!\n\nThe Voting Simulator lets you practice this entire process!" 
    },
    { 
      keys: ["vvpat"], 
      reply: "VVPAT (Voter Verifiable Paper Audit Trail) is a crucial feature that:\n✅ Prints your selected candidate's name and symbol\n✅ Displays the slip for 7 seconds\n✅ Stores it securely in a sealed box\n✅ Allows vote verification and auditing\n\nIt adds transparency to electronic voting!" 
    },
    { 
      keys: ["parliament", "lok sabha", "rajya sabha"], 
      reply: "Indian Parliament has three parts:\n🏛️ President of India\n👥 Lok Sabha (House of the People) - 543 members\n🎓 Rajya Sabha (Council of States) - 245 members\n\nThey work together to:\n📜 Make laws\n💰 Approve budgets\n🔍 Check the government\n\nTry the Parliament Simulator to see how laws are made!" 
    },
    { 
      keys: ["constitution", "fundamental rights"], 
      reply: "The Indian Constitution (adopted 1950) is our supreme law!\n\n6 Fundamental Rights:\n1️⃣ Right to Equality\n2️⃣ Right to Freedom\n3️⃣ Right against Exploitation\n4️⃣ Right to Freedom of Religion\n5️⃣ Cultural and Educational Rights\n6️⃣ Right to Constitutional Remedies\n\nTake the Constitution Quiz to test your knowledge!" 
    },
    { 
      keys: ["budget", "allocation"], 
      reply: "Government budget is divided among:\n📚 Education\n🏥 Healthcare\n🛡️ Defense\n🏗️ Infrastructure\n👨‍🌾 Agriculture\n\nThe Budget Game teaches you to balance these priorities wisely!" 
    },
    { 
      keys: ["elder", "elder mode"], 
      reply: "Elder Mode makes CivicaQuest more accessible:\n👓 Larger fonts for better readability\n🔊 Slower speech for clarity\n📱 Enhanced buttons and controls\n\nClick 'Elder Mode' button in the top-right corner to enable it!" 
    },
    { 
      keys: ["xp", "badge", "level", "points"], 
      reply: "Gamification System:\n⭐ Earn XP by completing missions\n🎯 Level up every 100 XP\n🏅 Unlock badges for achievements\n🏆 Compete on the leaderboard\n\nDaily Missions refresh every day - complete them all to earn the 'Daily Achiever' badge!" 
    },
    { 
      keys: ["mission", "daily", "quest"], 
      reply: "Daily Missions help structure your learning:\n✅ Explore a Civic Feature (20 XP)\n✅ Complete a Quiz or Game (40 XP)\n✅ Learn About Voting Process (30 XP)\n\nComplete all 3 to unlock the Daily Achiever badge!" 
    },
    { 
      keys: ["leaderboard", "ranking", "score"], 
      reply: "The Leaderboard shows:\n📊 Real-time rankings of all users\n🎮 Scores from Budget Game and Constitution Quiz\n🏅 Badges earned by each player\n📈 Your global rank\n\nPlay games to improve your score and climb the rankings!" 
    },
    { 
      keys: ["help", "guide", "how"], 
      reply: "I can help you with:\n🗳️ Voting & EVM process\n📜 Constitution & rights\n🏛️ Parliament & law-making\n💰 Budget allocation\n🎮 How to use features\n📊 XP, badges & missions\n\nJust ask me anything! Or click on any feature for a detailed guide." 
    }
  ];

  for (const r of rules) {
    if (r.keys.some(k => t.includes(k))) {
      return r.reply;
    }
  }

  return "I'm here to help you learn about:\n\n🗳️ Voting & Democracy\n📜 Constitution & Rights\n🏛️ Parliament & Government\n💰 Budget & Governance\n🎮 Platform Features\n\nWhat would you like to know about?";
}

function cqUpdateHUD() {
  const hud = document.getElementById("cq_hud");
  if (!hud) return;
  hud.querySelector("#cq_xp").textContent = CQ.state.xp;
  hud.querySelector("#cq_level").textContent = CQ.state.level;
  hud.querySelector("#cq_badges").textContent = CQ.state.badges.length;
  
  const elderBtn = document.getElementById("cq_elder_toggle");
  if (elderBtn) {
    elderBtn.style.background = CQ.state.elderMode ? "#4caf50" : "#eee";
    elderBtn.style.color = CQ.state.elderMode ? "white" : "#333";
  }
}

function cqInjectHUD() {
  if (document.getElementById("cq_hud")) return;

  // Create floating AI button
  const aiButton = document.createElement("div");
  aiButton.id = "cq_ai_button";
  aiButton.innerHTML = "🤖";
  aiButton.title = "AI Assistant";
  document.body.appendChild(aiButton);

  // Create collapsible HUD
  const hud = document.createElement("div");
  hud.id = "cq_hud";
  hud.innerHTML = `
    <div class="cq-hud-card">
      <div class="cq-hud-title">🎮 CivicaQuest Progress</div>
      <div class="cq-hud-row">
        <span>XP: <b id="cq_xp">0</b></span>
        <span>Level: <b id="cq_level">1</b></span>
        <span>Badges: <b id="cq_badges">0</b></span>
      </div>
      <div class="cq-hud-actions">
        <button id="cq_elder_toggle" class="cq-btn" title="Larger text & slower speech">
          👴 Elder Mode
        </button>
        <button id="cq_voice_tip" class="cq-btn" title="Hear a civic tip">
          🔊 Voice Tip
        </button>
        <button id="cq_open_ai" class="cq-btn cq-primary" title="Chat with AI">
          💬 Chat
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(hud);

  // Toggle HUD and chatbot visibility
  let hudVisible = false;
  let chatVisible = false;

  aiButton.onclick = () => {
    hudVisible = !hudVisible;
    
    if (hudVisible) {
      hud.classList.add('visible');
      aiButton.classList.add('active');
    } else {
      hud.classList.remove('visible');
      aiButton.classList.remove('active');
      // Also close chatbot if HUD is closed
      if (chatVisible) {
        const chatbot = document.getElementById('cq_chatbot');
        if (chatbot) {
          chatbot.classList.remove('visible');
          chatVisible = false;
        }
      }
    }
  };

  document.getElementById("cq_elder_toggle").onclick = () => cqApplyElderMode(!CQ.state.elderMode);
  document.getElementById("cq_voice_tip").onclick = () => {
    const tips = [
      "Every citizen's vote matters in a democracy!",
      "The Constitution guarantees your fundamental rights.",
      "Parliament represents the will of the people.",
      "Understanding civic processes makes you a better citizen.",
      "Use Elder Mode for better accessibility!"
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];
    cqSpeak(tip);
    cqToast("🔊 " + tip);
  };
  
  document.getElementById("cq_open_ai").onclick = () => {
    cqOpenChatbot();
    chatVisible = true;
  };

  cqUpdateHUD();
}

function cqOpenChatbot() {
  let box = document.getElementById("cq_chatbot");
  
  if (!box) {
    box = document.createElement("div");
    box.id = "cq_chatbot";
    box.innerHTML = `
      <div class="cq-chat-header">
        <div><b>🤖 CivicaQuest AI Helper</b></div>
        <button id="cq_chat_close" class="cq-btn cq-danger" style="padding: 4px 10px;">✕</button>
      </div>
      <div id="cq_chat_log" class="cq-chat-log">
        <div class="cq-bot">
          👋 Hi! I'm your civic learning assistant!
          
          Ask me about:
          • Voting & EVM
          • Constitution
          • Parliament
          • Budget Game
          • How to use features
          
          Try: "How to vote?" or "What is VVPAT?"
        </div>
      </div>
      <div class="cq-chat-input">
        <input id="cq_chat_text" placeholder="Ask me anything..." />
        <button id="cq_chat_send" class="cq-btn cq-primary">Send</button>
      </div>
    `;
    document.body.appendChild(box);

    document.getElementById("cq_chat_close").onclick = () => {
      box.classList.remove('visible');
    };

    function send() {
      const input = document.getElementById("cq_chat_text");
      const text = input.value.trim();
      if (!text) return;

      const log = document.getElementById("cq_chat_log");
      
      const u = document.createElement("div");
      u.className = "cq-user";
      u.textContent = text;
      log.appendChild(u);

      const reply = cqChatbotReply(text);
      const b = document.createElement("div");
      b.className = "cq-bot";
      b.style.whiteSpace = "pre-line";
      b.textContent = reply;
      log.appendChild(b);

      log.scrollTop = log.scrollHeight;

      if (CQ.state.elderMode) cqSpeak(reply);
      input.value = "";
      
      // Award XP for asking questions
      if (Math.random() < 0.3) {
        cqAddXP(5, "Learning");
      }
    }

    document.getElementById("cq_chat_send").onclick = send;
    document.getElementById("cq_chat_text").addEventListener("keydown", (e) => {
      if (e.key === "Enter") send();
    });
  }
  
  // Show chatbot with animation
  setTimeout(() => {
    box.classList.add('visible');
  }, 50);
}

// Auto-initialize when page loads
window.addEventListener("load", () => {
  cqLoad();
  cqInjectHUD();
  
  // Add feature guide buttons to dashboard cards
  setTimeout(() => {
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
      const feature = card.getAttribute('data-feature');
      if (feature) {
        card.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          cqShowFeatureGuide(feature);
        });
        
        // Add info icon
        const icon = document.createElement('div');
        icon.innerHTML = '❓';
        icon.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: help;
          font-size: 1.2rem;
        `;
        icon.onclick = (e) => {
          e.stopPropagation();
          cqShowFeatureGuide(feature);
        };
        
        if (card.style.position !== 'relative') {
          card.style.position = 'relative';
        }
        card.appendChild(icon);
      }
    });
  }, 1000);
});

// Export for use in other scripts
window.CQ = CQ;
window.cqAddXP = cqAddXP;
window.cqUnlockBadge = cqUnlockBadge;
window.cqCompleteMission = cqCompleteMission;
window.cqShowFeatureGuide = cqShowFeatureGuide;
