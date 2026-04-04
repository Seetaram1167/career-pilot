const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment, getPublicKey } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.get("/key", getPublicKey);
router.post("/order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;
