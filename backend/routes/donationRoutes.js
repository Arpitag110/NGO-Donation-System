const express = require("express");
const {
    createDonation,
    updateDonationStatus,
    getMyDonations,
    createPayherePayment,
    handlePayhereIPN,
    createTestPayment,
} = require("../controllers/donationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createDonation);
router.post("/update", protect, updateDonationStatus);
router.get("/me", protect, getMyDonations);

// Test payment route (for demo/presentation)
router.post("/test-payment", protect, createTestPayment);

// PayHere integration routes
router.post("/create-payment", protect, createPayherePayment);
router.post("/payhere-ipn", express.json(), handlePayhereIPN); // Public webhook endpoint

module.exports = router;
