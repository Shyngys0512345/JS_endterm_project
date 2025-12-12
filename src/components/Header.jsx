import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Header() {
    const { logout, isAuthenticated, user } = useAuth();
    const avatarUrl = user?.photoURL;

    return (
        <header style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#333',
            color: 'white'
        }}>
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                <Link to="/movies" style={{ color: 'white', textDecoration: 'none' }}>Movies</Link>
                {isAuthenticated && (
                    <Link to="/favorites" style={{ color: 'white', textDecoration: 'none' }}>Favorites</Link>
                )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {isAuthenticated ? (
                    <>
                        {avatarUrl && (
                            <img 
                                src={avatarUrl} 
                                alt="Profile Avatar" 
                                style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
                            />
                        )}
                        <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
                        <button 
                            onClick={logout} 
                            style={{ 
                                marginLeft: "10px", 
                                background: 'transparent', 
                                border: '1px solid white', 
                                color: 'white',
                                padding: '5px 10px',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                        <Link to="/signup" style={{ color: 'white', textDecoration: 'none', marginLeft: '10px' }}>Sign Up</Link>
                    </>
                )}
            </div>
        </header>
    );
}
