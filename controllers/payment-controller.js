const { instance } = require("../index");
const crypto = require("crypto");

exports.checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    return res.status(200).json({ sucess: true, data: order });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Failed",
      error,
    });
  }
};

exports.paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    res.redirect(
      `http://localhost:5173/congrats?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      sucess: false,
    });
  }
};
