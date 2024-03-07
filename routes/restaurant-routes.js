const express = require("express");
const {
  getAllRestaurants,
  getResMenu,
} = require("../controllers/restaurants-controller");
const router = express.Router();

router.get("/", getAllRestaurants);

router.get("/menu", getResMenu);
exports.router = router;
