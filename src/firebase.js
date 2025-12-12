import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZ2TmxExXJFx8CnVFpN-O1AWM8R283zo4",
  authDomain: "endproject-4acbe.firebaseapp.com",
  projectId: "endproject-4acbe",
  storageBucket: "endproject-4acbe.appspot.com",
  messagingSenderId: "929466581372",
  appId: "1:929466581372:web:04861ae50ad0843f5ae4f9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
