import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { FaHome, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';

const PropertyApproval = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('/api/admin/properties/pending');
      setProperties(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/api/admin/properties/${id}/approve`);
      fetchProperties();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`/api/admin/properties/${id}/reject`);
      fetchProperties();
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  const columns = [
    {
      key: 'property',
      label: 'Property',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.images?.[0]?.url || '/placeholder.jpg'} alt={p.title} className="w-16 h-16 rounded-lg object-cover" />
          <div>
            <p className="font-semibold">{p.title}</p>
            <p className="text-sm text-gray-500 capitalize">{p.type}</p>
          </div>
        </div>
      ),
    },
    { key: 'landlord', label: 'Landlord', render: (p) => p.landlord?.name || 'N/A' },
    { key: 'rent', label: 'Rent', render: (p) => `$${p.rent?.amount?.toLocaleString()}/mo` },
    { key: 'location', label: 'Location', render: (p) => `${p.address?.city}, ${p.address?.state}` },
    { key: 'submitted', label: 'Submitted', render: (p) => new Date(p.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Approval</h1>
        <p className="text-gray-600">Review and approve property listings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Pending</p><p className="text-3xl font-bold text-yellow-600">{properties.length}</p></div>
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center"><FaClock className="text-2xl text-yellow-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Approved Today</p><p className="text-3xl font-bold text-green-600">0</p></div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center"><FaCheckCircle className="text-2xl text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Rejected Today</p><p className="text-3xl font-bold text-red-600">0</p></div>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center"><FaTimesCircle className="text-2xl text-red-600" /></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <DataTable
          columns={columns}
          data={properties}
          loading={loading}
          onView={(p) => { setSelectedProperty(p); setShowModal(true); }}
          customActions={(p) => (
            <>
              <button onClick={() => handleApprove(p._id)} className="text-green-600 hover:text-green-800 p-2 font-semibold">Approve</button>
              <button onClick={() => handleReject(p._id)} className="text-red-600 hover:text-red-800 p-2 font-semibold">Reject</button>
            </>
          )}
          emptyMessage="No pending properties"
        />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Property Details" size="lg">
        {selectedProperty && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-600">Title</p><p className="font-semibold">{selectedProperty.title}</p></div>
              <div><p className="text-sm text-gray-600">Type</p><p className="font-semibold capitalize">{selectedProperty.type}</p></div>
              <div><p className="text-sm text-gray-600">Landlord</p><p className="font-semibold">{selectedProperty.landlord?.name}</p></div>
              <div><p className="text-sm text-gray-600">Rent</p><p className="font-semibold">${selectedProperty.rent?.amount?.toLocaleString()}/mo</p></div>
              <div><p className="text-sm text-gray-600">Bedrooms</p><p className="font-semibold">{selectedProperty.bedrooms}</p></div>
              <div><p className="text-sm text-gray-600">Bathrooms</p><p className="font-semibold">{selectedProperty.bathrooms}</p></div>
            </div>
            <div><p className="text-sm text-gray-600 mb-2">Description</p><p className="bg-gray-50 p-4 rounded-lg">{selectedProperty.description}</p></div>
            {selectedProperty.images?.length > 0 && (
              <div><p className="text-sm text-gray-600 mb-2">Images</p><div className="grid grid-cols-3 gap-2">{selectedProperty.images.slice(0, 6).map((img, i) => <img key={i} src={img.url} alt={`Property ${i+1}`} className="w-full h-24 object-cover rounded-lg" />)}</div></div>
            )}
            <div className="flex gap-3 pt-4 border-t">
              <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Close</button>
              <button onClick={() => { handleReject(selectedProperty._id); setShowModal(false); }} className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reject</button>
              <button onClick={() => { handleApprove(selectedProperty._id); setShowModal(false); }} className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PropertyApproval;
