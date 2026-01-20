import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api/api";
import { getToken } from "../utils/auth";
import Card from "../components/Card";
import Button from "../components/Button";


function Donate() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = getToken();
    if (!token) {
      setMessage("Please login first.");
      setLoading(false);
      return;
    }

    if (!amount || amount <= 0) {
      setMessage("Please enter a valid amount.");
      setLoading(false);
      return;
    }

    try {
      // 1. Call backend to initiate PayHere payment
      const res = await fetch(`${API_BASE_URL}/donations/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Payment initiation failed");
        setLoading(false);
        return;
      }

      // 2. SUCCESS: We got PayHere params. Now create a hidden form and submit it.
      setMessage("Redirecting to PayHere...");

      const payhereParams = data.payhere;
      
      // Create form element
      const form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", "https://sandbox.payhere.lk/pay/checkout");
      form.style.display = "none";

      // Append all PayHere parameters as hidden inputs
      Object.keys(payhereParams).forEach((key) => {
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", key);
        input.setAttribute("value", payhereParams[key]);
        form.appendChild(input);
      });

      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Server error. Please try again.");
      setLoading(false);
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
            min="1"
            step="1"
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-md font-medium
                     hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Donate Now"}
          </button>
        </form>

        {message && (
          <p className="mt-3 text-sm text-red-400 text-center">{message}</p>
        )}

        <p className="mt-4 text-xs text-zinc-400 text-center">
          You will be redirected to PayHere's secure payment gateway.
        </p>
      </Card>
    </div>
  );

}

export default Donate;
