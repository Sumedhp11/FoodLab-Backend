const express = require("express");
const { getAllRestaurants } = require("../controllers/restaurants-controller");
const router = express.Router();

router.get("/", getAllRestaurants);
exports.router = router;
