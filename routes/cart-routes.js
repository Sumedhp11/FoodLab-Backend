const express = require("express");
const {
  addtoCart,
  getCartByUserId,
} = require("../controllers/cart-controller");
const router = express.Router();

router.get("/addtocart", addtoCart);
router.get("/getCart", getCartByUserId);

exports.router = router;
