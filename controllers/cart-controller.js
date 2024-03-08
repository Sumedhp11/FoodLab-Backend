const { Cart } = require("../models/cart-model");

const addtoCart = async (req, res) => {
  const { userId, quantity, dishId } = req.query;

  try {
    const existingCartItem = await Cart.findOne({
      user: userId,
      dishes: dishId,
    });

    if (existingCartItem) {
      existingCartItem.quantity = parseInt(quantity);
      await existingCartItem.save();

      res.status(200).json({
        message: "Cart item quantity updated successfully",
        cart: existingCartItem,
      });
    } else {
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
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(400).json({ error: "Failed to add item to cart" });
  }
};

const getCartByUserId = async (req, res) => {
  const { userId } = req.query;
  try {
    const CartItems = await Cart.find({ user: userId });
    return res.status(200).json({
      status: 200,
      message: "Cart Fetched Sucessfully",
      data: CartItems,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Failed to Fetch Cart",
    });
  }
};
module.exports = {
  addtoCart,
  getCartByUserId,
};
