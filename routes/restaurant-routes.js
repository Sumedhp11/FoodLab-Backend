import express from "express";
import {
  getAllRestaurants,
  getResMenu,
  favtoggle,
} from "../controllers/restaurants-controller.js";

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/menu", getResMenu);
router.put("/toggle-fav", favtoggle);

export default router;
