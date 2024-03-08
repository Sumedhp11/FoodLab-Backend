const { Cart } = require("../models/cart-model");

const addtoCart = async (req, res) => {
  const { userId, quantity, dishId } = req.query;

  try {
    if (parseInt(quantity) === 0) {
      await Cart.findOneAndDelete({
        user: userId,
        dish: dishId,
      });

      res.status(200).json({
        message: "Cart item removed successfully",
      });
      return;
    }

    const existingCartItem = await Cart.findOne({
      user: userId,
      dish: dishId,
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
        dish: dishId,
      });

      await newCart.save();

      res.status(201).json({
        message: "Cart item added successfully",
        cart: newCart,
      });
    }
  } catch (error) {
    console.error("Error updating/removing item from cart:", error);
    res.status(400).json({ error: "Failed to update/remove item from cart" });
  }
};

const getCartByUserId = async (req, res) => {
  const { userId } = req.query;
  try {
    const CartItems = await Cart.find({ user: userId }).populate({
      path: "dish",
    });
    let totalPrice = 0;
    CartItems.forEach((item) => {
      console.log(item);
      totalPrice += (item.dish.mrp / 100) * item.quantity;
    });
    console.log(totalPrice);
    return res.status(200).json({
      status: 200,
      message: "Cart Fetched Sucessfully",
      data: {
        cartitems: CartItems,
        totalPrice: totalPrice,
      },
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
