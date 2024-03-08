const mongoose = require("mongoose");

const dishSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String },
    mrp: { type: Number, required: true },
    dishId: { type: String, required: true },
    restaurantId: { type: Number, required: true },
    isVeg: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

exports.Dish = mongoose.model("Dish", dishSchema);
