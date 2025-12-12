// src/components/SearchBar.jsx
import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search movies..."
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ padding: "8px", width: "100%", marginBottom: "16px" }}
    />
  );
}