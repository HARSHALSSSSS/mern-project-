import axios from './axios';

// Get notifications
const getNotifications = async (isRead) => {
  const query = isRead !== undefined ? `?isRead=${isRead}` : '';
  const response = await axios.get(`/notifications${query}`);
  return response.data;
};

// Mark as read
const markAsRead = async (id) => {
  const response = await axios.put(`/notifications/${id}/read`);
  return response.data;
};

// Mark all as read
const markAllAsRead = async () => {
  const response = await axios.put('/notifications/read-all');
  return response.data;
};

// Delete notification
const deleteNotification = async (id) => {
  const response = await axios.delete(`/notifications/${id}`);
  return response.data;
};

const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};

export default notificationService;
