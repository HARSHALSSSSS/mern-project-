import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { FaUsers, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';

const TenantApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/applications/landlord');
      setApplications(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/api/applications/${id}/approve`);
      fetchApplications();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`/api/applications/${id}/reject`);
      fetchApplications();
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  const columns = [
    {
      key: 'tenant',
      label: 'Tenant',
      render: (a) => (
        <div>
          <p className="font-semibold">{a.tenant?.name}</p>
          <p className="text-sm text-gray-500">{a.tenant?.email}</p>
        </div>
      ),
    },
    { key: 'property', label: 'Property', render: (a) => a.property?.title },
    {
      key: 'status',
      label: 'Status',
      render: (a) => {
        const config = { pending: 'bg-yellow-100 text-yellow-800', approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' };
        return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config[a.status]}`}>{a.status}</span>;
      },
    },
    { key: 'date', label: 'Applied', render: (a) => new Date(a.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tenant Applications</h1>
        <p className="text-gray-600">Review and manage rental applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Total</p><p className="text-3xl font-bold">{applications.length}</p></div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center"><FaUsers className="text-2xl text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Pending</p><p className="text-3xl font-bold text-yellow-600">{applications.filter(a => a.status === 'pending').length}</p></div>
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center"><FaClock className="text-2xl text-yellow-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Approved</p><p className="text-3xl font-bold text-green-600">{applications.filter(a => a.status === 'approved').length}</p></div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center"><FaCheckCircle className="text-2xl text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Rejected</p><p className="text-3xl font-bold text-red-600">{applications.filter(a => a.status === 'rejected').length}</p></div>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center"><FaTimesCircle className="text-2xl text-red-600" /></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <DataTable
          columns={columns}
          data={applications}
          loading={loading}
          onView={(a) => { setSelectedApp(a); setShowDetailModal(true); }}
          customActions={(a) => a.status === 'pending' && (
            <>
              <button onClick={() => handleApprove(a._id)} className="text-green-600 hover:text-green-800 p-2 font-semibold">Approve</button>
              <button onClick={() => handleReject(a._id)} className="text-red-600 hover:text-red-800 p-2 font-semibold">Reject</button>
            </>
          )}
        />
      </div>

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Application Details" size="lg">
        {selectedApp && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-600">Tenant Name</p><p className="font-semibold">{selectedApp.tenant?.name}</p></div>
              <div><p className="text-sm text-gray-600">Email</p><p className="font-semibold">{selectedApp.tenant?.email}</p></div>
              <div><p className="text-sm text-gray-600">Property</p><p className="font-semibold">{selectedApp.property?.title}</p></div>
              <div><p className="text-sm text-gray-600">Move-in Date</p><p className="font-semibold">{selectedApp.moveInDate ? new Date(selectedApp.moveInDate).toLocaleDateString() : 'N/A'}</p></div>
            </div>
            {selectedApp.message && (
              <div><p className="text-sm text-gray-600 mb-2">Message</p><p className="bg-gray-50 p-4 rounded-lg">{selectedApp.message}</p></div>
            )}
            <div className="flex gap-3 pt-4 border-t">
              <button onClick={() => setShowDetailModal(false)} className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Close</button>
              {selectedApp.status === 'pending' && (
                <>
                  <button onClick={() => { handleApprove(selectedApp._id); setShowDetailModal(false); }} className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve</button>
                  <button onClick={() => { handleReject(selectedApp._id); setShowDetailModal(false); }} className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reject</button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TenantApplications;
