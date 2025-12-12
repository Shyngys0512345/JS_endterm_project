// src/pages/MovieDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieDetails } from "../services/apiService";
import useFavorites from "../hooks/useFavorites";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const { toggleFavorite, favorites } = useFavorites();

  useEffect(() => {
    fetchMovieDetails(id).then(setMovie).catch(console.error);
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  const isFavorite = favorites.some(f => f.id === movie.id);

  return (
    <div style={{ padding: 20 }}>
      <h2>{movie.title}</h2>
      <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : ''} alt={movie.title} />
      <p><strong>Overview:</strong> {movie.overview}</p>
      <p><strong>Release date:</strong> {movie.release_date}</p>
      <p><strong>Rating:</strong> {movie.vote_average} ({movie.vote_count} votes)</p>
      <p><strong>Language:</strong> {movie.original_language}</p>
      <p><strong>Popularity:</strong> {movie.popularity}</p>
      <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(", ")}</p>
      <button onClick={() => toggleFavorite({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path
      })}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
}