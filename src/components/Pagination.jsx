// src/components/Pagination.jsx
import React from "react";

export default function Pagination({ page, setPage, totalPages }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
      <span style={{ margin: "0 10px" }}>{page} / {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}