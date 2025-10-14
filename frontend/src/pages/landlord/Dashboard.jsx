import { useEffect, useState } from 'react';
import StatsCard from '../../components/StatsCard';
import DataTable from '../../components/DataTable';
import { FaHome, FaUsers, FaDollarSign, FaTools, FaChartLine } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ properties: 0, tenants: 0, revenue: 0, requests: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/landlord/dashboard');
      setStats(response.data.stats || {});
      setRecentApplications(response.data.recentApplications || []);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'tenant', label: 'Tenant', render: (a) => a.tenant?.name || 'N/A' },
    { key: 'property', label: 'Property', render: (a) => a.property?.title },
    { key: 'status', label: 'Status', render: (a) => <span className={`px-3 py-1 rounded-full text-sm ${a.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : a.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{a.status}</span> },
    { key: 'date', label: 'Applied', render: (a) => new Date(a.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Landlord Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your property overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Properties" value={stats.properties} icon={FaHome} color="blue" />
        <StatsCard title="Active Tenants" value={stats.tenants} icon={FaUsers} color="green" />
        <StatsCard title="Monthly Revenue" value={`$${stats.revenue?.toLocaleString()}`} icon={FaDollarSign} color="yellow" />
        <StatsCard title="Pending Requests" value={stats.requests} icon={FaTools} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaChartLine className="text-blue-600" /> Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart will be displayed here</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/landlord/properties/add" className="block p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition">
              <FaHome className="inline mr-2" /> Add New Property
            </a>
            <a href="/landlord/applications" className="block p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition">
              <FaUsers className="inline mr-2" /> Review Applications
            </a>
            <a href="/landlord/rent" className="block p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition">
              <FaDollarSign className="inline mr-2" /> Manage Rent
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Recent Applications</h3>
        <DataTable columns={columns} data={recentApplications} loading={loading} emptyMessage="No recent applications" />
      </div>
    </div>
  );
};

export default Dashboard;
