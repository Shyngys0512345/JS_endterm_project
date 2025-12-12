// src/hooks/useFavorites.js
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getFavorites as getServerFavorites,
  addFavorite,
  removeFavorite,
} from "../services/favoritesService";

export default function useFavorites() {
  const user = useSelector((state) => state.auth.user);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    } catch {
      return [];
    }
  });

  // syncing local and server favorites
  useEffect(() => {
    if (!user) return;

    const fetchServerFavorites = async () => {
      try {
        const serverData = await getServerFavorites(user.uid);

        // combining unique ones
        const map = new Map();
        [...favorites, ...serverData].forEach((f) => map.set(f.id, f));
        const merged = Array.from(map.values());

        setFavorites(merged);
        localStorage.setItem("favorites", JSON.stringify(merged));
      } catch (err) {
        console.warn("Cannot fetch server favorites, using local cache", err);
      }
    };

    fetchServerFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // functional toggleFavorite
  const toggleFavorite = async (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === movie.id);
      let updated;

      if (exists) {
        updated = prev.filter((f) => f.id !== movie.id);
      } else {
        updated = [...prev, movie];
      }

      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });

    // to update the server asynchronously without breaking the local state
    if (user) {
      try {
        const existsNow = favorites.some((f) => f.id === movie.id);

        if (existsNow) {
          await removeFavorite(user.uid, movie.id);
        } else {
          await addFavorite(user.uid, movie);
        }
      } catch {}
    }
  };

  return { favorites, toggleFavorite };
}
