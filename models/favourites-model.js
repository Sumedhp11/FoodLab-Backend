import mongoose, { Schema, model } from "mongoose";

const FavouritesSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dishId: {
    type: [mongoose.Types.ObjectId],
    ref: "Dish",
    required: true,
  },
  resId: {
    type: [mongoose.Types.ObjectId],
    ref: "restaurant",
    required: true,
  },
});

const Favourites = model("Favourites", FavouritesSchema);
export default Favourites;
