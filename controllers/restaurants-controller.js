import Dish from "../models/dish-model.js";
import Restaurant from "../models/restaurant-model.js";

export const getAllRestaurants = async (req, res) => {
  try {
    const search = req.query.search;
    const resId = req.query.resId; // Add resId parameter
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }
    if (resId) {
      query.id = resId; // Filter by restaurant ID
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

export const getResMenu = async (req, res) => {
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

    const totalCount = await Dish.countDocuments({
      restaurantId: resId,
      ...query,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    // Fetch menu list with pagination
    const menuList = await Dish.find({ restaurantId: resId, ...query })
      .skip(skip)
      .limit(pageSize);

    return res.status(200).json({
      status: "Success",
      data: {
        menu: menuList,
        page: parseInt(pageNumber),
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const favtoggle = async (req, res) => {
  const { resId } = req.query;
  try {
    const rest = await Restaurant.findById(resId);
    rest.isFav = !rest.isFav;
    await rest.save();

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
