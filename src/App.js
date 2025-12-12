import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { setUser, clearUser } from "./store/authSlice";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MoviesList from "./pages/MoviesList";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";

import Header from "./components/Header";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
      }
      setAuthLoaded(true); 
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!authLoaded) return <p style={{ padding: 20 }}>Loading user...</p>;

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/movies" element={<MoviesList />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;