import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../api/api";
import { getToken } from "../utils/auth";

function Dashboard() {
  const [registration, setRegistration] = useState(null);
  const token = getToken();

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
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRegistration();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-red-400">
        Unauthorized. Please login.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">
        User Dashboard
      </h2>

      {/* Registration Summary */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-2">
          NGO Registration Status
        </h3>

        {registration ? (
          <div className="text-zinc-300 space-y-1">
            <p><span className="text-white">Phone:</span> {registration.phone}</p>
            <p><span className="text-white">City:</span> {registration.city || "-"}</p>
            <p className="text-green-500 mt-2">✔ Registration Completed</p>

            <Link
              to="/ngo-registration"
              className="inline-block mt-3 text-red-400 hover:underline"
            >
              View / Edit Details →
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-yellow-400">Registration not completed</p>
            <Link
              to="/ngo-registration"
              className="inline-block mt-3 text-red-400 hover:underline"
            >
              Complete Registration →
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/ngo-registration"
          className="bg-zinc-800 border border-zinc-700 rounded-lg p-6
                     hover:border-red-600 transition"
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            NGO Registration
          </h3>
          <p className="text-zinc-400 text-sm">
            View or update your registration details.
          </p>
        </Link>

        <Link
          to="/donate"
          className="bg-zinc-800 border border-zinc-700 rounded-lg p-6
                     hover:border-red-600 transition"
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            Make a Donation
          </h3>
          <p className="text-zinc-400 text-sm">
            Donate securely and track status.
          </p>
        </Link>

        <Link
          to="/donations"
          className="bg-zinc-800 border border-zinc-700 rounded-lg p-6
                     hover:border-red-600 transition"
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            My Donations
          </h3>
          <p className="text-zinc-400 text-sm">
            View donation history.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
