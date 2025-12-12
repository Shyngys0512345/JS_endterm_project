// src/pages/MoviesList.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies, setSearch, setPage } from "../store/moviesSlice";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import useDebounce from "../hooks/useDebounce";
import useFavorites from "../hooks/useFavorites";

export default function MoviesList() {
  const dispatch = useDispatch();
  const { movies, page, totalPages, search, status, error } = useSelector(state => state.movies);

  const { favorites, toggleFavorite } = useFavorites();

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(fetchMovies({ query: debouncedSearch, page }));
  }, [debouncedSearch, page, dispatch]);

  return (
    <div style={{ padding: "20px" }}>
      <SearchBar value={search} onChange={(val) => dispatch(setSearch(val))} />

      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      <Pagination page={page} setPage={(p) => dispatch(setPage(p))} totalPages={totalPages} />
    </div>
  );
}
