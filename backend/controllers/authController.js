const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email: rawEmail, phone, password, role } = req.body;
  const email = rawEmail ? rawEmail.toLowerCase().trim() : "";

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists by email
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  // Check if user exists by phone (only if phone is provided)
  if (phone) {
    const rawDigits = phone.replace(/\D/g, "");
    let formattedPhone = "";
    if (rawDigits.length === 10) {
      formattedPhone = `+91${rawDigits}`;
    } else if (rawDigits.length === 12 && rawDigits.startsWith("91")) {
      formattedPhone = `+${rawDigits}`;
    } else {
      formattedPhone = phone.startsWith("+") ? phone.replace(/\s/g, "") : `+${rawDigits}`;
    }
    
    // Hyper-resilient search to prevent duplicates
    const phoneExists = await User.findOne({ 
      $or: [
        { phone: phone },
        { phone: formattedPhone },
        { phone: rawDigits },
        { phone: phone.trim().replace(/\s/g, "") }
      ]
    });

    if (phoneExists) {
      res.status(400);
      throw new Error("User with this phone number already exists");
    }
    // Update phone to formatted version for storage
    req.body.phone = formattedPhone;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user (initially unverified)
  const user = await User.create({
    name,
    email,
    phone: req.body.phone,
    password: hashedPassword,
    isVerified: false,
    role: role || "student",
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      message: "Registration successful. Please verify your email.",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    // If role is provided, verify it matches
    if (role && user.role !== role) {
      return res.status(401).json({ message: "Invalid role selected for this user" });
    }
    // Check if verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        message: "Account not verified", 
        unverified: true,
        email: user.email 
      });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      results: user.results,
      interests: user.interests,
      bio: user.bio,
      profilePic: user.profilePic,
      dob: user.dob,
      education: user.education,
      experience: user.experience,
      role: user.role,
      purchases: user.purchases,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      results: user.results,
      interests: user.interests,
      bio: user.bio,
      profilePic: user.profilePic,
      dob: user.dob,
      education: user.education,
      experience: user.experience,
      role: user.role,
      purchases: user.purchases,
      achievements: user.achievements, // Ensure achievements are included
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.interests = req.body.interests || user.interests;
    user.bio = req.body.bio || user.bio;
    user.profilePic = req.body.profilePic || user.profilePic;
    user.dob = req.body.dob || user.dob;
    user.education = req.body.education || user.education;
    user.experience = req.body.experience || user.experience;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      results: updatedUser.results,
      interests: updatedUser.interests,
      bio: updatedUser.bio,
      profilePic: updatedUser.profilePic,
      dob: updatedUser.dob,
      education: updatedUser.education,
      experience: updatedUser.experience,
      role: updatedUser.role,
      purchases: updatedUser.purchases,
      achievements: updatedUser.achievements,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Reset password using OTP from OTP collection
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email: rawEmail, phone, otp, newPassword } = req.body;
  const email = rawEmail ? rawEmail.toLowerCase().trim() : "";

  if (!otp || !newPassword || (!email && !phone)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // 1. Verify OTP in local database
  const OTP = require("../models/OTP");
  
  // Find local OTP record
  const otpRecord = await OTP.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid or expired verification code" });
  }

  // 2. Find user
  const user = await User.findOne({ email });
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 3. Hash new password and save
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  
  // Clear old reset fields and mark as verified
  user.resetCode = null;
  user.resetCodeExpire = null;
  user.isVerified = true; 
  
  await user.save();

  // 4. Delete OTP record after successful use
  await OTP.deleteOne({ _id: otpRecord._id });

  res.status(200).json({ message: "Password reset successful" });
};

// @desc    Verify Registration OTP
// @route   POST /api/auth/verify-registration
// @access  Public
const verifyRegistration = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Missing email or OTP" });
  }

  const OTP = require("../models/OTP");
  const otpRecord = await OTP.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid or expired verification code" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isVerified = true;
  await user.save();

  // Delete OTP after success
  await OTP.deleteOne({ _id: otpRecord._id });

  res.status(200).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: true,
    purchases: user.purchases,
    token: generateToken(user._id),
    message: "Email verified successfully!"
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  resetPassword,
  verifyRegistration,
};
