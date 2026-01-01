const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// GET /api/notifications - Get all notifications for the logged-in provider
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ provider: req.user.id })
      .populate('listing', 'title')
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 notifications

    const unreadCount = await Notification.countDocuments({ 
      provider: req.user.id, 
      read: false 
    });

    res.json({ 
      notifications, 
      unreadCount 
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PUT /api/notifications/:id/read - Mark a notification as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, provider: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ success: true, notification });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { provider: req.user.id, read: false },
      { read: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error marking all as read:', err);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

module.exports = router;

