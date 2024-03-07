const mongoose = require("mongoose");
const { User } = require("./user-model");

const CartSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    dishes: {
      type: mongoose.Types.ObjectId,
      ref: "dish",
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
virtual.get(function (doc) {
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
