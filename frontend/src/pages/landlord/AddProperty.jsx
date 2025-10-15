import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaDollarSign, FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaImage } from 'react-icons/fa';
import axios from '../../services/axios';

const AddProperty = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '', type: 'apartment', description: '', bedrooms: 1, bathrooms: 1,
    area: { value: 0, unit: 'sqft' },
    rent: { amount: 0, currency: 'USD', period: 'monthly' },
    deposit: 0,
    address: { street: '', city: '', state: '', zipCode: '', country: 'USA' },
    amenities: [],
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    // Validate step 1
    if (step === 1) {
      if (!formData.title || !formData.description || formData.rent.amount <= 0 || formData.deposit <= 0 || formData.area.value <= 0) {
        alert('Please fill in all required fields in Basic Information');
        return;
      }
    }
    
    // Validate step 2
    if (step === 2) {
      if (!formData.address.street || !formData.address.city || !formData.address.state || !formData.address.zipCode) {
        alert('Please fill in all required address fields');
        return;
      }
    }
    
    console.log('Moving to step:', step + 1);
    setStep(step + 1);
  };

  const handleBack = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Going back to step:', step - 1);
    setStep(step - 1);
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleNext();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== FORM SUBMIT TRIGGERED ===');
    console.log('Current step:', step);
    
    // Prevent submission if not on final step
    if (step < 3) {
      console.log('⚠️ Blocked submission - not on step 3. Ignoring.');
      return false;
    }
    
    console.log('✅ On step 3, proceeding with property creation...');
    setLoading(true);
    try {
      const data = new FormData();
      
      // Handle simple fields
      data.append('title', formData.title);
      data.append('type', formData.type);
      data.append('description', formData.description);
      data.append('bedrooms', formData.bedrooms);
      data.append('bathrooms', formData.bathrooms);
      data.append('deposit', formData.deposit);
      
      // Handle area as JSON string
      data.append('area', JSON.stringify(formData.area));
      
      // Handle rent as JSON string
      data.append('rent', JSON.stringify(formData.rent));
      
      // Handle address as JSON string
      data.append('address', JSON.stringify(formData.address));
      
      // Handle amenities array
      if (formData.amenities.length > 0) {
        data.append('amenities', JSON.stringify(formData.amenities));
      }
      
      // Handle images
      images.forEach(img => data.append('images', img));
      
      console.log('Submitting property creation...');
      const response = await axios.post('/properties', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Property created successfully:', response.data);
      alert('Property created successfully!');
      
      // Use navigate with replace to avoid back button issues
      navigate('/landlord/properties', { replace: true });
    } catch (error) {
      console.error('Failed to create property - Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to create property. Please try again.';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const amenitiesList = ['WiFi', 'Parking', 'Gym', 'Pool', 'Laundry', 'AC', 'Heating', 'Elevator', 'Balcony', 'Garden'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Property</h1>
        <p className="text-gray-600">Fill in the details to list your property</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>{s}</div>
              {s < 3 && <div className={`w-32 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-300'}`}></div>}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={(e) => {
        // Prevent Enter key from submitting form unless on final step
        if (e.key === 'Enter' && step < 3) {
          e.preventDefault();
          handleNext();
        }
      }} className="bg-white rounded-lg shadow-md p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Basic Information</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Property Title *</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., Modern 2BR Apartment Downtown" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="condo">Condo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rent *</label>
                <input type="number" required value={formData.rent.amount} onChange={(e) => setFormData({...formData, rent: {...formData.rent, amount: parseInt(e.target.value) || 0}})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="2000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Security Deposit *</label>
              <input type="number" required value={formData.deposit} onChange={(e) => setFormData({...formData, deposit: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="1000" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms *</label>
                <input type="number" required min="0" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms *</label>
                <input type="number" required min="0" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Area (Sq Ft) *</label>
                <input type="number" required value={formData.area.value} onChange={(e) => setFormData({...formData, area: {...formData.area, value: parseInt(e.target.value) || 0}})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea required rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Describe your property..." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Location & Amenities</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                <input type="text" required value={formData.address.street} onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                <input type="text" required value={formData.address.city} onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                <input type="text" required value={formData.address.state} onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code *</label>
                <input type="text" required value={formData.address.zipCode} onChange={(e) => setFormData({...formData, address: {...formData.address, zipCode: e.target.value}})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
              <div className="grid grid-cols-3 gap-3">
                {amenitiesList.map(a => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.amenities.includes(a)} onChange={(e) => setFormData({...formData, amenities: e.target.checked ? [...formData.amenities, a] : formData.amenities.filter(x => x !== a)})} className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{a}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Property Images</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FaImage className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Upload property images (up to 10)</p>
              <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} className="hidden" id="images" />
              <label htmlFor="images" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">Choose Images</label>
              {images.length > 0 && <p className="text-green-600 mt-4 font-semibold">{images.length} image(s) selected</p>}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-6 border-t mt-6">
          {step > 1 && (
            <button 
              type="button" 
              onClick={handleBack} 
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button 
              type="button" 
              onClick={handleNextClick} 
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Creating Property...' : 'Create Property'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
