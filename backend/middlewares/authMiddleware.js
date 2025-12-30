require("dotenv").config();
const jwt = require('jsonwebtoken');
const response = require("../utils/responseHandler");

exports.authMiddleware = async (req, res, next) => { 
  try {
    // Get token from cookie, body, or Authorization header
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.auth_token ||
      req.body?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return response(res, 401, "Token missing");
    }

    // Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    console.log("Decoded token is:", decode);

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return response(res, 401, "Invalid or expired token");
  }
};
