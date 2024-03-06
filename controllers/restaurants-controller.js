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
    const restaurant = await Restaurant.find({ id: resId });
    const menuList = await dish.find({ restaurantId: resId });
    // console.log(menuList);
    if (!menuList) {
      return res.status(404).json({ error: "Menu not found" });
    }
    return res.status(200).json({
      status: "Fetched Menu Sucessfully",
      data: {
        ResDetails: restaurant,
        Menu: menuList,
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
