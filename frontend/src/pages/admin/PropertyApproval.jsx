import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { FaHome, FaClock, FaCheckCircle, FaTimesCircle, FaFilter, FaSync } from 'react-icons/fa';
import axios from '../../services/axios';

const PropertyApproval = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Check authentication first
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('🔐 Auth check:', { 
        hasToken: !!token, 
        user: user,
        userRole: user?.role 
      });
      
      // Fetch all properties for admin with approval status
      const query = filter === 'all' ? '' : `?approvalStatus=${filter}`;
      console.log('🔍 Admin fetching properties:', { filter, query, endpoint: `/properties${query}` });
      
      const response = await axios.get(`/properties${query}`);
      const allProps = response.data.properties || [];
      
      console.log('📊 Properties received:', { 
        count: allProps.length, 
        properties: allProps.map(p => ({ 
          title: p.title, 
          status: p.approvalStatus 
        })),
        fullResponse: response.data
      });
      
      setProperties(allProps);
      
      // Calculate stats
      const pending = allProps.filter(p => p.approvalStatus === 'pending').length;
      const approved = allProps.filter(p => p.approvalStatus === 'approved').length;
      const rejected = allProps.filter(p => p.approvalStatus === 'rejected').length;
      
      setStats({
        pending,
        approved,
        rejected,
        total: allProps.length
      });
    } catch (error) {
      console.error('❌ Failed to fetch properties:', error);
      console.error('Error details:', error.response?.data);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/properties/${id}/approval`, { approvalStatus: 'approved' });
      await fetchProperties(); // Refresh the list
      setShowModal(false);
      alert('Property approved successfully!');
    } catch (error) {
      console.error('Failed to approve:', error);
      alert('Failed to approve property. Please try again.');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/properties/${id}/approval`, { approvalStatus: 'rejected' });
      await fetchProperties(); // Refresh the list
      setShowModal(false);
      alert('Property rejected successfully!');
    } catch (error) {
      console.error('Failed to reject:', error);
      alert('Failed to reject property. Please try again.');
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '/placeholder.jpg';
    if (typeof image === 'string') {
      return image.startsWith('http') ? image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${image}`;
    }
    if (image.url) {
      return image.url.startsWith('http') ? image.url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${image.url}`;
    }
    return '/placeholder.jpg';
  };

  const columns = [
    {
      key: 'property',
      label: 'Property',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img 
            src={getImageUrl(p.images?.[0])} 
            alt={p.title} 
            className="w-16 h-16 rounded-lg object-cover" 
          />
          <div>
            <p className="font-semibold">{p.title}</p>
            <p className="text-sm text-gray-500 capitalize">{p.type || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    { 
      key: 'landlord', 
      label: 'Landlord', 
      render: (p) => p.landlord?.name || 'N/A' 
    },
    { 
      key: 'rent', 
      label: 'Rent', 
      render: (p) => `$${(p.rent?.amount || p.rent || 0).toLocaleString()}/mo` 
    },
    { 
      key: 'location', 
      label: 'Location', 
      render: (p) => `${p.address?.city || 'N/A'}, ${p.address?.state || 'N/A'}` 
    },
    {
      key: 'status',
      label: 'Status',
      render: (p) => {
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusColors[p.approvalStatus] || 'bg-gray-100 text-gray-800'}`}>
            {p.approvalStatus || 'Unknown'}
          </span>
        );
      }
    },
    { 
      key: 'submitted', 
      label: 'Submitted', 
      render: (p) => new Date(p.createdAt).toLocaleDateString() 
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Management</h1>
          <p className="text-gray-600">Review, approve, and manage all property listings</p>
        </div>
        <button
          onClick={() => {
            console.log('🔄 Manual refresh triggered');
            fetchProperties();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
        >
          <FaSync className="text-sm" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('all')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Properties</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <FaHome className="text-2xl text-blue-600" />
            </div>
          </div>
          {filter === 'all' && <div className="mt-2 h-1 bg-blue-600 rounded"></div>}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('pending')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
              <FaClock className="text-2xl text-yellow-600" />
            </div>
          </div>
          {filter === 'pending' && <div className="mt-2 h-1 bg-yellow-600 rounded"></div>}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('approved')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
          </div>
          {filter === 'approved' && <div className="mt-2 h-1 bg-green-600 rounded"></div>}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('rejected')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <FaTimesCircle className="text-2xl text-red-600" />
            </div>
          </div>
          {filter === 'rejected' && <div className="mt-2 h-1 bg-red-600 rounded"></div>}
        </div>
      </div>

      {/* Filter Indicator */}
      <div className="mb-4 flex items-center gap-2">
        <FaFilter className="text-gray-500" />
        <span className="text-sm font-semibold text-gray-700">
          Showing: <span className="text-primary-500 capitalize">{filter === 'all' ? 'All Properties' : `${filter} Properties`}</span>
        </span>
        {filter !== 'all' && (
          <button 
            onClick={() => setFilter('all')} 
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <DataTable
          columns={columns}
          data={properties}
          loading={loading}
          onView={(p) => { setSelectedProperty(p); setShowModal(true); }}
          customActions={(p) => (
            <>
              {p.approvalStatus !== 'approved' && (
                <button 
                  onClick={() => handleApprove(p._id)} 
                  className="text-green-600 hover:text-green-800 p-2 font-semibold transition-colors"
                  title="Approve Property"
                >
                  Approve
                </button>
              )}
              {p.approvalStatus !== 'rejected' && (
                <button 
                  onClick={() => handleReject(p._id)} 
                  className="text-red-600 hover:text-red-800 p-2 font-semibold transition-colors"
                  title="Reject Property"
                >
                  Reject
                </button>
              )}
            </>
          )}
          emptyMessage={
            filter === 'all' 
              ? "No properties found. Landlords need to add properties first." 
              : `No ${filter} properties found.`
          }
        />
      </div>

      {/* Property Details Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Property Details" size="lg">
        {selectedProperty && (
          <div className="space-y-4">
            {/* Property Images */}
            {selectedProperty.images?.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">Property Images</p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProperty.images.slice(0, 6).map((img, i) => (
                    <img 
                      key={i} 
                      src={getImageUrl(img)} 
                      alt={`Property ${i+1}`} 
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Property Info Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Title</p>
                <p className="font-semibold">{selectedProperty.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-semibold capitalize">{selectedProperty.type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Landlord</p>
                <p className="font-semibold">{selectedProperty.landlord?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rent</p>
                <p className="font-semibold">${(selectedProperty.rent?.amount || selectedProperty.rent || 0).toLocaleString()}/mo</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bedrooms</p>
                <p className="font-semibold">{selectedProperty.bedrooms || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bathrooms</p>
                <p className="font-semibold">{selectedProperty.bathrooms || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Area</p>
                <p className="font-semibold">{selectedProperty.area?.value || selectedProperty.area || 0} sqft</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold capitalize">{selectedProperty.approvalStatus || 'Unknown'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{selectedProperty.address?.street || 'N/A'}, {selectedProperty.address?.city || 'N/A'}, {selectedProperty.address?.state || 'N/A'} {selectedProperty.address?.zipCode || ''}</p>
              </div>
            </div>
            
            {/* Description */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2 font-semibold">Description</p>
              <p className="bg-gray-50 p-4 rounded-lg text-gray-700">{selectedProperty.description || 'No description provided'}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Close
              </button>
              {selectedProperty.approvalStatus !== 'rejected' && (
                <button 
                  onClick={() => handleReject(selectedProperty._id)} 
                  className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Reject Property
                </button>
              )}
              {selectedProperty.approvalStatus !== 'approved' && (
                <button 
                  onClick={() => handleApprove(selectedProperty._id)} 
                  className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Approve Property
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PropertyApproval;
