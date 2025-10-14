const Notification = require('../models/Notification');

/**
 * Create and send notification
 * @param {Object} io - Socket.io instance
 * @param {String} userId - User ID to send notification to
 * @param {Object} notificationData - Notification data
 */
const sendNotification = async (io, userId, notificationData) => {
  try {
    // Create notification in database
    const notification = await Notification.create({
      user: userId,
      ...notificationData
    });

    // Send real-time notification via Socket.io
    if (io) {
      io.to(userId.toString()).emit('notification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        createdAt: notification.createdAt
      });
    }

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

/**
 * Send bulk notifications
 * @param {Object} io - Socket.io instance
 * @param {Array} userIds - Array of user IDs
 * @param {Object} notificationData - Notification data
 */
const sendBulkNotifications = async (io, userIds, notificationData) => {
  try {
    const notifications = await Promise.all(
      userIds.map(userId => sendNotification(io, userId, notificationData))
    );

    return notifications;
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    throw error;
  }
};

module.exports = {
  sendNotification,
  sendBulkNotifications
};
