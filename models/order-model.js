import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    dishes: [
      {
        dish: {
          type: mongoose.Types.ObjectId,
          ref: "Dish",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },

    address: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
      required: true,
    },
  },
  { timestamps: true }
);

const virtual = OrderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

OrderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
