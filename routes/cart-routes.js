const express = require("express");
const { addtoCart } = require("../controllers/cart-controller");
const router = express.Router();

router.get("/addtocart", addtoCart);

exports.router = router;
