const Notification = require("../models/Notification");

// @desc  Get all notifications for the logged-in user
// @route GET /api/notifications
// @access Private
const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(30);
  res.json(notifications);
};

// @desc  Mark one notification as read
// @route PUT /api/notifications/:id/read
// @access Private
const markRead = async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  res.json(notification);
};

// @desc  Mark all notifications as read
// @route PUT /api/notifications/read-all
// @access Private
const markAllRead = async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
  res.json({ message: "All marked as read" });
};

// Helper: called internally by other controllers to create a notification
const createNotification = async (userId, type, title, message, link = "") => {
  try {
    await Notification.create({ userId, type, title, message, link });
  } catch (e) {
    console.error("Failed to create notification:", e.message);
  }
};

module.exports = { getNotifications, markRead, markAllRead, createNotification };
