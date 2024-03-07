const express = require("express");
const {
  scrapeSwiggyResutaurantDataWithUrl,
  fetchProductAndInsertIntoDBFromSwiggy,
  fetchProductAndInsertIntoDBFromSwiggyMultiple,
  removeDuplicateRestaurants,
} = require("../controllers/scrape-controller");
const router = express.Router();
router.get("/api/scrape", scrapeSwiggyResutaurantDataWithUrl);
router.get("/api/multiple-add", fetchProductAndInsertIntoDBFromSwiggyMultiple);
router.get("/api/delete", removeDuplicateRestaurants);
module.exports = router;
