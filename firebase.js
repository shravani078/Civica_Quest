// Firebase Configuration
// Replace these values with your own Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyACNJn11RrACWT3KlUxZ6UgAP_iqyLeydI",
  authDomain: "civicaquest.firebaseapp.com",
  projectId: "civicaquest",
  storageBucket: "civicaquest.firebasestorage.app",
  messagingSenderId: "293729946352",
  appId: "1:293729946352:web:9299e6bf03a1019856d035"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

/*
FIREBASE SETUP INSTRUCTIONS:
1. Go to https://console.firebase.google.com/
2. Create a new project or select existing
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set rules (see below)
5. Get your config:
   - Project Settings > General
   - Scroll to "Your apps"
   - Copy the firebaseConfig object
   - Paste it above, replacing the placeholder values

FIRESTORE SECURITY RULES:
Copy this to Firestore Database > Rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Leaderboard collection
    match /leaderboard/{entry} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Scores collection
    match /scores/{scoreId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
*/
