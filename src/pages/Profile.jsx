// src/pages/Profile.jsx

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../firebase";
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
        
        // photoURL from Firebase Auth
        if (user.photoURL) {
            setPreview(user.photoURL);
        }

        // if there is no photoURL, check the Firestore
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
        setPreview(URL.createObjectURL(file)); 
    };

    const handleUpload = async () => {
        if (!avatar || !user?.uid) return;

        setIsLoading(true);
        try {
            // uploading to Firebase Storage
            const url = await uploadAvatar(user.uid, avatar);

            //  saving the URL in the Firestore
            await saveProfileData(user.uid, { avatar: url });

            // updating to FIREBASE AUTH
            await auth.currentUser.updateProfile({ photoURL: url });

            // instant update REDUX 
            const updatedUser = auth.currentUser;
            dispatch(setUser({ 
                uid: updatedUser.uid,
                email: updatedUser.email,
                photoURL: updatedUser.photoURL, 
            }));

            // to clear the local file and show the preview from the URL
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
            <p>Email: {user.email}</p>
        </div>
    );
}