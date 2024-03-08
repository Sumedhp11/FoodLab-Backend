const { generateToken } = require("../helper/generateToken");
const { User } = require("../models/user-model");
const bcrypt = require("bcrypt");
exports.createUser = async (req, res) => {
  const { password, name, email, phone } = req.body;
  const hashPwd = await bcrypt.hash(password, 10);

  const data = {
    password: hashPwd,
    name: name,
    email: email,
    phone: phone,
  };
  const checkExistEmail = await User.findOne({ email });
  if (checkExistEmail) {
    return res.status(400).json({
      message: "User Already Found",
    });
  }

  try {
    const user = await User.create(data);
    res.status(201).json({ message: "Successfully user Created", data: user });
  } catch (error) {
    return res.status(400).json(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email & Password is required",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        status: "failure",
        code: 404,
        message: "No User found",
        data: [],
      });
    }
    const comPwd = await bcrypt.compare(password, user.password);
    if (!comPwd) {
      return res.status(404).json({
        status: "failure",
        code: 404,
        message: "Pwd doesnt match",
      });
    }
    const token = generateToken(user._id);
    const selectedData = [];
    const data = {
      token: token,
      ...user.toObject(),
    };
    selectedData.push(data);
    const cleanedData = selectedData.map(({ password, ...rest }) => rest);
    res.status(200).json({
      message: "User Found",
      data: cleanedData,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.query;
  try {
    const user = User.findOne({ _id: userId });

    return res.status(200).json({
      message: "User Fetched Sucessfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
