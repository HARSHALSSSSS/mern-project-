import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { FaDollarSign, FaClock, FaCheckCircle, FaTimesCircle, FaDownload, FaCreditCard } from 'react-icons/fa';
import axios from '../../services/axios';

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/payments');
      setPayments(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      paid: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock },
      overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimesCircle },
      failed: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimesCircle },
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;
    return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${c.bg} ${c.text}`}><Icon className="text-xs" /> {status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const processPayment = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);
    try {
      await axios.post(`/api/payments/${selectedPayment._id}/pay`, { method: 'stripe' });
      setShowPaymentModal(false);
      fetchPayments();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const downloadReceipt = async (paymentId) => {
    try {
      const response = await axios.get(`/api/payments/${paymentId}/receipt`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download:', error);
    }
  };

  const columns = [
    {
      key: 'month',
      label: 'Payment For',
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-semibold">{p.type === 'rent' ? 'Monthly Rent' : p.type}</p>
          <p className="text-sm text-gray-500">{new Date(p.dueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
      ),
    },
    { key: 'amount', label: 'Amount', sortable: true, render: (p) => <span className="font-semibold text-lg">${p.amount?.toLocaleString()}</span> },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (p) => (
        <div>
          <p>{new Date(p.dueDate).toLocaleDateString()}</p>
          {p.status === 'overdue' && <p className="text-xs text-red-600 font-semibold mt-1">{Math.floor((new Date() - new Date(p.dueDate)) / 86400000)} days overdue</p>}
        </div>
      ),
    },
    { key: 'status', label: 'Status', sortable: true, render: (p) => getStatusBadge(p.status) },
    { key: 'paidDate', label: 'Paid Date', sortable: false, render: (p) => p.paidDate ? new Date(p.paidDate).toLocaleDateString() : '-' },
  ];

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header - Consza Style */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
        <h1 className="text-3xl font-bold text-accent-500 mb-2">My Payments</h1>
        <p className="text-gray-600 text-lg">Track and manage your rental payments</p>
      </div>

      {/* Stats Grid - Consza Theme */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Total Paid</p>
              <p className="text-3xl font-bold text-accent-500">${totalPaid.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Pending</p>
              <p className="text-3xl font-bold text-accent-500">${totalPending.toLocaleString()}</p>
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
              <p className="text-3xl font-bold text-accent-500">{payments.filter(p => p.status === 'overdue').length}</p>
            </div>
            <div className="w-14 h-14 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaTimesCircle className="text-2xl text-red-600" />
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
              <FaDollarSign className="text-2xl text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <DataTable
          columns={columns}
          data={payments}
          loading={loading}
          emptyMessage="No payments found"
          customActions={(p) => (
            <>
              {p.status === 'paid' && <button onClick={() => downloadReceipt(p._id)} className="text-blue-600 hover:text-blue-800 p-2" title="Download"><FaDownload /></button>}
              {(p.status === 'pending' || p.status === 'overdue') && <button onClick={() => { setSelectedPayment(p); setShowPaymentModal(true); }} className="text-primary-600 hover:text-primary-800 p-2" title="Pay"><FaCreditCard /></button>}
            </>
          )}
        />
      </div>

      {/* Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Make Payment" size="md">
        {selectedPayment && (
          <form onSubmit={processPayment}>
            <div className="space-y-6">
              <div className="bg-primary-50 p-4 rounded-lg border-l-4 border-primary-500">
                <h3 className="font-semibold text-lg mb-2 text-accent-500">Payment Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Amount:</span><span className="font-bold text-xl text-primary-500">${selectedPayment.amount?.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Due Date:</span><span className="font-semibold">{new Date(selectedPayment.dueDate).toLocaleDateString()}</span></div>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all duration-300">Cancel</button>
                <button type="submit" disabled={paymentProcessing} className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:hover:translate-y-0">{paymentProcessing ? 'Processing...' : 'Pay Now'}</button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default MyPayments;
