import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const endpoint = isRegister ? "register" : "login";

      const res = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (isRegister) {
        alert("User registered! Now login.");
        setIsRegister(false);
        return;
      }

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        onLogin();
      } else {
        alert(data.detail || "Error");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
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

        {/* 🔥 SWITCH BUTTON */}
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