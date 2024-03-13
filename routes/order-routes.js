import express from "express";
import { getOrderByUserId } from "../controllers/order-controller.js";

const router = express.Router();

router.get("/orderbyId", getOrderByUserId);

export default router;
