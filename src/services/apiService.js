// src/services/apiService.js
import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  console.warn("REACT_APP_TMDB_API_KEY is not set in .env");
}

export const fetchMoviesList = async (query = "", page = 1) => {
  try {
    const url = query
      ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
      : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    // normalize error
    throw new Error(err.response?.data?.status_message || err.message);
  }
};

export const fetchMovieDetails = async (id) => {
  try {
    const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,genres`;
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.status_message || err.message);
  }
};