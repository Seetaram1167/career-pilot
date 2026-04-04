const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 minutes (TTL index)
  },
});

module.exports = mongoose.model("OTP", OTPSchema);
