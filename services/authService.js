// services/authService.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import axios from "axios";
import { firebaseApp } from "../firebaseConfig"; // Your Firebase config

const auth = getAuth(firebaseApp);
const BASE_URL = "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net"; // Replace with your Firebase project ID

// Signup with Email & Password
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Login with Email & Password
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Forgot Password (Send Reset Email via Firebase)
export const forgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent." };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Reset Password via Backend (optional custom method)
export const resetPasswordViaBackend = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/resetPassword`, { email });
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
};
