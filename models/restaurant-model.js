import mongoose from "mongoose";

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
  isFav: {
    type: Boolean,
    default: false,
  },
  isdeleted: {
    type: Boolean,
    default: false,
  },
});

const Restaurant = mongoose.model("restaurant", restaurantSchema);

export default Restaurant;
