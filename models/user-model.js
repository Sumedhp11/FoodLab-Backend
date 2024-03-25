import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  orderHistory: [{ type: Schema.Types.ObjectId, ref: "OrderHistory" }],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const virtual = UserSchema.virtual("id");

virtual.get(function () {
  return this._id;
});

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
