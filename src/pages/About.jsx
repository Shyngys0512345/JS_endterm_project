// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>About This Project</h1>
      <p>
        This is a React movie catalog project for the end-term assignment.
        Features include:
      </p>
      <ul>
        <li>Firebase Authentication (signup/login/logout)</li>
        <li>Protected routes for logged-in users</li>
        <li>TMDB API integration for movies list and details</li>
        <li>Search, debounce, pagination</li>
        <li>Favorites/bookmarks with localStorage + Firestore merge</li>
        <li>Profile page with avatar upload to Firebase Storage</li>
        <li>PWA with offline capability and service worker</li>
      </ul>
    </div>
  );
}