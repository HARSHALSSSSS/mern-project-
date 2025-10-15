import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPropertyById } from '../../redux/slices/propertySlice';
import Modal from '../../components/Modal';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaHeart, FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from '../../services/axios';

const PropertyDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { property, isLoading } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);
  const [currentImage, setCurrentImage] = useState(0);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [applicationData, setApplicationData] = useState({ moveInDate: '', message: '' });

  // Get API URL from environment
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const BASE_URL = API_URL.replace('/api', ''); // Remove /api to get base URL

  // Helper function to get full image URL
  const getImageUrl = (image) => {
    if (!image) return null;
    
    // If image is a string
    if (typeof image === 'string') {
      // If it's already a full URL, return as is
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
      }
      // If it's a relative path, prepend base URL
      return `${BASE_URL}${image}`;
    }
    
    // If image is an object with url property
    if (image.url) {
      // If it's already a full URL, return as is
      if (image.url.startsWith('http://') || image.url.startsWith('https://')) {
        return image.url;
      }
      // If it's a relative path, prepend base URL
      return `${BASE_URL}${image.url}`;
    }
    
    return null;
  };

  useEffect(() => {
    dispatch(getPropertyById(id));
  }, [dispatch, id]);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/applications', { propertyId: id, ...applicationData });
      setShowApplyModal(false);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Failed to apply:', error);
      alert(error.response?.data?.message || 'Failed to submit application. Please try again.');
    }
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % (property?.images?.length || 1));
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + (property?.images?.length || 1)) % (property?.images?.length || 1));

  if (isLoading || !property) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Link to="/properties" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold">
          <FaChevronLeft /> Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="relative">
                {property.images && property.images.length > 0 ? (
                  <>
                    <img src={getImageUrl(property.images[currentImage])} alt={property.title} className="w-full h-96 object-cover" />
                    <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white">
                      <FaChevronLeft className="text-gray-800" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white">
                      <FaChevronRight className="text-gray-800" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                      {currentImage + 1} / {property.images.length}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-96 bg-gray-300 flex items-center justify-center"><p className="text-gray-500">No images available</p></div>
                )}
                <button onClick={() => setIsFavorite(!isFavorite)} className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition">
                  <FaHeart className={`text-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 p-4">
                {property.images?.slice(0, 4).map((img, i) => (
                  <img key={i} src={getImageUrl(img)} alt={`Thumbnail ${i+1}`} onClick={() => setCurrentImage(i)} className={`w-full h-20 object-cover rounded-lg cursor-pointer ${currentImage === i ? 'ring-4 ring-blue-600' : 'opacity-70 hover:opacity-100'}`} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{property.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <FaMapMarkerAlt className="text-blue-600" />
                <p className="text-lg">{property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.zipCode}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <FaBed className="text-3xl text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <FaBath className="text-3xl text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <FaRuler className="text-3xl text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{property.squareFeet}</p>
                  <p className="text-sm text-gray-600">Sq Ft</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                        <FaCheck className="text-green-600" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold mb-4">Additional Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-600">Property Type</p><p className="font-semibold capitalize">{property.type}</p></div>
                  <div><p className="text-sm text-gray-600">Pet Policy</p><p className="font-semibold capitalize">{property.petPolicy?.replace('-', ' ')}</p></div>
                  <div><p className="text-sm text-gray-600">Parking</p><p className="font-semibold">{property.parkingSpaces} Space(s)</p></div>
                  <div><p className="text-sm text-gray-600">Available From</p><p className="font-semibold">{property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : 'Now'}</p></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Monthly Rent</p>
                <p className="text-5xl font-bold text-blue-600">${property.rent?.amount?.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">+ ${property.rent?.deposit || 0} security deposit</p>
              </div>

              {user ? (
                <button onClick={() => setShowApplyModal(true)} className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg transition shadow-lg hover:shadow-xl mb-4">
                  Apply Now
                </button>
              ) : (
                <Link to="/login" className="block w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg transition shadow-lg hover:shadow-xl mb-4 text-center">
                  Login to Apply
                </Link>
              )}

              <div className="border-t pt-6">
                <h4 className="font-bold mb-4">Contact Landlord</h4>
                <div className="space-y-3">
                  <div><p className="text-sm text-gray-600">Name</p><p className="font-semibold">{property.landlord?.name || 'Property Owner'}</p></div>
                  <div><p className="text-sm text-gray-600">Email</p><p className="font-semibold">{property.landlord?.email || 'contact@property.com'}</p></div>
                  <button className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="Apply for this Property" size="md">
        <form onSubmit={handleApply}>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-1">{property.title}</p>
              <p className="text-sm text-gray-600">${property.rent?.amount}/month</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Desired Move-in Date *</label>
              <input type="date" required value={applicationData.moveInDate} onChange={(e) => setApplicationData({...applicationData, moveInDate: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message to Landlord</label>
              <textarea rows="4" value={applicationData.message} onChange={(e) => setApplicationData({...applicationData, message: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Tell us why you're a great fit..." />
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <button type="button" onClick={() => setShowApplyModal(false)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Application</button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PropertyDetails;
