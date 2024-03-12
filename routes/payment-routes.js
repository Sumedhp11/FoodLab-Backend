import express from "express";
import {
  checkout,
  extractUserData,
  paymentVerification,
} from "../controllers/payment-controller.js";

const router = express.Router();

router.post("/checkout", extractUserData, checkout);
router.post("/paymentverification", paymentVerification);

export default router;
