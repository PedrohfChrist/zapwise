import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAy8DyXVX1SBBwInhtf448tYJJznBGOqsU",
  authDomain: "whatbot-ai.firebaseapp.com",
  projectId: "whatbot-ai",
  storageBucket: "whatbot-ai.firebasestorage.app",
  messagingSenderId: "723461466098",
  appId: "1:723461466098:web:228933fd768f088855ad6b",
};

// Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// Initialize services
const db = initializeFirestore(firebaseApp, {
  ignoreUndefinedProperties: true,
});
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const timestamp = serverTimestamp();

// Exporta também a instância do Firebase App como "app"
export { firebaseApp as app, db, auth, storage, timestamp, googleProvider };
