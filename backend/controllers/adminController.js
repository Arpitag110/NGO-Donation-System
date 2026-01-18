const User = require("../models/User");
const Donation = require("../models/Donation");
const Registration = require("../models/Registration");

// ADMIN STATS
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    const donations = await Donation.find({ status: "SUCCESS" });

    const totalDonations = donations.reduce(
      (sum, d) => sum + d.amount,
      0
    );

    res.json({
      totalUsers,
      totalRegistrations,
      totalDonations,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ALL DONATIONS
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ ALL USERS (THIS WAS THE PROBLEM AREA)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAdminStats,
  getAllDonations,
  getAllUsers, // 🔴 THIS MUST EXIST
};
