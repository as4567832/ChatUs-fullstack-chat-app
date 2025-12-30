const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign(
    { userId },                // payload
    process.env.JWT_SECRET,    // secret
    { expiresIn: "1y" }        // options
  );
};

module.exports = generateToken;
