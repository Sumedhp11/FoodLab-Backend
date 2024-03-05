const jwt = require("jsonwebtoken");
exports.verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      req.user = decoded.id;

      return next();
    } catch (error) {
      console.error(error);

      return next(new ErrorHandler("failure", "Invalid token", 401));
    }
  }

  return res.status(400).json({
    status: "failure",
    code: 400,
    message: "Not authorized. No valid token provided.",
    data: null,
  });
};
