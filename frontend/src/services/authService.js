import axios from './axios';

// Register user
const register = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post('/auth/login', userData);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
const getMe = async () => {
  const response = await axios.get('/auth/me');
  return response.data;
};

// Forgot password
const forgotPassword = async (email) => {
  const response = await axios.post('/auth/forgot-password', { email });
  return response.data;
};

// Reset password
const resetPassword = async (token, password) => {
  const response = await axios.put(`/auth/reset-password/${token}`, { password });
  return response.data;
};

// Update password
const updatePassword = async (passwords) => {
  const response = await axios.put('/auth/update-password', passwords);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
};

export default authService;
