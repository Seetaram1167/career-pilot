const express = require("express");
const router = express.Router();
const { evaluateCareer } = require("../controllers/careerController");
const { protect } = require("../middleware/authMiddleware");

// Protect the evaluate route since we need to save to a specific user's profile
router.post("/evaluate", protect, evaluateCareer);

module.exports = router;
