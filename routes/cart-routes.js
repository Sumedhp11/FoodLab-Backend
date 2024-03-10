import express from "express";
import { addtoCart, getCartByUserId } from "../controllers/cart-controller.js";

const router = express.Router();

router.get("/addtocart", addtoCart);
router.get("/getCart", getCartByUserId);

export default router;
