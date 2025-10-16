import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { FaTools, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from '../../services/axios';

const Maintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/maintenance');
      console.log('🔧 Landlord Maintenance Response:', response.data);
      // Backend returns: { success, count, maintenanceRequests }
      setRequests(response.data.maintenanceRequests || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/maintenance/${id}/status`, { status });
      alert('Maintenance status updated successfully!');
      fetchRequests();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Failed to update:', error);
      alert(error.response?.data?.message || 'Failed to update maintenance status');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', icon: FaTools },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimesCircle },
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;
    return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${c.bg} ${c.text}`}><Icon className="text-xs" /> {status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const getPriorityBadge = (priority) => {
    const config = { high: 'bg-red-100 text-red-800', medium: 'bg-yellow-100 text-yellow-800', low: 'bg-green-100 text-green-800' };
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config[priority]}`}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>;
  };

  const columns = [
    { 
      key: 'property', 
      label: 'Property', 
      render: (r) => (
        <div>
          <p className="font-semibold text-accent-500">{r.property?.title}</p>
          <p className="text-sm text-gray-500">{r.property?.address?.city}</p>
        </div>
      )
    },
    { 
      key: 'title', 
      label: 'Issue', 
      render: (r) => (
        <div>
          <p className="font-semibold">{r.title}</p>
          <p className="text-sm text-gray-500 capitalize">{r.category}</p>
        </div>
      )
    },
    { key: 'tenant', label: 'Tenant', render: (r) => r.tenant?.name || 'N/A' },
    { key: 'priority', label: 'Priority', render: (r) => getPriorityBadge(r.priority) },
    { key: 'status', label: 'Status', render: (r) => getStatusBadge(r.status) },
    { key: 'createdAt', label: 'Reported', render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header - Consza Style */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
        <h1 className="text-3xl font-bold text-accent-500 mb-2">Maintenance Requests</h1>
        <p className="text-gray-600 text-lg">Manage maintenance requests from your properties</p>
      </div>

      {/* Stats Grid - Consza Theme */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Total Requests</p>
              <p className="text-3xl font-bold text-accent-500">{requests.length}</p>
            </div>
            <div className="w-14 h-14 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaTools className="text-2xl text-primary-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Pending</p>
              <p className="text-3xl font-bold text-accent-500">{requests.filter(r => r.status === 'pending').length}</p>
            </div>
            <div className="w-14 h-14 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaClock className="text-2xl text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">In Progress</p>
              <p className="text-3xl font-bold text-accent-500">{requests.filter(r => r.status === 'in-progress').length}</p>
            </div>
            <div className="w-14 h-14 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaTools className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Completed</p>
              <p className="text-3xl font-bold text-accent-500">{requests.filter(r => r.status === 'completed').length}</p>
            </div>
            <div className="w-14 h-14 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <DataTable
          columns={columns}
          data={requests}
          loading={loading}
          onView={(r) => { setSelectedRequest(r); setShowDetailModal(true); }}
          emptyMessage="No maintenance requests found"
        />
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Request Details" size="lg">
        {selectedRequest && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Property</p>
                <p className="font-semibold text-accent-500">{selectedRequest.property?.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Tenant</p>
                <p className="font-semibold">{selectedRequest.tenant?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Category</p>
                <p className="font-semibold capitalize">{selectedRequest.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Priority</p>
                {getPriorityBadge(selectedRequest.priority)}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Issue Title</p>
              <p className="font-semibold text-lg text-accent-500">{selectedRequest.title}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Description</p>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500">{selectedRequest.description}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Current Status</p>
              {getStatusBadge(selectedRequest.status)}
            </div>

            {selectedRequest.status !== 'completed' && selectedRequest.status !== 'cancelled' && (
              <div className="flex gap-3 pt-4 border-t">
                {selectedRequest.status === 'pending' && (
                  <button 
                    onClick={() => updateStatus(selectedRequest._id, 'in-progress')} 
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                  >
                    Mark In Progress
                  </button>
                )}
                {selectedRequest.status === 'in-progress' && (
                  <button 
                    onClick={() => updateStatus(selectedRequest._id, 'completed')} 
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                  >
                    Mark Completed
                  </button>
                )}
                <button 
                  onClick={() => updateStatus(selectedRequest._id, 'cancelled')} 
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                >
                  Cancel Request
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Maintenance;
