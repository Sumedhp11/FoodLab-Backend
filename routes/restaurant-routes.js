import express from "express";
import {
  getAllRestaurants,
  getResMenu,
} from "../controllers/restaurants-controller.js";

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/menu", getResMenu);

export default router;
