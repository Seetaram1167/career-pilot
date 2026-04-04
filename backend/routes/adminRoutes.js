const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const Mentor = require("../models/Mentor");

// @desc    Get all mentors (Admin)
// @route   GET /api/admin/mentors
router.get("/mentors", protect, admin, async (req, res) => {
  try {
    const mentors = await Mentor.find({});
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a mentor
// @route   POST /api/admin/mentors
router.post("/mentors", protect, admin, async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    const createdMentor = await mentor.save();
    res.status(201).json(createdMentor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a mentor
// @route   PUT /api/admin/mentors/:id
router.put("/mentors/:id", protect, admin, async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (mentor) {
      Object.assign(mentor, req.body);
      const updatedMentor = await mentor.save();
      res.json(updatedMentor);
    } else {
      res.status(404).json({ message: "Mentor not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a mentor
// @route   DELETE /api/admin/mentors/:id
router.delete("/mentors/:id", protect, admin, async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (mentor) {
      await mentor.deleteOne();
      res.json({ message: "Mentor removed" });
    } else {
      res.status(404).json({ message: "Mentor not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const User = require("../models/User");
const Booking = require("../models/Booking");
const Session = require("../models/Session");

// ... existing mentor routes ...

// @desc    Get all transactions
// @route   GET /api/admin/transactions
router.get("/transactions", protect, admin, async (req, res) => {
  try {
    const transactions = await Booking.find({})
      .populate("studentId", "name email")
      .populate({
        path: "sessionId",
        populate: { path: "mentorId", select: "name specialization" }
      })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all students with stats
// @route   GET /api/admin/students
router.get("/students", protect, admin, async (req, res) => {
  try {
    // Fetch everyone who is not an admin, ensuring those with no role are also visible
    const students = await User.find({ role: { $ne: "admin" } }).select("-password");
    
    // Aggregate stats for each student
    const studentData = await Promise.all(students.map(async (student) => {
      const bookings = await Booking.find({ studentId: student._id })
        .populate({
          path: "sessionId",
          populate: { path: "mentorId", select: "name specialization company" }
        });
      
      return {
        ...student.toObject(),
        totalBooked: bookings.length,
        completedBooked: bookings.filter(b => b.paymentStatus === "completed").length,
        bookings: bookings.map(b => ({
          id: b._id,
          topic: b.topic,
          amount: b.amountPaid,
          status: b.paymentStatus,
          mentor: b.sessionId?.mentorId || null,
          date: b.createdAt
        }))
      };
    }));

    res.json(studentData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all admins
// @route   GET /api/admin/admins
router.get("/admins", protect, admin, async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
