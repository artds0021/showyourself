import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo: username=admin, password=Dheeraj Sakaray
    if (username === "admin" && password === "Dheeraj Sakaray") {
      localStorage.setItem("isAdmin", "true");
      setLocation("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-20 space-y-4">
      <h2 className="text-xl font-bold">Admin Login</h2>
      <input
        className="border p-2 w-full"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {error && <div className="text-red-500">{error}</div>}
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
        Login
      </button>
    </form>
  );
}