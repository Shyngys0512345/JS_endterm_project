// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/movies"); // редирект после успешного входа
    } catch (err) {
      // дружелюбные ошибки Firebase
      switch (err.code) {
        case "auth/user-not-found":
          setError("User does not exist.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Try again later.");
          break;
        default:
          setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ padding: 20, maxWidth: 400, margin: "auto" }}
    >
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 8, margin: "10px 0" }}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 8, margin: "10px 0" }}
        required
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button 
        type="submit" 
        disabled={loading}
        style={{ padding: 10, width: "100%", marginTop: 10 }}
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
