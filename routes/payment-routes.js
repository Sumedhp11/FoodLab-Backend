const express = require("express");
import {
  checkout,
  paymentVerification,
} from "../controllers/payment-controller";
const router = express.Router();

router.post("/checkout", checkout);
router.post("/payment-verification", paymentVerification);

exports.router = router;
