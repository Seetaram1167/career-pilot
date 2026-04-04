const express = require("express");
const router = express.Router();
const {
  getMentors,
  getMentor,
  rateMentor,
  createBooking,
  getMyBookings,
  rescheduleBooking,
  cancelBooking,
} = require("../controllers/mentorController");
const { protect } = require("../middleware/authMiddleware");

// Mentor fetching
router.get("/", getMentors);
router.get("/:id", getMentor);

// Rating mentors requires login
router.post("/:id/rate", protect, rateMentor);

// Bookings are on their own standalone endpoint but belong logically to marketplace features
router.post("/bookings", protect, createBooking);
router.get("/bookings/my", protect, getMyBookings);
router.patch("/bookings/:id/reschedule", protect, rescheduleBooking);
router.delete("/bookings/:id", protect, cancelBooking);

module.exports = router;
