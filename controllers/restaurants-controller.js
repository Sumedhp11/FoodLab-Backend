const dish = require("../models/dish-model");
const Restaurant = require("../models/restaurant-model");

const ITEMS_PER_PAGE = 10;

const getAllRestaurants = async (req, res) => {
  try {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }

    const totalItems = await Restaurant.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const restaurants = await Restaurant.find(query).skip(skip).limit(limit);

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

const getMenu = async (req, res) => {
  try {
    const { resId } = req.query;
    const { search, page } = req.query;
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }
    const pageSize = 20;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * pageSize;

    const restaurant = await Restaurant.findOne({ id: resId });
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const totalCount = await dish.countDocuments({
      restaurantId: resId,
      ...query,
    });
    // Fetch menu list with pagination
    const menuList = await dish
      .find({ restaurantId: resId, ...query })
      .skip(skip)
      .limit(pageSize);

    return res.status(200).json({
      status: "Success",
      data: {
        ResDetails: restaurant,
        Menu: { menuList, totalCount: totalCount, page: page },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllRestaurants,
  getMenu,
};
