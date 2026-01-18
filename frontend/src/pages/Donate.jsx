import { useState } from "react";
import API_BASE_URL from "../api/api";
import { getToken } from "../utils/auth";
import Card from "../components/Card";
import Button from "../components/Button";


function Donate() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleDonate = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Donation failed");
        return;
      }

      setMessage(
        `Donation initiated (Status: ${data.donation.status}). Check history.`
      );
      setAmount("");
    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-zinc-900">
    <Card title="Make a Donation">
      <form onSubmit={handleDonate} className="space-y-4">
        <input
          type="number"
          placeholder="Donation Amount (₹)"
          className="w-full bg-zinc-900 text-white border border-zinc-700
                     p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <Button text="Donate Now" />
      </form>

      {message && (
        <p className="mt-3 text-sm text-red-400 text-center">{message}</p>
      )}

      <p className="mt-4 text-xs text-zinc-400 text-center">
        Your donation will be securely recorded and tracked.
      </p>
    </Card>
  </div>
);

}

export default Donate;
