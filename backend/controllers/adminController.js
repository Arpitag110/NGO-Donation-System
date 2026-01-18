const User = require("../models/User");
const Registration = require("../models/Registration");
const Donation = require("../models/Donation");

// DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    const donationStats = await Donation.aggregate([
      { $match: { status: "SUCCESS" } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalDonations = donationStats[0]?.totalAmount || 0;

    res.json({
      totalUsers,
      totalRegistrations,
      totalDonations,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// VIEW ALL REGISTRATIONS
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().populate(
      "user",
      "name email"
    );
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// VIEW ALL DONATIONS
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
