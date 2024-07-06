import { initializeApp } from "firebase/app";
import { initializeFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Firebase config aqui embaixo
const firebaseConfig = {
  apiKey: "AIzaSyDioL6Cb8hMFhEtZ5tCvo4FPU4Qeb8bRf0",
  authDomain: "adcraftor-8d13a.firebaseapp.com",
  projectId: "adcraftor-8d13a",
  storageBucket: "adcraftor-8d13a.appspot.com",
  messagingSenderId: "38064844365",
  appId: "1:38064844365:web:62e4d01614c981dd7c3604",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize services
const db = initializeFirestore(firebaseApp, {
  ignoreUndefinedProperties: true,
});
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// Timestamp
const timestamp = serverTimestamp();

export { db, auth, storage, timestamp };
