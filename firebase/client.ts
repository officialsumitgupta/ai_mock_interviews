import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth } from 'firebase/auth';
import {getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9tRPYxvJzlSOp9dkmaYReeSYSUSa29wg",
    authDomain: "prepwise-c0303.firebaseapp.com",
    projectId: "prepwise-c0303",
    storageBucket: "prepwise-c0303.firebasestorage.app",
    messagingSenderId: "921049229144",
    appId: "1:921049229144:web:970c127ac8dd98ca9b272d"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig): getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);