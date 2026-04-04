const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    company: {
      type: String,
    },
    image: {
      type: String,
      default: "https://i.pravatar.cc/150",
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
    type: {
      type: String,
      enum: ["live", "offline", "hybrid"],
      default: "live",
    },
    location: {
      type: String, // E.g., Physical Center address
    },
    isTopRated: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 2500,
    },
    discount: {
      type: Number,
      default: 0, // Percentage
    },
    phone: {
      type: String,
      default: "+91 99999 99999", // Mock data
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Mentor", mentorSchema);
