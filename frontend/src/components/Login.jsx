import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const endpoint = isRegister ? "register" : "login";

      console.log("API URL:", API_URL); // 🔥 debug

      const res = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      console.log("API RESPONSE:", data); // 🔥 debug

      // ❌ HANDLE BACKEND ERROR
      if (!res.ok) {
        alert(data.detail || "Request failed");
        return;
      }

      // ✅ REGISTER SUCCESS
      if (isRegister) {
        alert("Registered successfully! Please login.");
        setIsRegister(false);
        return;
      }

      // ✅ LOGIN SUCCESS
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        onLogin();
      } else {
        alert("Invalid response from server");
      }

    } catch (err) {
      console.error("ERROR:", err);
      alert("Backend not reachable or network error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="glass-panel p-8 w-80 space-y-4">

        <h2 className="text-xl font-bold text-center text-neon-blue">
          {isRegister ? "Register" : "Login"}
        </h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded bg-white/10 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-white/10 text-white"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded bg-gradient-to-r from-neon-blue to-purple-500 text-white font-bold"
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <p className="text-sm text-center text-gray-400">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
        </p>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="w-full text-neon-blue text-sm"
        >
          {isRegister ? "Login" : "Register"}
        </button>

      </div>
    </div>
  );
};

export default Login;