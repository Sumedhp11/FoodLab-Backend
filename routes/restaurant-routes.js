const express = require("express");
const {
  getAllRestaurants,
  getMenu,
} = require("../controllers/restaurants-controller");
const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/menu", getMenu);
exports.router = router;
