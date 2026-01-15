const express = require("express");
const {
  createRegistration,
  getMyRegistration,
} = require("../controllers/registrationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createRegistration);
router.get("/me", protect, getMyRegistration);

module.exports = router;
