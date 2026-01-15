const express = require("express");
const {
  createDonation,
  updateDonationStatus,
  getMyDonations,
} = require("../controllers/donationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createDonation);
router.post("/update", protect, updateDonationStatus);
router.get("/me", protect, getMyDonations);

module.exports = router;
