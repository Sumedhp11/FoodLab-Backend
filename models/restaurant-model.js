const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageId: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  areaName: {
    type: String,
    required: true,
  },
  costForTwo: {
    type: String,
    required: true,
  },
  cuisines: {
    type: [String],
    required: true,
  },
  avgRating: {
    type: Number,
    required: true,
  },
  totalRatings: {
    type: String,
    required: true,
  },
  deliveryTime: {
    type: Number,
    required: true,
  },
  slaString: {
    type: String,
    required: true,
  },
  
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
