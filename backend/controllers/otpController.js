const OTP = require("../models/Otp");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

// @desc    Send OTP to Email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please provide an email address" });
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "No user found with this email. Please ensure your email is linked to your account."
    });
  }

  // Generate 6-digit OTP
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  // Save/Update OTP in database
  await OTP.findOneAndUpdate(
    { email },
    { email, otp, createdAt: new Date() },
    { upsert: true, new: true }
  );

  // Dev Mode Check
  if (process.env.DEV_OTP_MODE === "true") {
    console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
    return res.status(200).json({ message: `Dev Mode: OTP is ${otp} (Logged to console)` });
  }

  // Send via Email
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER?.trim(),
      pass: process.env.EMAIL_PASS?.trim(),
    },
  });

  const mailOptions = {
    from: `"CareerPilot" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2979ff;">Verification Code</h2>
        <p>Your 6-digit verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2979ff; margin: 20px 0;">${otp}</div>
        <p>This code expires in 5 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("FULL EMAIL ERROR:", error);
    return res.status(500).json({
      message: `Email failed: ${error.message}`
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check for local OTP record
  const otpRecord = await OTP.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid or expired verification code" });
  }

  res.status(200).json({ message: "OTP verified correctly" });
};

module.exports = {
  sendOTP,
  verifyOTP,
};
