const express = require("express");
const router = express.Router();
const {
  initiateNetbankingPayment,
  verifyNetbankingPayment,
  generateUPIQRCode,
} = require("../controllers/payment-controller");

// Route for initiating Netbanking payment
router.post("/netbanking", initiateNetbankingPayment);

// Route for verifying Netbanking payment callback
router.post("/netbanking/callback", verifyNetbankingPayment);

// Route for generating UPI QR code
router.post("/upi/qr", generateUPIQRCode);

// Route for handling UPI payment callback

exports.router = router;
