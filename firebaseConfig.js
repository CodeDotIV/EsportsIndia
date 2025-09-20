import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDNjVmiYyU1zQmvNVWizaREQ88xVT-o9X0",
  authDomain: "esportsindia341k.firebaseapp.com",
  projectId: "esportsindia341k",
  storageBucket: "esportsindia341k.firebasestorage.app",
  messagingSenderId: "1047059325621",
  appId: "1:1047059325621:web:3a514fdde8c66c3bc0d4fc",
  measurementId: "G-BYYM5X6J2R"
};

const app = initializeApp(firebaseConfig);

console.log("Firebase initialized:", app.name); 
