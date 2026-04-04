const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple users without phones, but unique if provided
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    results: {
      type: Object, // Store the career assessment results as a JSON object
      default: {},
    },
    interests: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
    },
    education: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    resetCode: {
      type: String,
      default: null,
    },
    resetCodeExpire: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student",
    },
    purchases: {
      type: [Object],
      default: [],
    },
    achievements: {
      type: [Object],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
