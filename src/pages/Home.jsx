// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to Movie Catalog</h1>
      <p>Explore popular movies, search your favorites, and manage your profile.</p>
      <Link to="/movies" style={{ padding: "10px 20px", background: "#222", color: "#fff", borderRadius: "5px", textDecoration: "none" }}>
        Browse Movies
      </Link>
    </div>
  );
}