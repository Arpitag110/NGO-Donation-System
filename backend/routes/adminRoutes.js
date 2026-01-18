const express = require("express");
const router = express.Router();

const {
  getAdminStats,
  getAllDonations,
  getAllUsers,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/donations", protect, adminOnly, getAllDonations);
router.get("/users", protect, adminOnly, getAllUsers); // 🔴 MUST BE FUNCTION

module.exports = router;
