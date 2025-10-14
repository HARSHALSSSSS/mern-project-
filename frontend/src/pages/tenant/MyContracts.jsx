import { useEffect, useState } from 'react';
import { FaFileContract, FaDownload, FaCheckCircle, FaClock, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import Modal from '../../components/Modal';
import axios from 'axios';

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
      const response = await axios.get('/api/contracts/tenant/my-contracts');
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Contracts</h1>
        <p className="text-gray-600">View and manage your rental contracts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Total Contracts</p><p className="text-3xl font-bold text-gray-900">{contracts.length}</p></div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center"><FaFileContract className="text-2xl text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Active</p><p className="text-3xl font-bold text-green-600">{contracts.filter(c => c.status === 'active').length}</p></div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center"><FaCheckCircle className="text-2xl text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Expired</p><p className="text-3xl font-bold text-red-600">{contracts.filter(c => c.status === 'expired').length}</p></div>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center"><FaTimesCircle className="text-2xl text-red-600" /></div>
          </div>
        </div>
      </div>

      {contracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contracts.map((contract) => (
            <div key={contract._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{contract.property?.title}</h3>
                  {getStatusBadge(contract.status)}
                </div>
                <p className="text-blue-100 text-sm mt-1">{contract.property?.address?.city}, {contract.property?.address?.state}</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Start Date</p>
                    <p className="font-semibold">{new Date(contract.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">End Date</p>
                    <p className="font-semibold">{new Date(contract.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                    <p className="font-semibold text-lg text-blue-600">${contract.monthlyRent?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Security Deposit</p>
                    <p className="font-semibold">${contract.securityDeposit?.toLocaleString()}</p>
                  </div>
                </div>

                {contract.terms && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Terms</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{contract.terms}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <button onClick={() => downloadDocument(contract._id)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <FaDownload className="inline mr-2" /> Download
                  </button>
                  {contract.status === 'active' && new Date(contract.endDate) - new Date() < 90 * 24 * 60 * 60 * 1000 && (
                    <button onClick={() => { setSelectedContract(contract); setShowRenewModal(true); }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      <FaCalendarAlt className="inline mr-2" /> Renew
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <FaFileContract className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Contracts Found</h3>
          <p className="text-gray-600">You don't have any contracts yet.</p>
        </div>
      )}

      <Modal isOpen={showRenewModal} onClose={() => setShowRenewModal(false)} title="Renew Contract" size="md">
        {selectedContract && (
          <div className="py-4">
            <p className="text-gray-700 mb-4">Would you like to renew your contract for <strong>{selectedContract.property?.title}</strong>?</p>
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
