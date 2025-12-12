import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export const getFavorites = async (uid) => {
  if (!uid) return [];
  const docRef = doc(db, "favorites", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().items || [] : [];
};

export const addFavorite = async (uid, movie) => {
  const docRef = doc(db, "favorites", uid);
  await updateDoc(docRef, { items: arrayUnion(movie) }).catch(async () => {
    await setDoc(docRef, { items: [movie] });
  });
};

export const removeFavorite = async (uid, movieId) => {
  const docRef = doc(db, "favorites", uid);
  const current = await getDoc(docRef);
  if (!current.exists()) return;
  const updated = current.data().items.filter(m => m.id !== movieId);
  await setDoc(docRef, { items: updated }, { merge: true });
};