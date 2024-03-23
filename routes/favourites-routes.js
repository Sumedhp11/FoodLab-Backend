import express from "express";
import {
  getFavouritesByUserId,
  togglefavDishes,
  togglefavRestaurant,
} from "../controllers/favourites-controller.js";

const router = express.Router();

router.post("/toggle-restaurants", togglefavRestaurant);
router.post("/toggle-dishes", togglefavDishes);
router.get("/getfavByUser", getFavouritesByUserId);

export default router;
