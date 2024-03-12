import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import paymentModel from "../models/payment-model.js";
dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
export const extractUserData = (req, res, next) => {
  console.log(req.body, 12);
  const { userId, selectedAddress } = req.body;
  req.userData = { userId, selectedAddress };
  console.log(req.userData, 15);
  next();
};

export const checkout = async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      notes: {
        merchant: "FoodLab",
        upi_id: "sumedhpawar8966@okaxis",
      },
    };

    const order = await instance.orders.create(options);
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Failed",
      error: error.message,
    });
  }
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  // console.log(req, "44");c
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  const isauth = expectedSignature === razorpay_signature;
  if (isauth) {
    const razorpayOrder = await instance.orders.fetch(razorpay_order_id);

    res.redirect(
      `http://localhost:5173/congrats?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({ success: false });
  }
};
