import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:            "AIzaSyAUnxAahD2g7tsXqcKW8B3jgzs_eNEdSa0",
  authDomain:        "besties-craft-9b8d7.firebaseapp.com",
  projectId:         "besties-craft-9b8d7",
  storageBucket:     "besties-craft-9b8d7.firebasestorage.app",
  messagingSenderId: "613369009118",
  appId:             "1:613369009118:web:b4e5d8d22cd0917af6034f",
  measurementId:     "G-ZFPTMGK76J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;