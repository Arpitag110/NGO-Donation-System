const express = require("express");
const {
  getDashboardStats,
  getAllRegistrations,
  getAllDonations,
} = require("../controllers/adminController");

const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", protect, isAdmin, getDashboardStats);
router.get("/registrations", protect, isAdmin, getAllRegistrations);
router.get("/donations", protect, isAdmin, getAllDonations);

module.exports = router;
