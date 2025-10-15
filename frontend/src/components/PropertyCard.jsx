// Property Card Component (Consza Theme)
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaHeart } from 'react-icons/fa';
import { useState } from 'react';

const PropertyCard = ({ property, showActions = false, onApply }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-success-500',
      occupied: 'bg-error-500',
      pending: 'bg-warning-500',
      'under-review': 'bg-primary-500',
    };
    return colors[status] || 'bg-neutral-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 group">
      {/* Image */}
      <Link to={`/properties/${property._id}`} className="relative block h-48 sm:h-56 md:h-64 overflow-hidden">
        <img
          src={
            (typeof property.images?.[0] === 'string' 
              ? property.images[0] 
              : property.images?.[0]?.url) || 
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
          }
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Price Badge */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-sm sm:text-base font-bold shadow-btn">
          ${property.rent?.amount || property.rent}/mo
        </div>
        
        {/* Status Badge */}
        <div className={`absolute top-2 sm:top-4 left-2 sm:left-4 ${getStatusColor(property.status)} text-white px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold capitalize shadow`}>
          {property.status}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-9 h-9 sm:w-11 sm:h-11 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-btn hover:bg-neutral-100 transition-colors"
        >
          <FaHeart className={`text-sm sm:text-base ${isFavorite ? 'text-error-500' : 'text-neutral-400'}`} />
        </button>
      </Link>
      
      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Location */}
        <div className="flex items-center gap-2 text-neutral-500 text-xs sm:text-sm mb-2 sm:mb-3">
          <FaMapMarkerAlt className="text-accent-500 flex-shrink-0" />
          <span className="font-medium truncate">{property.address?.street}, {property.address?.city}, {property.address?.state}</span>
        </div>
        
        {/* Title */}
        <Link to={`/properties/${property._id}`}>
          <h3 className="text-lg sm:text-xl font-bold text-primary-700 mb-2 sm:mb-3 line-clamp-2 hover:text-accent-600 transition-colors">
            {property.title}
          </h3>
        </Link>
        
        {/* Description */}
        <p className="text-neutral-600 text-sm mb-3 sm:mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Property Details */}
        <div className="flex items-center justify-between py-3 sm:py-4 border-t border-neutral-200 text-sm sm:text-base">
          <div className="flex items-center gap-1.5 sm:gap-2 text-primary-700">
            <FaBed className="text-accent-500 text-base sm:text-lg" />
            <span className="font-semibold text-xs sm:text-base">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-primary-700">
            <FaBath className="text-accent-500 text-base sm:text-lg" />
            <span className="font-semibold text-xs sm:text-base">{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-primary-700">
            <FaRulerCombined className="text-accent-500 text-base sm:text-lg" />
            <span className="font-semibold text-xs sm:text-base">{property.area?.value || property.area} {property.area?.unit || 'sqft'}</span>
          </div>
        </div>

        {/* Amenities Preview */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {property.amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-primary-100 text-primary-600 rounded-full text-xs font-semibold shadow-sm"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-xs font-semibold shadow-sm">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && onApply && property.status === 'available' && (
          <button
            onClick={() => onApply(property)}
            className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-6 py-3 rounded-xl font-semibold shadow-btn transition duration-300"
          >
            Apply Now
          </button>
        )}
        {!showActions && (
          <Link
            to={`/properties/${property._id}`}
            className="block w-full text-center bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-6 py-3 rounded-xl font-semibold shadow-btn transition duration-300"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    rent: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        amount: PropTypes.number,
        currency: PropTypes.string,
        period: PropTypes.string,
      })
    ]).isRequired,
    status: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          url: PropTypes.string,
          publicId: PropTypes.string,
        })
      ])
    ),
    address: PropTypes.shape({
      street: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
    }),
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
    area: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        value: PropTypes.number,
        unit: PropTypes.string,
      })
    ]),
    amenities: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  showActions: PropTypes.bool,
  onApply: PropTypes.func,
};

export default PropertyCard;