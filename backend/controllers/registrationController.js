const Registration = require("../models/Registration");

// CREATE REGISTRATION
exports.createRegistration = async (req, res) => {
  try {
    const { phone, address, city, state } = req.body;

    if (!phone || !address) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Prevent duplicate registration
    const existing = await Registration.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "Already registered" });
    }

    const registration = await Registration.create({
      user: req.user.id,
      phone,
      address,
      city,
      state,
    });

    res.status(201).json({
      message: "Registration successful",
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET MY REGISTRATION
exports.getMyRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      user: req.user.id,
    }).populate("user", "name email");

    if (!registration) {
      return res.status(404).json({ message: "No registration found" });
    }

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
