const Mentor = require("../models/Mentor");
const Booking = require("../models/Booking");
const Session = require("../models/Session");

// @desc    Get all mentors (with optional filter)
// @route   GET /api/mentors
// @access  Public
const getMentors = async (req, res) => {
  const { filter } = req.query;

  let query = {};
  if (filter && filter !== "all") {
    query.type = filter;
  }

  const mentors = await Mentor.find(query);
  res.status(200).json(mentors);
};

// @desc    Get a single mentor
// @route   GET /api/mentors/:id
// @access  Public
const getMentor = async (req, res) => {
  const mentor = await Mentor.findById(req.params.id);

  if (!mentor) {
    res.status(404);
    throw new Error("Mentor not found");
  }

  res.status(200).json(mentor);
};

// @desc    Rate a mentor
// @route   POST /api/mentors/:id/rate
// @access  Private
const rateMentor = async (req, res) => {
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Please provide a rating between 1 and 5");
  }

  const mentor = await Mentor.findById(req.params.id);

  if (!mentor) {
    res.status(404);
    throw new Error("Mentor not found");
  }

  // Update total reviews and average rating
  const previousTotalRating = mentor.avgRating * mentor.totalReviews;
  mentor.totalReviews += 1;
  mentor.avgRating = (previousTotalRating + Number(rating)) / mentor.totalReviews;

  await mentor.save();

  res.status(200).json({ message: "Mentor rated successfully", mentor });
};

// @desc    Get user's bookings
// @route   GET /api/mentors/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ studentId: req.user.id }).populate({
    path: "sessionId",
    populate: {
      path: "mentorId",
    },
  });

  res.status(200).json(bookings);
};

// @desc    Create a booking
// @route   POST /api/mentors/bookings
// @access  Private
const createBooking = async (req, res) => {
  const { mentorId, sessionType, schedule, topic } = req.body;

  if (!mentorId || !sessionType || !schedule || !topic) {
    res.status(400);
    throw new Error("Please provide mentor ID, session type, schedule, and topic");
  }

  const mentor = await Mentor.findById(mentorId);
  if (!mentor) {
    res.status(404);
    throw new Error("Mentor not found");
  }

  // 1. Create a session for this specific schedule
  const session = await Session.create({
    mentorId,
    type: sessionType,
    schedule: new Date(schedule),
    locationLink:
      sessionType === "live"
        ? "https://zoom.us/mock-link"
        : "Mentor Center Address",
    price: 2500, // Mock price
  });

  // 2. Create the actual booking linked to the user and session
  const booking = await Booking.create({
    studentId: req.user.id,
    sessionId: session._id,
    amountPaid: session.price,
    paymentStatus: "completed", // Mocking complete payment
    topic,
  });

  res.status(201).json({
    message: "Booking successful",
    booking,
    session,
    mentorDetails: mentor,
  });
};

// @desc    Reschedule a booking
// @route   PATCH /api/mentors/bookings/:id/reschedule
// @access  Private
const rescheduleBooking = async (req, res) => {
  const { schedule } = req.body;

  if (!schedule) {
    res.status(400);
    throw new Error("Please provide a new schedule");
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Check ownership
  if (booking.studentId.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized to reschedule this booking");
  }

  const session = await Session.findById(booking.sessionId);

  if (!session) {
    res.status(404);
    throw new Error("Associated session not found");
  }

  // Update session schedule
  session.schedule = new Date(schedule);
  await session.save();

  res.status(200).json({
    message: "Booking rescheduled successfully",
    booking,
    session,
  });
};

// @desc    Cancel a booking
// @route   DELETE /api/mentors/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Check ownership
  if (booking.studentId.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized to cancel this booking");
  }

  // Also delete associated session
  if (booking.sessionId) {
    await Session.findByIdAndDelete(booking.sessionId);
  }

  await Booking.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Booking cancelled successfully" });
};

module.exports = {
  getMentors,
  getMentor,
  rateMentor,
  createBooking,
  getMyBookings,
  rescheduleBooking,
  cancelBooking,
};
