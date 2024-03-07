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

exports.scrapeSwiggyInfiniteScrollData = async () => {
  const headers = {
    Cookie:
      "__SW=ouvnE8EmVF1HJAaOIu1xr1xSIDv7zl8l; _device_id=2c80bd17-c1c5-c22d-498b-798ed356b7d8; userLocation={%22lat%22:%2219.07480%22%2C%22lng%22:%2272.88560%22%2C%22address%22:%22%22%2C%22area%22:%22%22%2C%22showUserDefaultAddressHint%22:false}; fontsLoaded=1; _guest_tid=84cc6279-23fa-46f4-a8e1-beb33903192e; _sid=ckn99db7-441d-4fca-8335-53d8f719b7a6",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  };

  try {
    let collectionV5Value = 10;

    for (let i = 0; i <= 100; i += 10) {
      const widgetOffset = {
        NewListingView_category_bar_chicletranking_TwoRows: "",
        NewListingView_category_bar_chicletranking_TwoRows_Rendition: "",
        Restaurant_Group_WebView_SEO_PB_Theme: "",
        collectionV5RestaurantListWidget_SimRestoRelevance_food_seo:
          String(collectionV5Value),
        inlineFacetFilter: "",
        restaurantCountWidget: "",
      };

      const response = await axios.post(
        "https://www.swiggy.com/dapi/restaurants/list/update",
        {
          lat: "19.07480",
          lng: "72.88560",
          nextOffset: "",
          widgetOffset,
          filters: {},
          seoParams: {
            seoUrl: "https://www.swiggy.com/",
            pageType: "FOOD_HOMEPAGE",
            apiName: "FoodHomePage",
          },
          page_type: "DESKTOP_WEB_LISTING",
          _csrf: "GB6wnNHNfcmB-xKZe2LXzD0mhsjRAHQlPxTlHO2o",
        },
        { headers }
      );

      const restaurants =
        response.data?.data?.cards[0].card?.card?.gridElements?.infoWithStyle
          ?.restaurants;
      if (restaurants && restaurants.length > 0) {
        await saveRestaurantsToDB(restaurants);
        console.log(`Data for restaurants ${i + 1}-${i + 10} saved.`);
      } else {
        console.log("No more restaurants found. Exiting loop.");
        break;
      }

      collectionV5Value += 10;
    }
    console.log("All restaurants scraped and saved successfully.");
    return res.json({ message: "Scrapped Sucessfully" });
  } catch (error) {
    console.error("Error scraping Swiggy data:", error);
    throw error;
  }
};

const saveRestaurantsToDB = async (restaurants) => {
  try {
    for (const restaurant of restaurants) {
      console.log(restaurant, "235");
      const existingRestaurant = await Restaurant.findOne({
        id: restaurant.info.id,
      });
      if (!existingRestaurant) {
        const restaurantData = {
          id: restaurant.info.id || " ",
          name: restaurant.info.name || " ",
          imageId: restaurant.info.cloudinaryImageId || " ",
          locality: restaurant.info.locality || " ",
          areaName: restaurant.info.areaName || " ",
          costForTwo: restaurant.info.costForTwo || " ",
          cuisines: restaurant.info.cuisines || [],
          avgRating: restaurant.info.avgRating || "4.3",
          totalRatings: restaurant.info.totalRatingsString || "10k",
          deliveryTime: restaurant.info.sla?.deliveryTime || " ",
          slaString: restaurant.info.sla?.slaString || " ",
        };
        await Restaurant.create(restaurantData);
      } else {
        console.log(
          `Restaurant with ID ${restaurant.info.id} already exists in the database.`
        );
      }
    }
  } catch (error) {
    console.error("Error saving restaurants to the database:", error);
    throw error;
  }
};
