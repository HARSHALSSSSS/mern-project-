import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaHome, FaDollarSign, FaWrench, FaFileAlt, 
  FaCheckCircle, FaClock, FaExclamationTriangle 
} from 'react-icons/fa';
import StatsCard from '../../components/StatsCard';
import dashboardService from '../../services/dashboardService';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardData('tenant');
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const activeRentals = dashboardData?.activeRentals || [];
  const upcomingPayments = dashboardData?.upcomingPayments || [];
  const maintenanceRequests = dashboardData?.maintenanceRequests || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Tenant'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your rentals today
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/properties"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300"
          >
            <FaHome className="mr-2" />
            Browse Properties
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Rentals"
          value={stats.activeRentals || 0}
          icon={FaHome}
          color="blue"
        />
        <StatsCard
          title="Pending Applications"
          value={stats.pendingApplications || 0}
          icon={FaFileAlt}
          color="yellow"
        />
        <StatsCard
          title="Upcoming Payments"
          value={`$${stats.upcomingPayments || 0}`}
          icon={FaDollarSign}
          color="green"
        />
        <StatsCard
          title="Open Requests"
          value={stats.maintenanceRequests || 0}
          icon={FaWrench}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/tenant/applications"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <FaFileAlt className="text-4xl mb-3" />
          <h3 className="text-xl font-bold mb-2">My Applications</h3>
          <p className="text-blue-100 text-sm">
            Track your property applications
          </p>
        </Link>

        <Link
          to="/tenant/payments"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <FaDollarSign className="text-4xl mb-3" />
          <h3 className="text-xl font-bold mb-2">Payment History</h3>
          <p className="text-green-100 text-sm">
            View and manage your payments
          </p>
        </Link>

        <Link
          to="/tenant/maintenance"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <FaWrench className="text-4xl mb-3" />
          <h3 className="text-xl font-bold mb-2">Request Maintenance</h3>
          <p className="text-purple-100 text-sm">
            Submit and track repair requests
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
