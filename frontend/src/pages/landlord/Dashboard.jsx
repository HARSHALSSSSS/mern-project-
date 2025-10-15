import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/StatsCard';
import DataTable from '../../components/DataTable';
import { FaHome, FaUsers, FaDollarSign, FaTools, FaChartLine, FaPlus, FaCheckCircle, FaClock } from 'react-icons/fa';
import axios from 'axios';

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
      const response = await axios.get('/api/landlord/dashboard');
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
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header - Consza Style */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-accent-500">Landlord Dashboard</h1>
            <p className="text-gray-600 mt-2 text-lg">Welcome back! Here's your property overview</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/landlord/properties/add"
              className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-md font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
            >
              <FaPlus className="mr-2" />
              Add Property
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid - Consza Theme */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Total Properties" value={stats.properties} icon={FaHome} color="blue" />
        <StatsCard title="Active Tenants" value={stats.tenants} icon={FaUsers} color="green" />
        <StatsCard title="Monthly Revenue" value={`$${stats.revenue?.toLocaleString()}`} icon={FaDollarSign} color="yellow" />
        <StatsCard title="Pending Requests" value={stats.requests} icon={FaTools} color="red" />
      </div>

      {/* Quick Actions & Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-primary-500">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-accent-500">
            <FaChartLine className="text-primary-500" /> Revenue Trend
          </h3>
          <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FaChartLine className="text-gray-400 text-5xl mb-4" />
            <p className="text-gray-600 font-semibold mb-2">Revenue Analytics</p>
            <p className="text-gray-500 text-sm">Last 6 months performance</p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">↑ 12%</p>
                <p className="text-xs text-gray-600">This Month</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-500">${(stats.revenue || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-500">{stats.properties}</p>
                <p className="text-xs text-gray-600">Properties</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-primary-500">
          <h3 className="text-xl font-bold mb-4 text-accent-500">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              to="/landlord/properties/add" 
              className="block p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg group"
            >
              <FaHome className="inline mr-3 text-xl group-hover:scale-110 transition-transform duration-300" /> 
              <span className="font-semibold uppercase text-sm tracking-wide">Add New Property</span>
            </Link>
            <Link 
              to="/landlord/applications" 
              className="block p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg group"
            >
              <FaUsers className="inline mr-3 text-xl group-hover:scale-110 transition-transform duration-300" /> 
              <span className="font-semibold uppercase text-sm tracking-wide">Review Applications</span>
            </Link>
            <Link 
              to="/landlord/rent" 
              className="block p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg group"
            >
              <FaDollarSign className="inline mr-3 text-xl group-hover:scale-110 transition-transform duration-300" /> 
              <span className="font-semibold uppercase text-sm tracking-wide">Manage Rent</span>
            </Link>
            <Link 
              to="/landlord/maintenance" 
              className="block p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg group"
            >
              <FaTools className="inline mr-3 text-xl group-hover:scale-110 transition-transform duration-300" /> 
              <span className="font-semibold uppercase text-sm tracking-wide">Maintenance Requests</span>
            </Link>
          </div>
        </div>
      </div>

      {/* My Properties Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-accent-500">My Properties</h2>
          <Link to="/landlord/properties" className="text-primary-500 hover:text-primary-600 font-semibold uppercase text-sm">
            View All →
          </Link>
        </div>
        
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 3).map((property) => (
              <div key={property._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    property.status === 'available' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {property.status}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-accent-500 mb-2">{property.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{property.address?.city}, {property.address?.state}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-500">${property.rent}/mo</span>
                    <Link to={`/landlord/properties/${property._id}`} className="text-primary-500 hover:text-primary-600 font-semibold text-sm">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaHome className="text-gray-400 text-5xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No properties yet</p>
            <Link to="/landlord/properties/add" className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md font-semibold uppercase text-sm transition-all duration-300">
              Add Your First Property
            </Link>
          </div>
        )}
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-accent-500">Recent Applications</h2>
          <Link to="/landlord/applications" className="text-primary-500 hover:text-primary-600 font-semibold uppercase text-sm">
            View All →
          </Link>
        </div>
        
        {recentApplications.length > 0 ? (
          <DataTable columns={columns} data={recentApplications} loading={loading} emptyMessage="No recent applications" />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaUsers className="text-gray-400 text-5xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No applications yet</p>
            <p className="text-gray-500 text-sm mt-2">Applications will appear here when tenants apply for your properties</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
