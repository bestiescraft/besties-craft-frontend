// src/firebase.js
// ─────────────────────────────────────────────────────────────────
// Put these in your Vercel environment variables:
//   REACT_APP_FIREBASE_API_KEY
//   REACT_APP_FIREBASE_AUTH_DOMAIN
//   REACT_APP_FIREBASE_PROJECT_ID
//   REACT_APP_FIREBASE_STORAGE_BUCKET
//   REACT_APP_FIREBASE_MESSAGING_SENDER_ID
//   REACT_APP_FIREBASE_APP_ID
// ─────────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUnxAahD2g7tsXqcKW8B3jgzs_eNEdSa0",
  authDomain: "besties-craft-9b8d7.firebaseapp.com",
  projectId: "besties-craft-9b8d7",
  storageBucket: "besties-craft-9b8d7.firebasestorage.app",
  messagingSenderId: "613369009118",
  appId: "1:613369009118:web:b4e5d8d22cd0917af6034f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;