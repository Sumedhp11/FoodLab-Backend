const Restaurant = require("../models/restaurant-model");

const ITEMS_PER_PAGE = 10;

const getAllRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalItems = await Restaurant.countDocuments();
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const restaurants = await Restaurant.find().skip(skip).limit(limit);

    res.status(200).json({
      restaurants,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllRestaurants,
};
