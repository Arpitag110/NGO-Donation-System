const Donation = require("../models/Donation");
const crypto = require("crypto");

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

// CREATE TEST PAYMENT (FOR DEMO/PRESENTATION)
exports.createTestPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Create donation with SUCCESS status immediately (for testing)
    const donation = await Donation.create({
      user: req.user.id,
      amount,
      status: "SUCCESS",
      paymentId: "TEST_PAYMENT_" + Date.now(),
    });

    res.status(201).json({
      success: true,
      message: "Test payment successful",
      donation,
    });
  } catch (error) {
    console.error("Test payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE PAYHERE PAYMENT
exports.createPayherePayment = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Create donation with PENDING status
    const donation = await Donation.create({
      user: req.user.id,
      amount,
      status: "PENDING",
    });

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const orderId = donation._id.toString();
    // Format amount with exactly 2 decimal places
    const paymentAmount = parseFloat(donation.amount).toFixed(2);

    // Decode secret from base64
    const secretBase64 = process.env.PAYHERE_MERCHANT_SECRET;
    const decodedSecret = Buffer.from(secretBase64, 'base64').toString('utf-8');

    // Generate MD5 hash: merchant_id + order_id + amount + secret
    // Amount must be formatted as string with 2 decimals
    const hashString = `${merchantId}${orderId}${paymentAmount}${decodedSecret}`;
    const hash = crypto.createHash("md5").update(hashString).digest("hex");

    // Simple payload - just the essentials PayHere needs
    const payload = {
      merchant_id: merchantId,
      return_url: "http://localhost:5173/donations",
      cancel_url: "http://localhost:5173/donate",
      order_id: orderId,
      items: "NGO Donation",
      currency: "LKR",
      amount: paymentAmount,
      hash: hash,
    };

    console.log("=== PayHere Payment Debug ===");
    console.log("Merchant ID:", merchantId);
    console.log("Order ID:", orderId);
    console.log("Amount:", paymentAmount);
    console.log("Decoded Secret:", decodedSecret);
    console.log("Hash Input:", hashString);
    console.log("Hash Output:", hash);
    console.log("Payload:", payload);
    console.log("===============================");

    res.status(201).json({
      success: true,
      message: "Payment session created",
      donationId: donation._id,
      payhere: payload,
    });
  } catch (error) {
    console.error("PayHere error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PAYHERE IPN WEBHOOK HANDLER (PUBLIC)
exports.handlePayhereIPN = async (req, res) => {
  try {
    const ipn = req.body;

    console.log("PayHere IPN received:", ipn);

    // Verify signature (if PayHere provides one)
    if (process.env.PAYHERE_MERCHANT_SECRET && ipn.signature) {
      const hash = crypto
        .createHmac("sha256", process.env.PAYHERE_MERCHANT_SECRET)
        .update(`${ipn.order_id}${ipn.payment_id}${ipn.amount}${ipn.status}`)
        .digest("hex");

      if (ipn.signature !== hash) {
        console.warn("Invalid PayHere IPN signature");
        return res.status(400).send("Invalid signature");
      }
    }

    // Find donation by order_id (which is the donation._id)
    const donation = await Donation.findById(ipn.order_id);
    if (!donation) {
      console.error(`Donation not found: ${ipn.order_id}`);
      return res.status(404).send("Order not found");
    }

    // Idempotent check - don't process if already processed with same payment
    if (donation.paymentId === ipn.payment_id) {
      console.log(`Already processed payment: ${ipn.payment_id}`);
      return res.status(200).send("Already processed");
    }

    // Update donation status based on payment status
    donation.status = ipn.status === "captured" || ipn.status === "success" ? "SUCCESS" : "FAILED";
    donation.paymentId = ipn.payment_id;
    donation.updatedAt = new Date();

    await donation.save();

    console.log(`Donation ${donation._id} updated to ${donation.status} with payment ${ipn.payment_id}`);

    // PayHere expects a 200 OK response
    res.status(200).send("OK");
  } catch (error) {
    console.error("PayHere IPN error:", error);
    res.status(500).send("Server error");
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
