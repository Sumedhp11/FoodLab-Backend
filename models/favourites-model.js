import { Schema, model } from "mongoose";

const FavouritesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dishId: {
    type: [Schema.Types.ObjectId],
    ref: "Dish",
    required: true,
  },
  resId: {
    type: [Schema.Types.ObjectId],
    ref: "restaurant",
    required: true,
  },
});

const Favourites = model("Favourites", FavouritesSchema);
export default Favourites;
