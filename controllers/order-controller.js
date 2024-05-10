import Order from "../models/order-model.js";

export const getOrderByUserId = async (req, res) => {
  const { userId } = req.query;
  console.log(userId, 5);
  try {
    const order = await Order.find({
      userId: userId,
      deliveryStatus: "placed",
    }).populate([
      {
        path: "dishes.dish",
        model: "Dish",
      },
      {
        path: "address",
        model: "Address",
      },
    ]);

    return res.status(200).json({
      status: "200",
      message: "Successfully fetched Orders",
      data: order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "500",
      message: "Something went wrong",
      error,
    });
  }
};
