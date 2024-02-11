const { User } = require("../models/user-model");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const doc = await user.save();
    res.status(201).json({ message: "Succesfully user Created", data: doc });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      res.status(401).json({ message: "No User found" });
    } else if (user.password === req.body.password) {
      res.status(200).json({
        message: "User Found",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          addresses: user.addresses,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
