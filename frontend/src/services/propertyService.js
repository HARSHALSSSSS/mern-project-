import axios from './axios';

// Get all properties
const getProperties = async (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  const response = await axios.get(`/properties?${queryString}`);
  return response.data;
};

// Get property by ID
const getPropertyById = async (id) => {
  const response = await axios.get(`/properties/${id}`);
  return response.data;
};

// Get my properties (landlord)
const getMyProperties = async () => {
  const response = await axios.get('/properties/landlord/my-properties');
  return response.data;
};

// Create property
const createProperty = async (propertyData) => {
  const formData = new FormData();
  
  Object.keys(propertyData).forEach(key => {
    if (key === 'images' && propertyData[key]) {
      Array.from(propertyData[key]).forEach(file => {
        formData.append('images', file);
      });
    } else if (key === 'address' || key === 'rent' || key === 'area') {
      formData.append(key, JSON.stringify(propertyData[key]));
    } else if (key === 'amenities' && Array.isArray(propertyData[key])) {
      propertyData[key].forEach(amenity => {
        formData.append('amenities[]', amenity);
      });
    } else {
      formData.append(key, propertyData[key]);
    }
  });
  
  const response = await axios.post('/properties', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Update property
const updateProperty = async (id, propertyData) => {
  const formData = new FormData();
  
  Object.keys(propertyData).forEach(key => {
    if (key === 'images' && propertyData[key]) {
      Array.from(propertyData[key]).forEach(file => {
        formData.append('images', file);
      });
    } else if (typeof propertyData[key] === 'object' && !Array.isArray(propertyData[key])) {
      formData.append(key, JSON.stringify(propertyData[key]));
    } else {
      formData.append(key, propertyData[key]);
    }
  });
  
  const response = await axios.put(`/properties/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Delete property
const deleteProperty = async (id) => {
  const response = await axios.delete(`/properties/${id}`);
  return response.data;
};

const propertyService = {
  getProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};

export default propertyService;
