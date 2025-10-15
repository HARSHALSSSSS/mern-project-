import { useEffect, useState } from 'react';
import { FaFileContract, FaDownload, FaCheckCircle, FaClock, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import Modal from '../../components/Modal';
import axios from '../../services/axios';

const MyContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showRenewModal, setShowRenewModal] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/contracts');
      setContracts(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (contractId) => {
    try {
      const response = await axios.get(`/api/contracts/${contractId}/document`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contract-${contractId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download:', error);
    }
  };

  const handleRenew = async () => {
    try {
      await axios.patch(`/api/contracts/${selectedContract._id}/renew`);
      setShowRenewModal(false);
      fetchContracts();
    } catch (error) {
      console.error('Failed to renew:', error);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock },
      expired: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimesCircle },
      terminated: { bg: 'bg-gray-100', text: 'text-gray-800', icon: FaTimesCircle },
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;
    return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${c.bg} ${c.text}`}><Icon className="text-xs" /> {status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header - Consza Style */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
        <h1 className="text-3xl font-bold text-accent-500 mb-2">My Contracts</h1>
        <p className="text-gray-600 text-lg">View and manage your rental contracts</p>
      </div>

      {/* Stats Grid - Consza Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Total Contracts</p>
              <p className="text-3xl font-bold text-accent-500">{contracts.length}</p>
            </div>
            <div className="w-14 h-14 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaFileContract className="text-2xl text-primary-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Active</p>
              <p className="text-3xl font-bold text-accent-500">{contracts.filter(c => c.status === 'active').length}</p>
            </div>
            <div className="w-14 h-14 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Expired</p>
              <p className="text-3xl font-bold text-accent-500">{contracts.filter(c => c.status === 'expired').length}</p>
            </div>
            <div className="w-14 h-14 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaTimesCircle className="text-2xl text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {contracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contracts.map((contract) => (
            <div key={contract._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-r from-accent-500 to-accent-600 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{contract.property?.title}</h3>
                  {getStatusBadge(contract.status)}
                </div>
                <p className="text-gray-200 text-sm mt-1">{contract.property?.address?.city}, {contract.property?.address?.state}</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Start Date</p>
                    <p className="font-semibold text-accent-500">{new Date(contract.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">End Date</p>
                    <p className="font-semibold text-accent-500">{new Date(contract.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Monthly Rent</p>
                    <p className="font-semibold text-lg text-primary-500">${contract.monthlyRent?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Security Deposit</p>
                    <p className="font-semibold text-accent-500">${contract.securityDeposit?.toLocaleString()}</p>
                  </div>
                </div>

                {contract.terms && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Terms</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border-l-4 border-primary-500">{contract.terms}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <button onClick={() => downloadDocument(contract._id)} className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                    <FaDownload className="inline mr-2" /> Download
                  </button>
                  {contract.status === 'active' && new Date(contract.endDate) - new Date() < 90 * 24 * 60 * 60 * 1000 && (
                    <button onClick={() => { setSelectedContract(contract); setShowRenewModal(true); }} className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                      <FaCalendarAlt className="inline mr-2" /> Renew
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-lg">
          <FaFileContract className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-accent-500 mb-2">No Contracts Found</h3>
          <p className="text-gray-600">You don't have any contracts yet.</p>
        </div>
      )}

      <Modal isOpen={showRenewModal} onClose={() => setShowRenewModal(false)} title="Renew Contract" size="md">
        {selectedContract && (
          <div className="py-4">
            <p className="text-gray-700 mb-4">Would you like to renew your contract for <strong className="text-accent-500">{selectedContract.property?.title}</strong>?</p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Current contract expires on:</p>
              <p className="font-bold text-lg">{new Date(selectedContract.endDate).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRenewModal(false)} className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleRenew} className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Confirm Renewal</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyContracts;
