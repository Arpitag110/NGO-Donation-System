import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api/api";
import Card from "../components/Card";
import Button from "../components/Button";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      // Redirect to login after successful registration
      navigate("/");
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <Card title="Register">
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            placeholder="Name"
            className="w-full bg-zinc-900 text-white border border-zinc-700
                       p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <Button text="Register" />
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

export default Register;
