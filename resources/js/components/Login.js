import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Get CSRF token (Sanctum)
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      // Then log in
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      onLogin(response.data.user);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-400">
      
      {/* Animated background circles */}
      <div className="absolute w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-cyan-300 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 border border-white/30">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Admin Login
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded-lg bg-blue-50 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 rounded-lg bg-blue-50 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
