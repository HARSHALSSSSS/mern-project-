import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/StatsCard';
import DataTable from '../../components/DataTable';
import { FaHome, FaUsers, FaDollarSign, FaTools, FaChartLine, FaPlus, FaCheckCircle, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import axios from '../../services/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ properties: 0, tenants: 0, revenue: 0, requests: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/dashboard/landlord');
      setStats(response.data.stats || { properties: 0, tenants: 0, revenue: 0, requests: 0 });
      setRecentApplications(response.data.recentApplications || []);
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      // Set mock data for display
      setStats({ properties: 0, tenants: 0, revenue: 0, requests: 0 });
      setRecentApplications([]);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'tenant', label: 'Tenant', render: (a) => a.tenant?.name || 'N/A' },
    { key: 'property', label: 'Property', render: (a) => a.property?.title || 'N/A' },
    { key: 'status', label: 'Status', render: (a) => (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
        a.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
        a.status === 'approved' ? 'bg-green-100 text-green-800' : 
        'bg-red-100 text-red-800'
      }`}>
        {a.status}
      </span>
    )},
    { key: 'date', label: 'Applied', render: (a) => new Date(a.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header - Improved Responsiveness */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8 border-l-4 border-primary-500 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Landlord Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Welcome back! Here's your property overview
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/landlord/properties/add"
                className="inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
              >
                <FaPlus className="mr-2 text-sm" />
                Add Property
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid - Improved Mobile Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <StatsCard title="Total Properties" value={stats.properties} icon={FaHome} color="blue" />
          <StatsCard title="Active Tenants" value={stats.tenants} icon={FaUsers} color="green" />
          <StatsCard title="Monthly Revenue" value={`$${stats.revenue?.toLocaleString() || 0}`} icon={FaDollarSign} color="yellow" />
          <StatsCard title="Pending Requests" value={stats.requests} icon={FaTools} color="red" />
        </div>

        {/* Quick Actions & Revenue Chart - Better Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-b-4 border-primary-500">
            <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              <FaChartLine className="text-primary-500 text-xl sm:text-2xl" /> 
              <span>Revenue Trend</span>
            </h3>
            <div className="h-56 sm:h-64 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <FaChartLine className="text-gray-400 text-4xl sm:text-5xl mb-3 sm:mb-4" />
              <p className="text-gray-700 font-semibold mb-1 text-sm sm:text-base">Revenue Analytics</p>
              <p className="text-gray-500 text-xs sm:text-sm px-4 text-center">Last 6 months performance</p>
              <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4 text-center px-4 w-full max-w-md">
                <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                  <p className="text-lg sm:text-2xl font-bold text-green-600">↑ 12%</p>
                  <p className="text-xs text-gray-600">This Month</p>
                </div>
                <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                  <p className="text-lg sm:text-2xl font-bold text-primary-500">${(stats.revenue || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">{stats.properties}</p>
                  <p className="text-xs text-gray-600">Properties</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Improved Spacing */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-b-4 border-primary-500">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Quick Actions</h3>
            <div className="space-y-2 sm:space-y-3">
              <Link 
                to="/landlord/properties/add" 
                className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md group"
              >
                <FaHome className="mr-3 text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" /> 
                <span className="font-semibold text-xs sm:text-sm tracking-wide">Add New Property</span>
              </Link>
              <Link 
                to="/landlord/applications" 
                className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md group"
              >
                <FaUsers className="mr-3 text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" /> 
                <span className="font-semibold text-xs sm:text-sm tracking-wide">Review Applications</span>
              </Link>
              <Link 
                to="/landlord/rent" 
                className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md group"
              >
                <FaDollarSign className="mr-3 text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" /> 
                <span className="font-semibold text-xs sm:text-sm tracking-wide">Manage Rent</span>
              </Link>
              <Link 
                to="/landlord/maintenance" 
                className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md group"
              >
                <FaTools className="mr-3 text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" /> 
                <span className="font-semibold text-xs sm:text-sm tracking-wide">Maintenance Requests</span>
              </Link>
            </div>
          </div>
        </div>

        {/* My Properties Section - Enhanced Responsive Grid */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Properties</h2>
            <Link to="/landlord/properties" className="text-primary-500 hover:text-primary-600 font-semibold text-sm inline-flex items-center">
              View All <span className="ml-1">→</span>
            </Link>
          </div>
          
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {properties.slice(0, 3).map((property) => (
                <div key={property._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <div className="h-40 sm:h-48 bg-gray-200 relative">
                    <img 
                      src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-bold uppercase shadow-lg ${
                      property.status === 'available' ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 sm:mb-2 line-clamp-1">{property.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 flex items-center">
                      <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{property.address?.city}, {property.address?.state}</span>
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl font-bold text-primary-500">${property.rent?.amount || property.rent}/mo</span>
                      <Link to={`/landlord/properties/${property._id}`} className="text-primary-500 hover:text-primary-600 font-semibold text-xs sm:text-sm">
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
              <FaHome className="text-gray-400 text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 text-base sm:text-lg mb-3 sm:mb-4">No properties yet</p>
              <Link to="/landlord/properties/add" className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-300">
                Add Your First Property
              </Link>
            </div>
          )}
        </div>

        {/* Recent Applications Table - Mobile Optimized */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Applications</h2>
            <Link to="/landlord/applications" className="text-primary-500 hover:text-primary-600 font-semibold text-sm inline-flex items-center">
              View All <span className="ml-1">→</span>
            </Link>
          </div>
          
          {recentApplications.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <DataTable columns={columns} data={recentApplications} loading={loading} emptyMessage="No recent applications" />
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
              <FaUsers className="text-gray-400 text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 text-base sm:text-lg">No applications yet</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2 px-4">Applications will appear here when tenants apply for your properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
