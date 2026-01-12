// Import the functions needed from the SDKs 
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTYkx0jDPT6vzokKjcRVZ0BbwbfyAd4zA",
  authDomain: "job-portal-ff695.firebaseapp.com",
  projectId: "job-portal-ff695",
  storageBucket: "job-portal-ff695.firebasestorage.app",
  messagingSenderId: "761121958782",
  appId: "1:761121958782:web:7df752c671396b9bf2e12f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore to use them in the app
export const auth = getAuth(app);
export const db = getFirestore(app);
