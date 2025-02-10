
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDu5ZfaoEkRcznw6RiakF-A9Qpei6ATSHQ",
  authDomain: "task-m-6c904.firebaseapp.com",
  projectId: "task-m-6c904",
  storageBucket: "task-m-6c904.firebasestorage.app",
  messagingSenderId: "953664516106",
  appId: "1:953664516106:web:98d2672a6adf586e1b6ff3"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);





