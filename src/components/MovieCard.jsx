// src/components/MovieCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";

export default function MovieCard({ movie, toggleFavorite, favorites }) {
  const isFavorite = favorites.some(f => f.id === movie.id);

  return (
    <div className="movie-card">
      <Link to={`/movies/${movie.id}`}>
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
        />
      </Link>
      <h4>{movie.title}</h4>
      <button onClick={() => toggleFavorite(movie)}>
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
