const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    dish: {
      type: mongoose.Types.ObjectId,
      ref: "Dish",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const virtual = CartSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

CartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Cart = mongoose.model("Cart", CartSchema);
