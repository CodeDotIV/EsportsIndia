// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNjVmiYyU1zQmvNVWizaREQ88xVT-o9X0",
  authDomain: "esportsindia341k.firebaseapp.com",
  projectId: "esportsindia341k",
  storageBucket: "esportsindia341k.appspot.com", // ✅ fixed
  messagingSenderId: "1047059325621",
  appId: "1:1047059325621:web:3a514fdde8c66c3bc0d4fc",
  measurementId: "G-BYYM5X6J2R",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

console.log("✅ Firebase initialized:", app.name);

export default app;
