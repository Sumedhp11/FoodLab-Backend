import mongoose from "mongoose";

import { Schema } from "mongoose";

const AddressSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  flatno: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  streetName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
});
const virtual = AddressSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

AddressSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
const Address = mongoose.model("Address", AddressSchema);
export default Address;
