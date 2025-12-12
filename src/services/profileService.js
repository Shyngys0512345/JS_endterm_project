import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { compressFileWithWorker } from "../utils/compressImage";

/**
 * Uploads user avatar to Firebase Storage (compress via worker) and returns the URL
 */
export const uploadAvatar = async (uid, file) => {
  try {
    const toUpload = await compressFileWithWorker(file); // Blob or File

    // определяем расширение/тип
    const ext = (toUpload.type && toUpload.type.split("/")[1]) || "jpg";
    const filename = `avatar_${Date.now()}.${ext}`;
    const path = `avatars/${uid}/${filename}`; // уникальный путь + папка по uid

    const storageRef = ref(storage, path);

    // metadata чтобы storage знал contentType
    const metadata = { contentType: toUpload.type || "image/jpeg" };

    // загружаем
    await uploadBytes(storageRef, toUpload, metadata);

    // получаем url
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (err) {
    console.error("uploadAvatar error:", err);
    throw err;
  }
};

export const saveProfileData = async (uid, data) => {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, data, { merge: true });
};

export const getProfileData = async (uid) => {
  const docRef = doc(db, "users", uid);
  const d = await getDoc(docRef);
  return d.exists() ? d.data() : {};
};
