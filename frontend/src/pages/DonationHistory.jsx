import { useEffect, useState } from "react";
import API_BASE_URL from "../api/api";
import { getToken } from "../utils/auth";

function DonationHistory() {
  const [donations, setDonations] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      const token = getToken();
      if (!token) {
        setMessage("Please login first.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/donations/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Failed to load donations");
          return;
        }

        setDonations(data);
      } catch (error) {
        setMessage("Server error");
      }
    };

    fetchDonations();
  }, []);

  return (
  <div className="min-h-screen bg-zinc-900 flex justify-center p-6">
    <div className="w-full max-w-4xl">
      <h3 className="text-xl font-semibold text-white mb-4">
        My Donation History
      </h3>

      {message && (
        <p className="text-red-400 text-sm mb-4">{message}</p>
      )}

      {donations.length === 0 ? (
        <p className="text-zinc-400">No donations found.</p>
      ) : (
        <div className="overflow-x-auto bg-zinc-800 border border-zinc-700 rounded-lg">
          <table className="min-w-full text-sm text-left text-zinc-300">
            <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Amount (₹)</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {donations.map((donation) => (
                <tr
                  key={donation._id}
                  className="border-t border-zinc-700 hover:bg-zinc-700 transition"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    ₹{donation.amount}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        donation.status === "SUCCESS"
                          ? "bg-green-600 text-white"
                          : donation.status === "FAILED"
                          ? "bg-red-600 text-white"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

}

export default DonationHistory;
