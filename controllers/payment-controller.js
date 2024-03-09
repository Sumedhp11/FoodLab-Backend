const Razorpay = require("razorpay");
const qr = require("qrcode");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.initiateNetbankingPayment = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      payment_capture: 1,
    });

    res.json({ orderId: order.id });
  } catch (error) {
    console.error("Error initiating Netbanking payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyNetbankingPayment = async (req, res) => {
  try {
    const paymentSignature = req.body["razorpay_signature"];
    const orderId = req.body["razorpay_order_id"];
    const paymentId = req.body["razorpay_payment_id"];

    const isSignatureValid = razorpay.validateWebhookSignature(
      req.rawBody,
      paymentSignature,
      orderId
    );

    if (!isSignatureValid) {
      return res.status(400).send("Invalid signature");
    }

    res.status(200).send("Payment successful");
  } catch (error) {
    console.error("Error verifying Netbanking payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.generateUPIQRCode = async (req, res) => {
  try {
    const { amount } = req.body;
    const upiId = "sumedhpawar8966-1@okaxis"; // Replace with your UPI ID
    const qrCodeData = `upi://pay?pa=${encodeURIComponent(
      upiId
    )}&am=${amount}&cu=INR`;

    qr.toDataURL(qrCodeData, (err, qrCodeUrl) => {
      if (err) {
        console.error("Error generating UPI QR code:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json({ qrCodeImageUrl: qrCodeUrl });
    });
  } catch (error) {
    console.error("Error generating UPI QR code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.handleUPIPaymentCallback = async (req, res) => {
  try {
    // Handle UPI payment callback
    res.redirect("/congrats"); // Redirect to congratulations page
  } catch (error) {
    console.error("Error handling UPI payment callback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
