// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANHF_gZGnSSku9UzIPVY11TsJrj_HbPws",
  authDomain: "shoppe-b8601.firebaseapp.com",
  projectId: "shoppe-b8601",
  storageBucket: "shoppe-b8601.firebasestorage.app",
  messagingSenderId: "872471565953",
  appId: "1:872471565953:web:79a1d0ce09497d54d65f80"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
