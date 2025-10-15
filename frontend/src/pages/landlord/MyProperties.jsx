import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard';
import { FaPlus, FaHome, FaCheckCircle, FaClock } from 'react-icons/fa';
import axios from 'axios';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('/api/properties/landlord/my-properties');
      setProperties(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`/api/properties/${id}`);
        fetchProperties();
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`/api/properties/${id}`, { status: currentStatus === 'available' ? 'occupied' : 'available' });
      fetchProperties();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header - Consza Style */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-accent-500 mb-2">My Properties</h1>
            <p className="text-gray-600 text-lg">Manage your rental properties</p>
          </div>
          <Link to="/landlord/properties/add" className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center gap-2">
            <FaPlus /> Add Property
          </Link>
        </div>
      </div>

      {/* Stats Grid - Consza Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Total Properties</p>
              <p className="text-3xl font-bold text-accent-500">{properties.length}</p>
            </div>
            <div className="w-14 h-14 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaHome className="text-2xl text-primary-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Available</p>
              <p className="text-3xl font-bold text-accent-500">{properties.filter(p => p.status === 'available').length}</p>
            </div>
            <div className="w-14 h-14 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Occupied</p>
              <p className="text-3xl font-bold text-accent-500">{properties.filter(p => p.status === 'occupied').length}</p>
            </div>
            <div className="w-14 h-14 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaClock className="text-2xl text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"><div className="h-64 bg-gray-300"></div><div className="p-6"><div className="h-4 bg-gray-300 rounded mb-4"></div></div></div>)}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <div key={property._id} className="relative">
              <PropertyCard property={property} showActions={false} />
              <div className="absolute bottom-6 left-6 right-6 flex gap-2">
                <Link to={`/landlord/properties/edit/${property._id}`} className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-center text-sm font-semibold uppercase tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg">Edit</Link>
                <button onClick={() => toggleStatus(property._id, property.status)} className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg">{property.status === 'available' ? 'Mark Occupied' : 'Mark Available'}</button>
                <button onClick={() => handleDelete(property._id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-lg">
          <FaHome className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-accent-500 mb-2">No Properties Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first property</p>
          <Link to="/landlord/properties/add" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"><FaPlus className="inline mr-2" /> Add Property</Link>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
