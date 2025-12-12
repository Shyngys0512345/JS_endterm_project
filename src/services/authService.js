import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const signup = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Создаём документ в Firestore
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    favorites: [],
    photoURL: null,
    createdAt: new Date(),
  });

  // Добавляем displayName (например первая часть email)
  await updateProfile(user, { displayName: email.split("@")[0] });

  return userCredential; // возвращаем весь объект, чтобы был доступ к userCredential.user
};

export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};
