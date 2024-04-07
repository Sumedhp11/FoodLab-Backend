import Order from "../models/order-model.js";
import User from "../models/user-model.js";
import Restaurant from "../models/restaurant-model.js";
import cloudinary from "../helper/cloudinaryconfig.js";
function getAllMonths() {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
}
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }, { password: 0 });
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

export const getAllrestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const skip = (page - 1) * perPage;

    const restaurants = await Restaurant.find().skip(skip).limit(perPage);

    return res.status(200).json({
      status: 200,
      data: {
        restaurants,
        totalDocs: Math.ceil((await Restaurant.countDocuments()) / perPage),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      error: "Internal server error",
    });
  }
};

export const GetAllOrderChartData = async (req, res) => {
  try {
    const orders = await Order.find();

    const monthlyOrderTotals = {};
    const currentYear = new Date().getFullYear();

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const monthYear = orderDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!monthlyOrderTotals[monthYear]) {
        monthlyOrderTotals[monthYear] = 0;
      }
      monthlyOrderTotals[monthYear]++;
    });

    // Prepare chart data
    const allMonthsChartData = [];
    for (let i = 0; i < 12; i++) {
      const monthYear = new Date(currentYear, i).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      const totalOrders = monthlyOrderTotals[monthYear] || 0;
      allMonthsChartData.push({ monthYear, totalOrders });
    }

    return res.status(200).json(allMonthsChartData);
  } catch (error) {
    console.error("Error fetching order data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getNumberOfUserPerMonth = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false });

    // Initialize user count per month
    const userCountPerMonth = {};
    const currentYear = new Date().getFullYear();

    // Calculate user counts for each month
    users.forEach((user) => {
      const month = new Date(user.createdAt).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      if (!userCountPerMonth[month]) {
        userCountPerMonth[month] = 0;
      }
      userCountPerMonth[month]++;
    });

    // Prepare chart data
    const allMonthsUserData = [];
    for (let i = 0; i < 12; i++) {
      const monthYear = new Date(currentYear, i).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      const count = userCountPerMonth[monthYear] || 0;
      allMonthsUserData.push({ month: monthYear, count });
    }

    return res.status(200).json(allMonthsUserData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getNumberOfDeliveryStatusOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    const deliveryStatusCounts = {};

    orders.forEach((order) => {
      const deliveryStatus = order.deliveryStatus;

      if (deliveryStatusCounts[deliveryStatus]) {
        deliveryStatusCounts[deliveryStatus]++;
      } else {
        deliveryStatusCounts[deliveryStatus] = 1;
      }
    });

    return res.status(200).json(deliveryStatusCounts);
  } catch (error) {
    console.error("Error fetching order data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const EditRestaurant = async (req, res) => {
  try {
    let image;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.public_id;
    }

    const { name, costForTwo } = req.body;

    // Create new restaurant object with updated information
    const updatedRestaurant = {
      name: name,
      costForTwo: costForTwo,
    };

    if (image) {
      updatedRestaurant.imageId = image;
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      updatedRestaurant,
      { new: true }
    );

    // Check if restaurant was found and updated
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }

    return res.status(200).json({
      status: 200,
      message: "Restaurant updated successfully",
      data: restaurant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
      error,
    });
  }
};

export const deleteRes = async (req, res) => {
  try {
    const { resId } = req.query;

    const restaurant = await Restaurant.findById(resId);
    restaurant.isdeleted = true;
    restaurant.save();
    return res.status(200).json({
      status: 200,
      message: "Restaurant deleted Sucessfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
      error,
    });
  }
};

export const addnewres = async (req, res) => {
  try {
    let image;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.public_id;
    }
    const { name, slaString, costForTwo } = req.body;
    const generateUniqueId = () => Math.floor(Math.random() * 900000) + 100000;
    const totalRatings =
      (3.0 * 200).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "K";
    const newRestaurant = new Restaurant({
      name,
      id: generateUniqueId(),
      imageId: image,
      cuisines: ["Dosa,Idli,Burger,Pizza"],
      avgRating: 3.0,
      totalRatings: totalRatings,
      slaString,
      costForTwo,
    });

    await newRestaurant.save();

    return res.status(201).json({
      status: 201,
      message: "Restaurant added successfully",
      data: newRestaurant,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
      error: error.message,
    });
  }
};
