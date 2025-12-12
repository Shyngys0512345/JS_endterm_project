// src/pages/Profile.jsx

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../firebase"; // Импортируем auth
import { setUser } from "../store/authSlice";
import { uploadAvatar, saveProfileData, getProfileData } from "../services/profileService";

export default function Profile() {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        
        // 1. Попытка загрузить из основного источника (photoURL из Firebase Auth)
        if (user.photoURL) {
            setPreview(user.photoURL);
        }

        // 2. Если photoURL нет, проверяем Firestore
        // (Это полезно, если вы ранее сохранили только в Firestore)
        if (user.uid) {
            getProfileData(user.uid).then(data => {
                if (data.avatar && !user.photoURL) {
                    setPreview(data.avatar);
                }
            }).catch(()=>{
                console.warn("Could not fetch profile data from Firestore.");
            });
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatar(file);
        // Создаем локальный URL для предпросмотра
        setPreview(URL.createObjectURL(file)); 
    };

    const handleUpload = async () => {
        if (!avatar || !user?.uid) return;

        setIsLoading(true);
        try {
            // 1. Загрузка в Firebase Storage (с компрессией)
            const url = await uploadAvatar(user.uid, avatar);

            // 2. Сохранение URL в Firestore (как дополнительная запись)
            await saveProfileData(user.uid, { avatar: url });

            // 3. ОБНОВЛЕНИЕ В FIREBASE AUTH (Ключ к сохранению после перезагрузки)
            // Это обновит `user.photoURL` для `onAuthStateChanged` в `App.js`.
            await auth.currentUser.updateProfile({ photoURL: url });

            // 4. МГНОВЕННОЕ ОБНОВЛЕНИЕ REDUX (Ключ к сохранению при переходе)
            // Берем обновленного пользователя из auth.currentUser
            const updatedUser = auth.currentUser;
            dispatch(setUser({ 
                uid: updatedUser.uid,
                email: updatedUser.email,
                photoURL: updatedUser.photoURL, // Используем свежий URL
            }));

            // 5. Очищаем локальный файл и показываем превью из URL
            setAvatar(null);
            setPreview(url); 

            alert("Avatar uploaded successfully!");
        } catch (err) {
            console.error("Error uploading avatar:", err);
            alert("Error uploading avatar");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return <p style={{ padding: 20 }}>Please log in to view your profile.</p>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Profile</h2>
            {preview && <img src={preview} alt="avatar" width={120} style={{ borderRadius: 8 }} />}
            <div style={{ marginTop: 12 }}>
                <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    onChange={handleFileChange}
                    disabled={isLoading}
                />
                <button 
                    onClick={handleUpload} 
                    style={{ marginLeft: 8 }}
                    disabled={isLoading || !avatar}
                >
                    {isLoading ? "Uploading..." : "Upload"}
                </button>
            </div>
            {/* Дополнительная информация о пользователе, если нужна */}
            <p>Email: {user.email}</p>
        </div>
    );
}