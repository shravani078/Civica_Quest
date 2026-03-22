🏛️ CivicaQuest – Gamified Civic Learning Platform

An interactive platform to learn how a bicameral parliament works using games, simulations, and AI assistance.

🎯 Overview

CivicaQuest is a gamified civic education platform that helps users understand governance and the law-making process in a simple and engaging way. It combines interactive simulations, quizzes, and an AI assistant to make learning fun and effective.

✨ Key Features
🔐 Authentication
Secure signup & login (Firebase)
User session management
Profile handling
🎮 Learning Modules
Budget Management Game
Civic Quiz System
Voting Simulator
Parliament Simulation
🤖 AI Assistant
Chatbot for guidance
Answers civic-related questions
Helps navigate features
📊 Progress Tracking
XP & Level system
Leaderboard
Achievements
⚡ Quick Setup
# Extract project
unzip CivicaQuest.zip

# Run server
cd CivicaQuest
python -m http.server 8000

# Open in browser
http://localhost:8000/auth.html

🛠️ Technologies Used
HTML, CSS, JavaScript
Firebase Authentication
Firestore Database

## 📁 Project Structure

```
CivicaQuest/
│
├── auth.html
├── index.html
├── firebase.js
├── firestore.rules
│
├── budget-game.html
├── quiz-game.html
├── voting-simulator.html
├── parliament-simulator.html
│
├── script.js
├── style.css
│
└── static/
    ├── css/
    │   └── cq_ai.css
    └── js/
        └── cq_ai.js
```
    
🚀 How to Run
Setup Firebase project
Update firebase.js with your config
Start local server
Open browser and run the app

🎯 Objectives
Simplify parliamentary concepts
Simulate law-making process
Improve civic awareness
Provide interactive learning

📱 Highlights
Clean and modern UI
Mobile responsive design
Smooth user experience
Fast performance

🏆 Success Criteria
User can create account
All features work correctly
Games load properly
UI works on mobile

💡 Future Improvements
Add more games
Enhance AI chatbot
Add multilingual support
Improve analytics

🎉 Conclusion
CivicaQuest makes learning democracy interactive and engaging through gamification and real-world simulations.

Made for better civic education 🏛️📚🎮
