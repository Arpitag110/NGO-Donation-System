import { useEffect, useState } from "react";
import API_BASE_URL from "../api/api";
import { getToken } from "../utils/auth";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  const token = getToken();

  // Filter donations based on status and date
  useEffect(() => {
    let filtered = [...donations];

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === "TODAY") {
      filtered = filtered.filter(d => {
        const donationDate = new Date(d.createdAt);
        return donationDate.toDateString() === now.toDateString();
      });
    } else if (dateFilter === "WEEK") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(d => new Date(d.createdAt) >= weekAgo);
    } else if (dateFilter === "MONTH") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(d => new Date(d.createdAt) >= monthAgo);
    }

    setFilteredDonations(filtered);
  }, [donations, statusFilter, dateFilter]);

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

      {/* Donation Stats Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Donation Status Distribution</h3>
          <div className="space-y-3">
            {['SUCCESS', 'FAILED', 'PENDING'].map((status) => {
              const count = donations.filter(d => d.status === status).length;
              const percentage = donations.length > 0 ? ((count / donations.length) * 100).toFixed(1) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-300">{status}</span>
                    <span className="text-white font-semibold">{count}</span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${status === 'SUCCESS' ? 'bg-green-500' :
                          status === 'FAILED' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Donation Insights</h3>
          <div className="space-y-3">
            <div>
              <p className="text-zinc-400 text-sm">Average Donation</p>
              <p className="text-2xl font-bold text-white">
                ₹{donations.length > 0 ? (donations.reduce((sum, d) => sum + d.amount, 0) / donations.length).toFixed(0) : 0}
              </p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Highest Donation</p>
              <p className="text-2xl font-bold text-red-500">
                ₹{donations.length > 0 ? Math.max(...donations.map(d => d.amount)) : 0}
              </p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-green-500">
                {donations.length > 0 ? ((donations.filter(d => d.status === 'SUCCESS').length / donations.length) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
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
                    className={`px-2 py-1 rounded text-xs font-semibold ${user.role === "ADMIN"
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

      {/* DONATIONS TABLE WITH FILTERS */}
      <h3 className="text-lg font-semibold text-white mb-4">
        Donations
      </h3>

      {/* Filters */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-4 flex gap-4 flex-wrap">
        <div>
          <label className="text-zinc-400 text-sm mr-2">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 text-white border border-zinc-700 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="ALL">All</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
        <div>
          <label className="text-zinc-400 text-sm mr-2">Date Range:</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-zinc-900 text-white border border-zinc-700 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="WEEK">Last 7 Days</option>
            <option value="MONTH">Last 30 Days</option>
          </select>
        </div>
        <div className="text-zinc-400 text-sm flex items-center">
          Showing {filteredDonations.length} of {donations.length} donations
        </div>
      </div>

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
            {filteredDonations.map((donation) => (
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
                    className={`px-2 py-1 rounded text-xs font-semibold ${donation.status === "SUCCESS"
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
