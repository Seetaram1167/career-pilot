const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    type: {
      type: String,
      enum: ["live", "offline"],
      required: true,
    },
    schedule: {
      type: Date,
      required: true,
    },
    locationLink: {
      type: String, // Zoom link or Physical Address
      required: true,
    },
    availableSeats: {
      type: Number,
      default: 1, // 1 for 1-on-1, more for group sessions
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Session", sessionSchema);
