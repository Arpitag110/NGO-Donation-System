import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api/api";
import { setToken } from "../utils/auth";
import Card from "../components/Card";
import Button from "../components/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // Save JWT token
      setToken(data.token);

      // Admin vs User redirect
      if (data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <Card title="Login">
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-zinc-900 text-white border border-zinc-700
                       p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-zinc-900 text-white border border-zinc-700
                       p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button text="Login" />
        </form>

        {message && (
          <p className="mt-3 text-sm text-red-400 text-center">
            {message}
          </p>
        )}
      </Card>
    </div>
  );
}

export default Login;
