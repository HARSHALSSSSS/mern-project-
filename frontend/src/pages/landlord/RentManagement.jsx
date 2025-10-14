import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import { FaDollarSign, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const RentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payments/landlord');
      setPayments(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'tenant', label: 'Tenant', render: (p) => p.tenant?.name || 'N/A' },
    { key: 'property', label: 'Property', render: (p) => p.property?.title },
    { key: 'amount', label: 'Amount', render: (p) => `$${p.amount?.toLocaleString()}` },
    { key: 'dueDate', label: 'Due Date', render: (p) => new Date(p.dueDate).toLocaleDateString() },
    {
      key: 'status',
      label: 'Status',
      render: (p) => {
        const config = {
          paid: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle },
          pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock },
          overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: FaExclamationTriangle },
        };
        const c = config[p.status] || config.pending;
        const Icon = c.icon;
        return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${c.bg} ${c.text}`}><Icon className="text-xs" /> {p.status}</span>;
      },
    },
    { key: 'paidDate', label: 'Paid Date', render: (p) => p.paidDate ? new Date(p.paidDate).toLocaleDateString() : '-' },
  ];

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rent Management</h1>
        <p className="text-gray-600">Track rental payments from your tenants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Total Revenue</p><p className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p></div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center"><FaDollarSign className="text-2xl text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Pending</p><p className="text-3xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</p></div>
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center"><FaClock className="text-2xl text-yellow-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Overdue</p><p className="text-3xl font-bold text-red-600">${overdueAmount.toLocaleString()}</p></div>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center"><FaExclamationTriangle className="text-2xl text-red-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Total Payments</p><p className="text-3xl font-bold text-blue-600">{payments.length}</p></div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center"><FaCheckCircle className="text-2xl text-blue-600" /></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Revenue Overview</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Revenue chart will be displayed here</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Payment History</h3>
        <DataTable columns={columns} data={payments} loading={loading} emptyMessage="No payments found" />
      </div>
    </div>
  );
};

export default RentManagement;
