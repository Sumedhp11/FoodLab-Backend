import Address from "../models/address-model.js";
import User from "../models/user-model.js";

export const addNewAddress = async (req, res) => {
  const { userId, flatno, landmark, streetName, city, state, pincode } =
    req.body;

  try {
    const newAddress = await Address.create({
      user: userId,
      flatno,
      landmark,
      streetName,
      city,
      state,
      pincode,
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: newAddress._id } },
      { new: true }
    );

    console.log(updatedUser);

    // Return success response
    res.status(201).json({ success: true, data: newAddress });
  } catch (error) {
    console.error("Error adding new address:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to add new address" });
  }
};
