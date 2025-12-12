// src/pages/Favorites.jsx
import React, { useEffect, useState } from "react";
import useFavorites from "../hooks/useFavorites";
import { useSelector } from "react-redux";
import { getFavorites } from "../services/favoritesService";

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();
  const user = useSelector((state) => state.auth.user);
  const [serverFavorites, setServerFavorites] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchServerFavorites = async () => {
      try {
        const data = await getFavorites(user.uid);
        setServerFavorites(data);
      } catch (err) {
        console.warn("Cannot fetch server favorites, using local cache", err);
        setServerFavorites([]); // оставляем пустой массив если оффлайн
      }
    };

    fetchServerFavorites();
  }, [user]);

  if (!user) return <p>Please login to see your favorites.</p>;

  // Объединяем локальные и серверные favorites по уникальному id
  const combinedFavorites = [
    ...new Map([...favorites, ...serverFavorites].map((f) => [f.id, f])).values(),
  ];

  if (combinedFavorites.length === 0) return <p>No favorites yet.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Favorites</h2>
      <div className="movies-grid">
        {combinedFavorites.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.title}
              style={{ borderRadius: "4px", marginBottom: "8px" }}
            />
            <h4>{movie.title}</h4>
            <button
              onClick={() => toggleFavorite(movie)}
              style={{
                fontSize: "18px",
                padding: "4px 8px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {favorites.some((f) => f.id === movie.id) ? "❤️" : "🤍"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}