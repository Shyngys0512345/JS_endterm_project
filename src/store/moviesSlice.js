// src/store/moviesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMoviesList } from "../services/apiService";

// Async thunk для получения списка фильмов
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async ({ query = "", page = 1 }, thunkAPI) => {
    try {
      const data = await fetchMoviesList(query, page);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    totalPages: 1,
    page: 1,
    search: "",
    status: "idle",
    error: null,
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1; // reset page when search changes
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearMovies: (state) => {
      state.movies = [];
      state.page = 1;
      state.totalPages = 1;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = action.payload.results || [];
        state.totalPages = action.payload.total_pages || 1;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch movies";
      });
  },
});

export const { setSearch, setPage, clearMovies } = moviesSlice.actions;
export default moviesSlice.reducer;