import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC1CxdKx0FUnFY4Gam1lXArScqRtn3ay7Q",
  authDomain: "nabeeh-bfcc6.firebaseapp.com",
  databaseURL: "https://nabeeh-bfcc6-default-rtdb.firebaseio.com",
  projectId: "nabeeh-bfcc6",
  storageBucket: "nabeeh-bfcc6.firebasestorage.app",
  messagingSenderId: "1085231318855",
  appId: "1:1085231318855:web:62878d901600b669fcae62",
  measurementId: "G-286KYP6XVZ"
};

// Initialize Firebase safely for Next.js (prevents hot-reload errors)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export the Realtime Database instance!
export const database = getDatabase(app);

// Initialize Analytics only on the client-side
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}