import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { compressFileWithWorker } from "../utils/compressImage";


// uploads user avatar to Firebase Storage then and returns the URL

export const uploadAvatar = async (uid, file) => {
  try {
    const toUpload = await compressFileWithWorker(file); // Blob or File

    // determining the type
    const ext = (toUpload.type && toUpload.type.split("/")[1]) || "jpg";
    const filename = `avatar_${Date.now()}.${ext}`;
    const path = `avatars/${uid}/${filename}`; // unique path + folder with uid

    const storageRef = ref(storage, path);

    // metadata for storage to know contentType
    const metadata = { contentType: toUpload.type || "image/jpeg" };

    // uploading
    await uploadBytes(storageRef, toUpload, metadata);

    // getting url
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
