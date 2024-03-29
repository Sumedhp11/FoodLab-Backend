import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Payment from "../models/payment-model.js";
import Order from "../models/order-model.js";
import Cart from "../models/cart-model.js";
import User from "../models/user-model.js";
import nodemailer from "nodemailer";

dotenv.config();
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9883af3becd820",
    pass: "3fae2749d9780e",
  },
});
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const checkout = async (req, res) => {
  const { amount, userId, selectedAddress, cartItems } = req.body;

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
    console.log(order, 26);
    const payment = new Payment({
      razorpay_order_id: order.id,
      userId,
      selectedAddress,
      dishes: cartItems,
    });

    await payment.save();

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

  // Verify the payment signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  const isauth = expectedSignature === razorpay_signature;

  if (isauth) {
    try {
      const payment = await Payment.findOne({ razorpay_order_id });
      if (!payment) {
        return res
          .status(404)
          .json({ success: false, message: "Payment not found" });
      }
      const order = await instance.orders.fetch(razorpay_order_id);
      const user = await User.findById(payment.userId);
      const orderDetails = {
        userId: payment.userId,
        dishes: payment.dishes,
        amount: order.amount,
        deliveryStatus: "placed",
        paymentStatus: order.status,
        address: payment.selectedAddress,
      };
      const newOrder = await Order.create(orderDetails);
      user.orders.push(newOrder._id);
      await user.save();
      await Cart.deleteMany({ user: payment.userId });

      await Payment.deleteMany({ razorpay_order_id: razorpay_order_id });
      await sendConfirmationEmail(user.email, razorpay_payment_id);
      return res.redirect(
        // `http://localhost:5173/congrats?reference=${razorpay_payment_id}`
        `https://foodllaab.vercel.app/congrats?reference=${razorpay_payment_id}`
      );
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
};
const sendConfirmationEmail = async (userEmail, paymentId) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Order Confirmation",
    text: `Your order with payment ID ${paymentId} has been successfully placed. Thank you for shopping with us!`,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
