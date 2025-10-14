import axios from './axios';

// Get dashboard data
const getDashboardData = async (role) => {
  const response = await axios.get(`/dashboard/${role}`);
  return response.data;
};

const dashboardService = {
  getDashboardData,
};

export default dashboardService;
