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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header - Improved Responsiveness */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8 border-l-4 border-primary-500 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || 'Tenant'}! 👋
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Here's what's happening with your rentals today
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/properties"
                className="inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
              >
                <FaHome className="mr-2 text-sm" />
                Browse Properties
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid - Improved Mobile Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
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

        {/* Quick Actions - Better Mobile Stacking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <Link
            to="/tenant/applications"
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <FaFileAlt className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">My Applications</h3>
            <p className="text-blue-100 text-xs sm:text-sm mb-2 sm:mb-4">
              Track your property applications
            </p>
            <div className="text-xs sm:text-sm font-semibold">
              View All →
            </div>
          </Link>

          <Link
            to="/tenant/payments"
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <FaDollarSign className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Payment History</h3>
            <p className="text-green-100 text-xs sm:text-sm mb-2 sm:mb-4">
              View and manage your payments
            </p>
            <div className="text-xs sm:text-sm font-semibold">
              View All →
            </div>
          </Link>

          <Link
            to="/tenant/maintenance"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group sm:col-span-2 lg:col-span-1"
          >
            <FaWrench className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Request Maintenance</h3>
            <p className="text-purple-100 text-xs sm:text-sm mb-2 sm:mb-4">
              Submit and track repair requests
            </p>
            <div className="text-xs sm:text-sm font-semibold">
              View All →
            </div>
          </Link>
        </div>

        {/* Active Rentals Section - Enhanced Cards */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Active Rentals</h2>
            <Link to="/tenant/contracts" className="text-primary-500 hover:text-primary-600 font-semibold text-sm inline-flex items-center">
              View All <span className="ml-1">→</span>
            </Link>
          </div>
          
          {activeRentals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {activeRentals.slice(0, 2).map((rental) => (
                <div key={rental._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all duration-300 bg-white">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 flex-1">{rental.property?.title}</h3>
                    <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-bold uppercase inline-flex items-center self-start">
                      <FaCheckCircle className="mr-1" /> Active
                    </span>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-start sm:items-center gap-2">
                      <FaMapMarkerAlt className="text-primary-500 mt-0.5 sm:mt-0 flex-shrink-0" />
                      <span className="line-clamp-2">{rental.property?.address?.street}, {rental.property?.address?.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-green-600 flex-shrink-0" />
                      <span className="font-semibold">${rental.rent}/month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-blue-600 flex-shrink-0" />
                      <span>Lease until: {rental.endDate ? new Date(rental.endDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
              <FaHome className="text-gray-400 text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 text-base sm:text-lg mb-3 sm:mb-4">No active rentals</p>
              <Link to="/properties" className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-300">
                Browse Properties
              </Link>
            </div>
          )}
        </div>

        {/* Recent Applications Section - Mobile Optimized Table */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Applications</h2>
            <Link to="/tenant/applications" className="text-primary-500 hover:text-primary-600 font-semibold text-sm inline-flex items-center">
              View All <span className="ml-1">→</span>
            </Link>
          </div>
          
          {recentApplications.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Property</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Applied On</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentApplications.slice(0, 5).map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div className="font-semibold text-gray-900 text-sm">{app.property?.title}</div>
                          <div className="text-xs text-gray-600">{app.property?.address?.city}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap ${
                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            app.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell whitespace-nowrap">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <Link to={`/tenant/applications/${app._id}`} className="text-primary-500 hover:text-primary-600 font-semibold text-xs sm:text-sm whitespace-nowrap">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
              <FaFileAlt className="text-gray-400 text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 text-base sm:text-lg">No applications yet</p>
            </div>
          )}
        </div>

        {/* Upcoming Payments & Maintenance Section - Better Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Upcoming Payments */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Upcoming Payments</h2>
              <Link to="/tenant/payments" className="text-primary-500 hover:text-primary-600 font-semibold text-sm inline-flex items-center">
                View All <span className="ml-1">→</span>
              </Link>
            </div>
            
            {upcomingPayments.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {upcomingPayments.slice(0, 3).map((payment) => (
                  <div key={payment._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{payment.property?.title}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                      <p className="text-base sm:text-lg font-bold text-green-600">${payment.amount}</p>
                      <button className="text-primary-500 hover:text-primary-600 text-xs sm:text-sm font-semibold px-3 py-1 border border-primary-500 rounded hover:bg-primary-50 transition">Pay Now</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
                <FaDollarSign className="text-gray-400 text-3xl sm:text-4xl mx-auto mb-2 sm:mb-3" />
                <p className="text-gray-600 text-sm sm:text-base">No upcoming payments</p>
              </div>
            )}
          </div>

          {/* Maintenance Requests */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Maintenance Requests</h2>
              <Link to="/tenant/maintenance" className="text-primary-500 hover:text-primary-600 font-semibold text-sm inline-flex items-center">
                View All <span className="ml-1">→</span>
              </Link>
            </div>
            
            {maintenanceRequests.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {maintenanceRequests.slice(0, 3).map((request) => (
                  <div key={request._id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{request.title}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{request.description}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <FaCalendar className="mr-1 flex-shrink-0" />
                        <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold uppercase self-start whitespace-nowrap ${
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
              <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
                <FaWrench className="text-gray-400 text-3xl sm:text-4xl mx-auto mb-2 sm:mb-3" />
                <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">No maintenance requests</p>
                <Link to="/tenant/maintenance" className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300">
                  Create Request
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
