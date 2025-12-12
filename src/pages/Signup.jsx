import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail, isValidPassword, passwordsMatch } from "../utils/validators";
import useAuth from "../hooks/useAuth";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) return setError("Invalid email");
    if (!isValidPassword(password)) return setError("Password too weak");
    if (!passwordsMatch(password, repeatPassword)) return setError("Passwords do not match");

    try {
      await signup(email, password);
      nav("/profile"); // after successful authorization
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h2>Create Account</h2>

      <input type="email" placeholder="Email" value={email}
        onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: 8, margin: "10px 0" }} />

      <input type="password" placeholder="Password" value={password}
        onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: 8, margin: "10px 0" }} />

      <input type="password" placeholder="Repeat password" value={repeatPassword}
        onChange={e => setRepeatPassword(e.target.value)} style={{ width: "100%", padding: 8, margin: "10px 0" }} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" style={{ padding: 10, width: "100%", marginTop: 10 }}>Sign Up</button>
    </form>
  );
}
