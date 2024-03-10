import express from "express";
import {
  scrapeSwiggyResutaurantDataWithUrl,
  fetchProductAndInsertIntoDBFromSwiggyMultiple,
  removeDuplicateRestaurants,
  scrapeSwiggyInfiniteScrollData,
} from "../controllers/scrape-controller.js";

const router = express.Router();

router.get("/api/scrape", scrapeSwiggyResutaurantDataWithUrl);
router.get("/api/multiple-add", fetchProductAndInsertIntoDBFromSwiggyMultiple);
router.get("/api/delete", removeDuplicateRestaurants);
router.get("/api/scrapeinfinitescrolldata", scrapeSwiggyInfiniteScrollData);

export default router;
