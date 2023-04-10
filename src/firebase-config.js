import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAf7xaPQwKVDxEvztszhdAHtOIdyVTiUNU",
  authDomain: "reddit-clone-e4070.firebaseapp.com",
  projectId: "reddit-clone-e4070",
  storageBucket: "reddit-clone-e4070.appspot.com",
  messagingSenderId: "708320944955",
  appId: "1:708320944955:web:c1a8086cc645f34ef7cd1e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
