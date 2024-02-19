const express = require("express");
const {
  scrapeSwiggyResutaurantDataWithUrl,
  fetchProductAndInsertIntoDBFromSwiggy,
  fetchProductAndInsertIntoDBFromSwiggyMultiple,
} = require("../controllers/scrape-controller");
const router = express.Router();
router.get("/api/scrape", scrapeSwiggyResutaurantDataWithUrl);
router.get("/api/multiple-add", fetchProductAndInsertIntoDBFromSwiggyMultiple);
module.exports = router;
