const crypto = require("crypto");

const otpGenerate = () => {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit secure OTP
};

module.exports = otpGenerate;
