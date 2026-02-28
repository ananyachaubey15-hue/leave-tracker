import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAu6CuVetkbfIWdo1m7zSamQhXmWkEYOcs",
  authDomain: "leave-tracker-app-5be91.firebaseapp.com",
  projectId: "leave-tracker-app-5be91",
  storageBucket: "leave-tracker-app-5be91.firebasestorage.app",
  messagingSenderId: "962691078030",
  appId: "1:962691078030:web:d1a33eb392d8149dbf76df",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);