import Order from "../models/order-model.js";
import User from "../models/user-model.js";
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    return res.status(200).json({
      status: 200,
      message: "Users Fetched Sucessfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    user.isdeleted = true;
    await user.save();

    return res.status(200).json({
      status: 200,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const order = await Order.find().populate([
      {
        path: "dishes.dish",
        model: "Dish",
      },
      {
        path: "address",
        model: "Address",
      },
      {
        path: "userId",
        model: "User",
        select: "name email phone", // Specify the fields to retrieve
      },
    ]);
    return res.status(200).json({
      status: 200,
      message: "Orders Fetched Sucessfully",
      data: order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

export const changeDeliveryStatus = async (req, res) => {
  try {
    const { orderId, deliverystatus } = req.query;
    const order = await Order.findById(orderId);

    order.deliveryStatus = deliverystatus;
    await order.save();
    return res.status(200).json({
      status: 200,
      message: "Delivery Status Updated Sucessfully",
      data: order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};
