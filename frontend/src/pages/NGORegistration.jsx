import { useState } from "react";
import API_BASE_URL from "../api/api";
import { getToken } from "../utils/auth";

function NGORegistration() {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone, address, city, state }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("NGO registration successful");
    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div>
      <h3>NGO Registration</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <br />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <br />

        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <br />

        <input
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <br />

        <button type="submit">Submit Registration</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default NGORegistration;
