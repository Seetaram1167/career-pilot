const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  updateUserProfile,
  resetPassword,
  verifyRegistration 
} = require("../controllers/authController");
const { sendOTP, verifyOTP } = require("../controllers/otpController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/verify-registration", verifyRegistration);
router.post("/login", loginUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
