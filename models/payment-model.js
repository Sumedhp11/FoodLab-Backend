import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: { type: String },
    razorpay_signature: {
      type: String,
    },
    userId: { type: String },
    selectedAddress: { type: String },
    dishes: [Object],
  },
  { timestamps: true }
);
const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
