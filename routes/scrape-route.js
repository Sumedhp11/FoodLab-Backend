const express = require("express");
const {
  scrapeSwiggyResutaurantDataWithUrl,

  fetchProductAndInsertIntoDBFromSwiggyMultiple,
  removeDuplicateRestaurants,
  scrapeSwiggyInfiniteScrollData,
} = require("../controllers/scrape-controller");
const router = express.Router();
router.get("/api/scrape", scrapeSwiggyResutaurantDataWithUrl);
router.get("/api/multiple-add", fetchProductAndInsertIntoDBFromSwiggyMultiple);
router.get("/api/delete", removeDuplicateRestaurants);
router.get("/api/scrapeinfinitescrolldata", scrapeSwiggyInfiniteScrollData);

module.exports = router;
