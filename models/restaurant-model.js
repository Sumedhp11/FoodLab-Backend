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
  lastMileTravel: {
    type: Number,
    required: true,
  },
  serviceability: {
    type: String,
    required: true,
  },
  slaString: {
    type: String,
    required: true,
  },
  lastMileTravelString: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  discountInfo: {
    header: {
      type: String,
      required: true,
    },
    subHeader: {
      type: String,
      required: true,
    },
  },
  menuLink: {
    type: String,
    required: true,
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
