import Favourites from "../models/favourites-model.js";

export const togglefavRestaurant = async (req, res) => {
  try {
    const { userId, resId } = req.body;

    const favorite = await Favourites.findOne({ userId });

    if (favorite) {
      const index = favorite.resId.indexOf(resId);
      if (index !== -1) {
        favorite.resId.splice(index, 1);
        await favorite.save();
        return res
          .status(200)
          .json({ message: "Restaurant removed from favorites" });
      } else {
        favorite.resId.push(resId);
        await favorite.save();
        return res
          .status(201)
          .json({ message: "Restaurant added to favorites" });
      }
    } else {
      const newFavorite = new Favourites({ userId, resId: [resId] });
      await newFavorite.save();
      return res.status(201).json({ message: "Restaurant added to favorites" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, error: error.message });
  }
};
export const togglefavDishes = async (req, res) => {
  try {
    const { userId, dishId } = req.body;

    const favorite = await Favourites.findOne({ userId });

    if (favorite) {
      const index = favorite.dishId.indexOf(dishId);
      if (index !== -1) {
        favorite.dishId.splice(index, 1);
        await favorite.save();
        return res.status(200).json({ message: "dish removed from favorites" });
      } else {
        favorite.dishId.push(dishId);
        await favorite.save();
        return res.status(201).json({ message: "dish added to favorites" });
      }
    } else {
      const newFavorite = new Favourites({ userId, dishId: [dishId] });
      await newFavorite.save();
      return res.status(201).json({ message: "dish added to favorites" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, error: error.message });
  }
};
export const getFavouritesByUserId = async (req, res) => {
  try {
    const { userId } = req.query;
    const fav = await Favourites.findOne({ userId })
      .populate("resId")
      .populate("dishId");
    return res.status(200).json({
      status: 200,
      data: fav,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      error,
    });
  }
};
