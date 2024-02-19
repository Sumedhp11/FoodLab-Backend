const jwt = require("jsonwebtoken");
exports.verifyToken = async (req, res, next) => {
  let token;

  // Check if the request has the 'Authorization' header and it starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Attach the decoded information to the request object
      req.user = decoded.id;

      // Continue to the next middleware or route handler
      return next();
    } catch (error) {
      console.error(error);

      // If there is an error during token verification, pass it to the error handling middleware
      return next(new ErrorHandler("failure", "Invalid token", 401));
    }
  }

  // If there is no 'Authorization' header or it doesn't start with 'Bearer', return a 400 response
  return res.status(400).json({
    status: "failure",
    code: 400,
    message: "Not authorized. No valid token provided.",
    data: null,
  });
};
