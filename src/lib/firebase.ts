// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

// This is a public configuration and is safe to expose on the client.
// Security is enforced by Firebase Security Rules.
const firebaseConfig = {
  apiKey: "AIzaSyBAdBwAkQQi0h5RIvMZNGX_j5mvbN92_XM",
  authDomain: "shopiggo-uycz2.firebaseapp.com",
  projectId: "shopiggo-uycz2",
  storageBucket: "shopiggo-uycz2.appspot.com",
  messagingSenderId: "696459401226",
  appId: "1:696459401226:web:7d14e398891a2479b967f3",
  measurementId: "G-F80VVYJ3KF"
};


const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

export { app, db };
