import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import { FaDollarSign, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import axios from '../../services/axios';

const RentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/payments');
      console.log('💰 Landlord Payments Response:', response.data);
      // Backend returns: { success, count, payments }
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'tenant', label: 'Tenant', render: (value, payment) => payment?.tenant?.name || 'N/A' },
    { key: 'property', label: 'Property', render: (value, payment) => payment?.property?.title || 'N/A' },
    { key: 'amount', label: 'Amount', render: (value, payment) => `$${payment?.amount?.toLocaleString() || 0}` },
    { key: 'dueDate', label: 'Due Date', render: (value, payment) => payment?.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A' },
    {
      key: 'status',
      label: 'Status',
      render: (value, payment) => {
        const config = {
          paid: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle },
          pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock },
          overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: FaExclamationTriangle },
        };
        const c = config[payment?.status] || config.pending;
        const Icon = c.icon;
        return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${c.bg} ${c.text}`}><Icon className="text-xs" /> {payment?.status || 'pending'}</span>;
      },
    },
    { key: 'paidDate', label: 'Paid Date', render: (p) => p.paidDate ? new Date(p.paidDate).toLocaleDateString() : '-' },
  ];

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header - Consza Style */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
        <h1 className="text-3xl font-bold text-accent-500 mb-2">Rent Management</h1>
        <p className="text-gray-600 text-lg">Track rental payments from your tenants</p>
      </div>

      {/* Stats Grid - Consza Theme */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Total Revenue</p>
              <p className="text-3xl font-bold text-accent-500">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaDollarSign className="text-2xl text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Pending</p>
              <p className="text-3xl font-bold text-accent-500">${pendingAmount.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaClock className="text-2xl text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Overdue</p>
              <p className="text-3xl font-bold text-accent-500">${overdueAmount.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-2xl text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Total Payments</p>
              <p className="text-3xl font-bold text-accent-500">{payments.length}</p>
            </div>
            <div className="w-14 h-14 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-accent-500">Revenue Overview</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <FaDollarSign className="text-5xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold">Revenue chart will be displayed here</p>
            <p className="text-sm text-gray-500 mt-2">Monthly earnings visualization</p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-accent-500">Payment History</h3>
        <DataTable columns={columns} data={payments} loading={loading} emptyMessage="No payments found" />
      </div>
    </div>
  );
};

export default RentManagement;
