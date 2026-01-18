import { useEffect, useState } from "react";
import API_BASE_URL from "../api/api";
import { getToken } from "../utils/auth";
import Card from "../components/Card";
import Button from "../components/Button";

function NGORegistration() {
  const [registration, setRegistration] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const token = getToken();

  // Fetch existing registration
  useEffect(() => {
    const fetchRegistration = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/registration/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setRegistration(data);

          // Pre-fill form
          setPhone(data.phone);
          setAddress(data.address);
          setCity(data.city || "");
          setState(data.state || "");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRegistration();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

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
        setMessage(data.message || "Failed to save details");
        return;
      }

      setRegistration(data);
      setEditMode(false);
      setMessage("Registration details updated successfully");
    } catch (error) {
      setMessage("Server error");
    }
  };

  // VIEW MODE
  if (registration && !editMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <Card title="NGO Registration Details">
          <div className="space-y-3 text-zinc-300">
            <p><span className="text-white">Phone:</span> {registration.phone}</p>
            <p><span className="text-white">Address:</span> {registration.address}</p>
            <p><span className="text-white">City:</span> {registration.city || "-"}</p>
            <p><span className="text-white">State:</span> {registration.state || "-"}</p>

            <button
              onClick={() => setEditMode(true)}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded
                         hover:bg-red-700 transition"
            >
              Edit Details
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // EDIT / FIRST REGISTRATION MODE
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <Card title={registration ? "Edit NGO Registration" : "NGO Registration"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Phone Number"
            className="w-full bg-zinc-900 text-white border border-zinc-700
                       p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <textarea
            placeholder="Full Address"
            rows="3"
            className="w-full bg-zinc-900 text-white border border-zinc-700
                       p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <input
            placeholder="City"
            className="w-full bg-zinc-900 text-white border border-zinc-700
                       p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            placeholder="State"
            className="w-full bg-zinc-900 text-white border border-zinc-700
                       p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />

          <Button text={registration ? "Update Registration" : "Submit Registration"} />
        </form>

        {message && (
          <p className="mt-3 text-sm text-red-400 text-center">{message}</p>
        )}
      </Card>
    </div>
  );
}

export default NGORegistration;
