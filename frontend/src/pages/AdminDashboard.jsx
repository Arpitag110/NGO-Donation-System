import { useEffect, useState } from "react";
import API_BASE_URL from "../api/api";
import { getToken } from "../utils/auth";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const token = getToken();

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!token) return;

      try {
        // Stats
        const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsRes.json();
        if (!statsRes.ok) {
          setMessage(statsData.message || "Access denied");
          return;
        }
        setStats(statsData);

        // Donations
        const donationsRes = await fetch(`${API_BASE_URL}/admin/donations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const donationsData = await donationsRes.json();
        if (donationsRes.ok) setDonations(donationsData);

        // Users
        const usersRes = await fetch(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();
        if (usersRes.ok) setUsers(usersData);
      } catch (err) {
        setMessage("Server error");
      }
    };

    fetchAdminData();
  }, [token]);

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Admin Dashboard
      </h2>

      {message && <p className="text-red-400 mb-4">{message}</p>}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-5">
          <p className="text-zinc-400 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-white">
            {stats.totalUsers || 0}
          </p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-5">
          <p className="text-zinc-400 text-sm">Total Registrations</p>
          <p className="text-2xl font-bold text-white">
            {stats.totalRegistrations || 0}
          </p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-5">
          <p className="text-zinc-400 text-sm">Total Donations (₹)</p>
          <p className="text-2xl font-bold text-red-500">
            ₹{stats.totalDonations || 0}
          </p>
        </div>
      </div>

      {/* USERS TABLE */}
      <h3 className="text-lg font-semibold text-white mb-3">
        Registered Users
      </h3>

      <div className="overflow-x-auto bg-zinc-800 border border-zinc-700 rounded-lg mb-10">
        <table className="min-w-full text-sm text-left text-zinc-300">
          <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t border-zinc-700 hover:bg-zinc-700"
              >
                <td className="px-6 py-4 text-white">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-red-600 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DONATIONS TABLE */}
      <h3 className="text-lg font-semibold text-white mb-3">
        Donations
      </h3>

      <div className="overflow-x-auto bg-zinc-800 border border-zinc-700 rounded-lg">
        <table className="min-w-full text-sm text-left text-zinc-300">
          <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Amount (₹)</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr
                key={donation._id}
                className="border-t border-zinc-700 hover:bg-zinc-700"
              >
                <td className="px-6 py-4 text-white">
                  {donation.user?.name}
                </td>
                <td className="px-6 py-4">
                  {donation.user?.email}
                </td>
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
    </div>
  );
}

export default AdminDashboard;
