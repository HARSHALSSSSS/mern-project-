import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaHome, FaDollarSign, FaWrench, FaFileAlt, 
  FaCheckCircle, FaClock, FaExclamationTriangle,
  FaBed, FaBath, FaMapMarkerAlt, FaCalendar
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
        // Set default empty data
        setDashboardData({
          stats: { activeRentals: 0, pendingApplications: 0, upcomingPayments: 0, maintenanceRequests: 0 },
          activeRentals: [],
          upcomingPayments: [],
          maintenanceRequests: [],
          recentApplications: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const activeRentals = dashboardData?.activeRentals || [];
  const upcomingPayments = dashboardData?.upcomingPayments || [];
  const maintenanceRequests = dashboardData?.maintenanceRequests || [];
  const recentApplications = dashboardData?.recentApplications || [];

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header - Consza Style */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-accent-500">
              Welcome back, {user?.name || 'Tenant'}! 👋
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Here's what's happening with your rentals today
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/properties"
              className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-md font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
            >
              <FaHome className="mr-2" />
              Browse Properties
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid - Consza Theme */}
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

      {/* Quick Actions - Consza Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/tenant/applications"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
        >
          <FaFileAlt className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl font-bold mb-2">My Applications</h3>
          <p className="text-blue-100 text-sm">
            Track your property applications
          </p>
          <div className="mt-4 text-sm font-semibold">
            View All →
          </div>
        </Link>

        <Link
          to="/tenant/payments"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
        >
          <FaDollarSign className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl font-bold mb-2">Payment History</h3>
          <p className="text-green-100 text-sm">
            View and manage your payments
          </p>
          <div className="mt-4 text-sm font-semibold">
            View All →
          </div>
        </Link>

        <Link
          to="/tenant/maintenance"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
        >
          <FaWrench className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl font-bold mb-2">Request Maintenance</h3>
          <p className="text-purple-100 text-sm">
            Submit and track repair requests
          </p>
          <div className="mt-4 text-sm font-semibold">
            View All →
          </div>
        </Link>
      </div>

      {/* Active Rentals Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-accent-500">My Active Rentals</h2>
          <Link to="/tenant/contracts" className="text-primary-500 hover:text-primary-600 font-semibold uppercase text-sm">
            View All →
          </Link>
        </div>
        
        {activeRentals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeRentals.slice(0, 2).map((rental) => (
              <div key={rental._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-accent-500">{rental.property?.title}</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold uppercase">Active</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary-500" />
                    <span>{rental.property?.address?.street}, {rental.property?.address?.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaDollarSign className="text-green-600" />
                    <span className="font-semibold">${rental.rent}/month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-blue-600" />
                    <span>Lease until: {rental.endDate ? new Date(rental.endDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaHome className="text-gray-400 text-5xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No active rentals</p>
            <Link to="/properties" className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md font-semibold uppercase text-sm transition-all duration-300">
              Browse Properties
            </Link>
          </div>
        )}
      </div>

      {/* Recent Applications Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-accent-500">Recent Applications</h2>
          <Link to="/tenant/applications" className="text-primary-500 hover:text-primary-600 font-semibold uppercase text-sm">
            View All →
          </Link>
        </div>
        
        {recentApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Applied On</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentApplications.slice(0, 5).map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-accent-500">{app.property?.title}</div>
                      <div className="text-sm text-gray-600">{app.property?.address?.city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/tenant/applications/${app._id}`} className="text-primary-500 hover:text-primary-600 font-semibold text-sm">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaFileAlt className="text-gray-400 text-5xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No applications yet</p>
          </div>
        )}
      </div>

      {/* Upcoming Payments & Maintenance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Payments */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-accent-500">Upcoming Payments</h2>
            <Link to="/tenant/payments" className="text-primary-500 hover:text-primary-600 font-semibold text-sm">
              View All →
            </Link>
          </div>
          
          {upcomingPayments.length > 0 ? (
            <div className="space-y-4">
              {upcomingPayments.slice(0, 3).map((payment) => (
                <div key={payment._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                  <div>
                    <p className="font-semibold text-accent-500">{payment.property?.title}</p>
                    <p className="text-sm text-gray-600">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${payment.amount}</p>
                    <button className="text-primary-500 hover:text-primary-600 text-sm font-semibold">Pay Now</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FaDollarSign className="text-gray-400 text-4xl mx-auto mb-3" />
              <p className="text-gray-600">No upcoming payments</p>
            </div>
          )}
        </div>

        {/* Maintenance Requests */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-accent-500">Maintenance Requests</h2>
            <Link to="/tenant/maintenance" className="text-primary-500 hover:text-primary-600 font-semibold text-sm">
              View All →
            </Link>
          </div>
          
          {maintenanceRequests.length > 0 ? (
            <div className="space-y-4">
              {maintenanceRequests.slice(0, 3).map((request) => (
                <div key={request._id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                  <div className="flex-1">
                    <p className="font-semibold text-accent-500">{request.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      <FaCalendar className="inline mr-1" />
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FaWrench className="text-gray-400 text-4xl mx-auto mb-3" />
              <p className="text-gray-600 mb-3">No maintenance requests</p>
              <Link to="/tenant/maintenance" className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-semibold text-sm uppercase transition-all duration-300">
                Create Request
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
