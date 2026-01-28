
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDfH2tLDjitt-A3X_-eijZ0YV0ikGXPEPA",
    authDomain: "skill-orbit-5d927.firebaseapp.com",
    projectId: "skill-orbit-5d927",
    storageBucket: "skill-orbit-5d927.firebasestorage.app",
    messagingSenderId: "588396607846",
    appId: "1:588396607846:web:61156afda69d579dd970a7",
    measurementId: "G-K5KL244CEG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
