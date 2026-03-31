import { auth, db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function saveQuizResult(quizName, answers, score, totalQuestions) {
  const user = auth.currentUser;

  if (!user) {
    alert("⚠️ Please login first!");
    window.location.href = "auth.html";
    return;
  }

  await addDoc(collection(db, "quiz_results"), {
    userId: user.uid,
    quizName,
    answers,
    score,
    totalQuestions,
    createdAt: new Date().toISOString()
  });
}
