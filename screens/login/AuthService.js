import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Updated Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmBT19El4PuurBuvGsEKYHJPNvr5r4Iuo",
  authDomain: "abcd-b93c9.firebaseapp.com",
  projectId: "abcd-b93c9",
  storageBucket: "abcd-b93c9.appspot.com",
  messagingSenderId: "50765565644",
  appId: "1:50765565644:web:e837644158c7103d6afc69",
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
