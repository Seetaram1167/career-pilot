const express = require("express");
const router = express.Router();
const { getNotifications, markRead, markAllRead } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // all notification routes require login

router.get("/", getNotifications);
router.put("/read-all", markAllRead);
router.put("/:id/read", markRead);

module.exports = router;
