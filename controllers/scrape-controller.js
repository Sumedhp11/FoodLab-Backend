const axios = require("axios");
const dishModel = require("../models/dish-model");
const Restaurant = require("../models/restaurant-model");

exports.scrapeSwiggyResutaurantDataWithUrl = async (req, res) => {
  try {
    const url =
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=19.0759837&lng=72.8776559&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING";
    // const response = await fetch(url);
    const response = await axios(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      },
    });
    const filteredData = response.data;
    // console.log("15", response.data);
    const a =
      filteredData?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle
        ?.restaurants;
    const b =
      filteredData?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle
        ?.restaurants;

    let combinedData = [];

    if (a) {
      combinedData.push(...a);
    }

    if (b) {
      combinedData.push(...b);
    }

    console.log("Combined Data:", combinedData);
    console.log("22", combinedData.length);
    // return res.status(200).json({ combinedData });
    for (const a of combinedData) {
      const existingRest = await Restaurant.findOne({
        id: a.info.id,
      });

      // If dish doesn't exist, insert into the database
      if (!existingRest) {
        await Restaurant.create({
          // name: item.card.info.name,
          id: a.info.id,
          name: a.info.name,
          imageId: a.info.cloudinaryImageId,
          locality: a.info.locality,
          areaName: a.info.areaName,
          costForTwo: a.info.costForTwo,
          cuisines: a.info.cuisines,
          avgRating: a.info.avgRating,
          totalRatings: a.info.totalRatingsString,
          deliveryTime: a.info.sla.deliveryTime,
          slaString: a.info.sla.slaString,
        });
      }
    }
    return res.status(200).json({
      status: "Success",
      message: "Data inserted successfully",
    });
  } catch (error) {
    console.error("Error scraping Swiggy restaurant data:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.fetchProductAndInsertIntoDBFromSwiggyMultiple = async (req, res) => {
  try {
    const restaurantDetails = await Restaurant.find();

    for (const restaurant of restaurantDetails) {
      const url = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=19.0759837&lng=72.8776559&restaurantId=${restaurant.id}&catalog_qa=undefined&submitAction=ENTER`;

      const response = await axios(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        },
      });

      const cards =
        response?.data?.data?.cards[2]?.groupedCard?.cardGroupMap?.REGULAR
          ?.cards || [];

      for (const card of cards) {
        // Check if the card contains itemCards
        if (card?.card?.card.itemCards) {
          const items = card?.card?.card?.itemCards || [];

          for (const item of items) {
            // Check if the dish already exists in the database
            const existingDish = await dishModel.findOne({
              dishId: item?.card.info?.id,
            });

            // If dish doesn't exist, insert into the database
            if (!existingDish) {
              // console.log(restaurant, "104");
              await dishModel.create({
                name: item.card.info.name,
                image: item.card.info.imageId,
                restaurantId: restaurant.id,
                dishId: item.card.info.id,
                description: item.card.info.description,
                mrp: item.card.info.defaultPrice || item.card.info.price,
                isVeg: item.card.info.isVeg,
              });
            }
          }
        }
      }
    }

    return res.status(200).json({
      status: "Success",
      message: "Data inserted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.removeDuplicateRestaurants = async (req, res) => {
  try {
    // Find all restaurants
    const allRestaurants = await Restaurant.find();

    // Initialize an object to store unique restaurant names
    const uniqueRestaurantNames = {};

    // Filter out duplicate restaurants
    const uniqueRestaurants = allRestaurants.filter((restaurant) => {
      if (uniqueRestaurantNames[restaurant.name]) {
        // If the restaurant name already exists, it's a duplicate
        return false;
      } else {
        // If the restaurant name doesn't exist, add it to the object
        uniqueRestaurantNames[restaurant.name] = true;
        return true;
      }
    });

    // Remove the duplicate restaurants from the database
    await Restaurant.deleteMany({
      name: { $in: allRestaurants.map((restaurant) => restaurant.name) },
    });

    // Insert the unique restaurants back into the database
    await Restaurant.insertMany(uniqueRestaurants);

    return res.status(200).json({
      status: "Success",
      message: "Duplicate restaurants removed successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
