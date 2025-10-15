import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaHome, FaCheckCircle, FaClock, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaMapMarkerAlt, FaBed, FaBath, FaRuler } from 'react-icons/fa';
import axios from '../../services/axios';

const MyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get API URL from environment for images
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const BASE_URL = API_URL.replace('/api', '');

  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    
    if (typeof image === 'string') {
      if (image.startsWith('http://') || image.startsWith('https://')) return image;
      return `${BASE_URL}${image}`;
    }
    
    if (image.url) {
      if (image.url.startsWith('http://') || image.url.startsWith('https://')) return image.url;
      return `${BASE_URL}${image.url}`;
    }
    
    return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('/properties/landlord/my-properties');
      setProperties(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      alert('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/properties/${id}`);
        alert('Property deleted successfully!');
        fetchProperties();
      } catch (error) {
        console.error('Failed to delete:', error);
        alert(error.response?.data?.message || 'Failed to delete property. Please try again.');
      }
    }
  };

  const toggleStatus = async (id, currentStatus, title) => {
    const newStatus = currentStatus === 'available' ? 'occupied' : 'available';
    const confirmMessage = `Mark "${title}" as ${newStatus}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await axios.put(`/properties/${id}`, { status: newStatus });
        alert(`Property status updated to ${newStatus}!`);
        fetchProperties();
      } catch (error) {
        console.error('Failed to update status:', error);
        alert(error.response?.data?.message || 'Failed to update status. Please try again.');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/landlord/properties/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header - Professional Design */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8 border-l-4 border-primary-500 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                My Properties
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage and monitor your rental properties
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link 
                to="/landlord/properties/add" 
                className="inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
              >
                <FaPlus className="mr-2 text-sm" />
                Add Property
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid - Clean & Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-b-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium uppercase tracking-wide">Total Properties</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{properties.length}</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaHome className="text-xl sm:text-2xl text-primary-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-b-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium uppercase tracking-wide">Available</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{properties.filter(p => p.status === 'available').length}</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-xl sm:text-2xl text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-b-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium uppercase tracking-wide">Occupied</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{properties.filter(p => p.status === 'occupied').length}</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaClock className="text-xl sm:text-2xl text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid - Enhanced Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-300 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {properties.map(property => (
              <div key={property._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                {/* Property Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getImageUrl(property.images?.[0])}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold uppercase shadow-lg ${
                    property.status === 'available' ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    {property.status}
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <FaMapMarkerAlt className="mr-2 text-primary-500 flex-shrink-0" />
                    <span className="line-clamp-1">{property.address?.street}, {property.address?.city}, {property.address?.state}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FaBed className="text-gray-400" />
                      <span className="font-semibold">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaBath className="text-gray-400" />
                      <span className="font-semibold">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaRuler className="text-gray-400" />
                      <span className="font-semibold">{property.area?.value || property.area} sqft</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-2xl font-bold text-primary-500">${property.rent?.amount || property.rent}</span>
                    <span className="text-gray-600 text-sm">/month</span>
                  </div>

                  {/* Action Buttons - Clean & Professional */}
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <button
                      onClick={() => handleEdit(property._id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-md"
                      title="Edit Property"
                    >
                      <FaEdit className="text-sm" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    
                    <button
                      onClick={() => toggleStatus(property._id, property.status, property.title)}
                      className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-md ${
                        property.status === 'available' 
                          ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                      title={property.status === 'available' ? 'Mark as Occupied' : 'Mark as Available'}
                    >
                      {property.status === 'available' ? <FaToggleOff className="text-sm" /> : <FaToggleOn className="text-sm" />}
                      <span className="hidden sm:inline">{property.status === 'available' ? 'Occupied' : 'Available'}</span>
                    </button>
                    
                    <button
                      onClick={() => handleDelete(property._id, property.title)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-md"
                      title="Delete Property"
                    >
                      <FaTrash className="text-sm" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-20 bg-white rounded-xl shadow-md">
            <FaHome className="text-5xl sm:text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No Properties Yet</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Start by adding your first property</p>
            <Link 
              to="/landlord/properties/add" 
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-sm transition-all duration-300"
            >
              <FaPlus className="mr-2" /> Add Property
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProperties;
