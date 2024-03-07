const { Cart } = require("../models/cart-model");

const addtoCart = async (req, res) => {
  const { userId, quantity, dishId } = req.query;

  try {
    const newCart = new Cart({
      user: userId,
      quantity: quantity,
      dishes: dishId,
    });

    await newCart.save();

    res.status(201).json({
      message: "Cart item added successfully",
      cart: newCart,
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(400).json({ error: "Failed to add item to cart" });
  }
};
module.exports = {
  addtoCart,
};
