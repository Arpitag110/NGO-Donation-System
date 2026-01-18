const Donation = require("../models/Donation");

// CREATE DONATION (PENDING)
exports.createDonation = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid donation amount" });
    }

    const donation = await Donation.create({
      user: req.user.id,
      amount,
      status: "PENDING",
    });

    res.status(201).json({
      message: "Donation initiated",
      donation,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE DONATION STATUS (MOCK PAYMENT)
exports.updateDonationStatus = async (req, res) => {
  try {
    const { donationId, status } = req.body;

    if (!["SUCCESS", "FAILED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    donation.status = status;
    donation.paymentId = "MOCK_PAYMENT_" + Date.now();
    donation.updatedAt = new Date();

    await donation.save();

    res.json({
      message: `Donation marked as ${status}`,
      donation,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET MY DONATIONS
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
