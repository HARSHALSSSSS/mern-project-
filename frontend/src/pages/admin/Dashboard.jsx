import { useEffect, useState } from 'react';
import StatsCard from '../../components/StatsCard';
import { FaUsers, FaHome, FaDollarSign, FaChartLine, FaUserShield, FaClipboardCheck, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, properties: 0, revenue: 0, applications: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data.stats || { users: 0, properties: 0, revenue: 0, applications: 0 });
      setRecentUsers(response.data.recentUsers || []);
      setRecentProperties(response.data.recentProperties || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
      // Set mock data
      setStats({ users: 0, properties: 0, revenue: 0, applications: 0 });
      setRecentUsers([]);
      setRecentProperties([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header - Consza Style */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-accent-500">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2 text-lg">System overview and analytics</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link
              to="/admin/users"
              className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-md font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
            >
              <FaUserShield className="mr-2" />
              Manage Users
            </Link>
            <Link
              to="/admin/properties"
              className="inline-flex items-center px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-md font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
            >
              <FaHome className="mr-2" />
              Properties
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid - Consza Theme */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Total Users" value={stats.users} icon={FaUsers} color="blue" />
        <StatsCard title="Total Properties" value={stats.properties} icon={FaHome} color="green" />
        <StatsCard title="Total Revenue" value={`$${stats.revenue?.toLocaleString()}`} icon={FaDollarSign} color="yellow" />
        <StatsCard title="Applications" value={stats.applications} icon={FaChartLine} color="purple" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link
          to="/admin/users"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
        >
          <FaUsers className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl font-bold mb-2">User Management</h3>
          <p className="text-blue-100 text-sm">
            Manage all platform users
          </p>
          <div className="mt-4 text-sm font-semibold">
            View All →
          </div>
        </Link>

        <Link
          to="/admin/properties"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
        >
          <FaHome className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl font-bold mb-2">Property Approval</h3>
          <p className="text-green-100 text-sm">
            Review and approve properties
          </p>
          <div className="mt-4 text-sm font-semibold">
            View All →
          </div>
        </Link>

        <Link
          to="/admin/payments"
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
        >
          <FaDollarSign className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl font-bold mb-2">Payment Monitoring</h3>
          <p className="text-yellow-100 text-sm">
            Track all transactions
          </p>
          <div className="mt-4 text-sm font-semibold">
            View All →
          </div>
        </Link>

        <Link
          to="/admin/analytics"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
        >
          <FaChartLine className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl font-bold mb-2">Analytics</h3>
          <p className="text-purple-100 text-sm">
            View platform analytics
          </p>
          <div className="mt-4 text-sm font-semibold">
            View All →
          </div>
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-primary-500">
          <h3 className="text-xl font-bold mb-4 text-accent-500">User Growth</h3>
          <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FaUsers className="text-gray-400 text-5xl mb-4" />
            <p className="text-gray-600 font-semibold mb-2">User Analytics</p>
            <p className="text-gray-500 text-sm">Last 6 months growth</p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">↑ 24%</p>
                <p className="text-xs text-gray-600">Growth</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-500">{stats.users}</p>
                <p className="text-xs text-gray-600">Total Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-500">156</p>
                <p className="text-xs text-gray-600">This Month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-primary-500">
          <h3 className="text-xl font-bold mb-4 text-accent-500">Revenue Trend</h3>
          <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FaDollarSign className="text-gray-400 text-5xl mb-4" />
            <p className="text-gray-600 font-semibold mb-2">Revenue Analytics</p>
            <p className="text-gray-500 text-sm">Platform earnings overview</p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">↑ 18%</p>
                <p className="text-xs text-gray-600">Increase</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-500">${(stats.revenue || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-600">Total Revenue</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-500">{stats.properties}</p>
                <p className="text-xs text-gray-600">Properties</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-accent-500">Recent Users</h2>
          <Link to="/admin/users" className="text-primary-500 hover:text-primary-600 font-semibold uppercase text-sm">
            View All →
          </Link>
        </div>
        
        {recentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers.slice(0, 5).map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-accent-500">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'landlord' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaUsers className="text-gray-400 text-5xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No users yet</p>
          </div>
        )}
      </div>

      {/* Recent Properties Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-accent-500">Recent Properties</h2>
          <Link to="/admin/properties" className="text-primary-500 hover:text-primary-600 font-semibold uppercase text-sm">
            View All →
          </Link>
        </div>
        
        {recentProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProperties.slice(0, 3).map((property) => (
              <div key={property._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    property.status === 'approved' ? 'bg-green-500 text-white' : 
                    property.status === 'pending' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {property.status}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-accent-500 mb-2">{property.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{property.address?.city}, {property.address?.state}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-500">${property.rent}/mo</span>
                    <Link to={`/admin/properties/${property._id}`} className="text-primary-500 hover:text-primary-600 font-semibold text-sm">
                      Review →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaHome className="text-gray-400 text-5xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No properties yet</p>
          </div>
        )}
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
        <h2 className="text-xl font-bold text-accent-500 mb-4 flex items-center gap-2">
          <FaExclamationTriangle className="text-yellow-500" />
          System Alerts
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
            <FaClipboardCheck className="text-yellow-600 text-xl mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Pending Approvals</p>
              <p className="text-sm text-gray-600">{stats.applications} property applications awaiting review</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <FaUsers className="text-blue-600 text-xl mt-1" />
            <div>
              <p className="font-semibold text-gray-800">New Users</p>
              <p className="text-sm text-gray-600">{stats.users} users registered this month</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <FaDollarSign className="text-green-600 text-xl mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Revenue Update</p>
              <p className="text-sm text-gray-600">Total platform revenue: ${(stats.revenue || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
