const Restaurant = require("../models/restaurant-model"); // Adjust the path accordingly

const ITEMS_PER_PAGE = 10; // Adjust the number of items per page as needed

const getAllRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const totalItems = await Restaurant.countDocuments();
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const restaurants = await Restaurant.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.status(200).json({
      restaurants,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// const removeDuplicate = async(req,res)=>{
//   try {
//     const id = 
//   } catch (error) {
    
//   }
// }


module.exports = {
  getAllRestaurants,
};
