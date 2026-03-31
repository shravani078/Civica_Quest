# CivicaQuest v4.0 — Royal Blue Edition

India's First Gamified Civics Platform — Completely Redesigned

## What's New in v4.0

| Feature | Before | Now |
|---------|--------|-----|
| Color Scheme | Dark saffron/orange | **Royal Blue (#1a56db)** |
| Scroll Issue | index.html couldn't scroll | **Fixed — fully scrollable** |
| Leaderboard | Present | **Completely removed** |
| Game Connection | Isolated modules | **Connected Journey path** |
| Design System | Mixed inconsistent | **Unified theme.css v4** |
| Authentication | Firebase (working) | **Full Firebase auth + XP saving** |

## File Structure
```
final_project/
├── index.html              ← Main dashboard (scrollable, Royal Blue)
├── auth.html               ← Login/Signup with chatbot
├── quiz-game.html          ← Constitution quiz (saves XP to Firebase)
├── budget-game.html        ← City budget game (saves XP)
├── voting-simulator.html   ← Full EVM election simulator
├── parliament-simulator.html ← Live voice debates
├── civics.html             ← Civics learning hub
├── classroom.html          ← AI classroom
├── student-portfolio.html  ← Progress & achievements
├── civic-cases.html        ← Case studies
├── civic-mcq.html          ← MCQ practice
├── civic-notes.html        ← Civics notes
├── civic-progress.html     ← Progress tracker
├── theme.css               ← Royal Blue design system
├── firebase.js             ← Firebase config (update with your credentials)
├── firestore.rules         ← Security rules (no leaderboard)
├── xpSystem.js             ← XP & level management
├── quizStore.js            ← Quiz result saving
├── static/css/cq_ai.css    ← AI assistant styles
├── static/js/cq_ai.js      ← AI assistant logic
└── election-simulator/     ← EVM simulator assets
```

## Quick Start
```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

## Firebase Setup
1. Go to https://console.firebase.google.com/
2. Create project → Enable Email/Password auth
3. Create Firestore database
4. Copy firestore.rules to Rules tab
5. Update firebase.js with your config

## Connected Game Journey
📚 Civics → 📜 Quiz → 🗳️ Voting → 💰 Budget → 🏛️ Parliament → 🤖 AI Class → 🎓 Portfolio

Each module shows "Next Step" prompts connecting to the next game in sequence.

## Design Tokens (Royal Blue)
- Primary: `#1a56db` (Royal Blue)
- Light: `#3b82f6`
- Gold accent: `#f59e0b`
- Background: `#05091a`
- Surface: `#0d1630`

## Important Notes
- **No leaderboard** — completely removed from all files
- **Scrolling fixed** — index.html no longer has overflow:hidden
- **Connected games** — each game links to the next in the journey
- **XP saves to Firebase** — quiz and budget scores update user profile
- Demo mode available — explore without account
