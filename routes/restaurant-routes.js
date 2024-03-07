const express = require("express");
const {
  getAllRestaurants,
  getRestaurantById,
  getResMenu,
} = require("../controllers/restaurants-controller");
const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);
router.get("/menu", getResMenu);
exports.router = router;
