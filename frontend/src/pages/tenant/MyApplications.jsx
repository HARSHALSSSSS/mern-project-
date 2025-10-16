import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { FaEye, FaTimes, FaClock, FaCheckCircle, FaTimesCircle, FaHome } from 'react-icons/fa';
import axios from '../../services/axios';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/applications');
      console.log('📋 My Applications Response:', response.data);
      // Backend returns: { success, count, applications }
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimesCircle },
      withdrawn: { bg: 'bg-gray-100', text: 'text-gray-800', icon: FaTimes },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        <Icon className="text-xs" /> {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleWithdraw = async () => {
    try {
      await axios.put(`/applications/${selectedApplication._id}/withdraw`);
      setShowWithdrawModal(false);
      alert('Application withdrawn successfully!');
      fetchApplications();
    } catch (error) {
      console.error('Failed to withdraw:', error);
      alert(error.response?.data?.message || 'Failed to withdraw application');
    }
  };

  const columns = [
    {
      key: 'property',
      label: 'Property',
      sortable: true,
      render: (value, app) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden">
            <img src={app?.property?.images?.[0]?.url || '/placeholder.jpg'} alt={app?.property?.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <Link to={`/properties/${app?.property?._id}`} className="font-semibold text-blue-600 hover:underline">{app?.property?.title || 'N/A'}</Link>
            <p className="text-sm text-gray-500">{app?.property?.address?.city || 'N/A'}, {app?.property?.address?.state || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    { key: 'status', label: 'Status', sortable: true, render: (value, app) => getStatusBadge(app?.status) },
    { key: 'appliedDate', label: 'Applied Date', sortable: true, render: (value, app) => app?.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A' },
    { key: 'moveInDate', label: 'Move-in Date', sortable: true, render: (value, app) => app?.moveInDate ? new Date(app.moveInDate).toLocaleDateString() : 'Not specified' },
    { key: 'rent', label: 'Monthly Rent', sortable: true, render: (value, app) => `$${app?.property?.rent?.amount?.toLocaleString() || 0}` },
  ];

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header - Consza Style */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
        <h1 className="text-3xl font-bold text-accent-500 mb-2">My Applications</h1>
        <p className="text-gray-600 text-lg">Track and manage your rental applications</p>
      </div>

      {/* Stats Grid - Consza Theme */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Total Applications</p>
              <p className="text-3xl font-bold text-accent-500">{applications.length}</p>
            </div>
            <div className="w-14 h-14 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaHome className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Pending</p>
              <p className="text-3xl font-bold text-accent-500">{applications.filter(a => a.status === 'pending').length}</p>
            </div>
            <div className="w-14 h-14 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaClock className="text-2xl text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Approved</p>
              <p className="text-3xl font-bold text-accent-500">{applications.filter(a => a.status === 'approved').length}</p>
            </div>
            <div className="w-14 h-14 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Rejected</p>
              <p className="text-3xl font-bold text-accent-500">{applications.filter(a => a.status === 'rejected').length}</p>
            </div>
            <div className="w-14 h-14 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaTimesCircle className="text-2xl text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <DataTable
          columns={columns}
          data={applications}
          loading={loading}
          onView={(app) => { setSelectedApplication(app); setShowDetailModal(true); }}
          emptyMessage="No applications found. Start browsing properties to apply!"
        />
      </div>

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Application Details" size="lg">
        {selectedApplication && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-3">Property Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-600">Property</p><p className="font-semibold">{selectedApplication.property?.title}</p></div>
                <div><p className="text-sm text-gray-600">Monthly Rent</p><p className="font-semibold">${selectedApplication.property?.rent?.amount?.toLocaleString()}</p></div>
                <div><p className="text-sm text-gray-600">Location</p><p className="font-semibold">{selectedApplication.property?.address?.city}, {selectedApplication.property?.address?.state}</p></div>
                <div><p className="text-sm text-gray-600">Type</p><p className="font-semibold capitalize">{selectedApplication.property?.type}</p></div>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <button onClick={() => setShowDetailModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all duration-300">Close</button>
              {selectedApplication.status === 'pending' && (
                <button onClick={() => { setShowDetailModal(false); setShowWithdrawModal(true); }} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg">Withdraw</button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} title="Withdraw Application" size="md">
        <div className="py-4">
          <p className="text-gray-700 mb-6">Are you sure you want to withdraw this application?</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowWithdrawModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all duration-300">Cancel</button>
            <button onClick={handleWithdraw} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg">Yes, Withdraw</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyApplications;
