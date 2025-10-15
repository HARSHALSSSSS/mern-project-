import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaHome, FaBed, FaBath, FaRulerCombined, FaCheckCircle, FaUsers, FaBuilding, FaChartLine } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProperties } from '../../redux/slices/propertySlice';
import AdminFloatingButton from '../../components/AdminFloatingButton';

const Home = () => {
  const dispatch = useDispatch();
  const { properties, loading } = useSelector((state) => state.properties);
  const [searchQuery, setSearchQuery] = useState({ location: '', type: '', priceRange: '' });

  useEffect(() => {
    dispatch(getProperties());
  }, [dispatch]);

  const featuredProperties = properties?.slice(0, 6) || [];

  // Debug logging
  useEffect(() => {
    console.log('🏠 Home Page - Properties State:', {
      properties,
      loading,
      featuredProperties,
      count: properties?.length
    });
  }, [properties, loading]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to properties page with filters
    window.location.href = `/properties?location=${searchQuery.location}&type=${searchQuery.type}&price=${searchQuery.priceRange}`;
  };

  // Helper function to get full image URL
  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    if (typeof image === 'string') {
      return image.startsWith('http') ? image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${image}`;
    }
    if (image.url) {
      return image.url.startsWith('http') ? image.url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${image.url}`;
    }
    return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
  };

  return (
    <div className="home-page bg-white">
      {/* Hero Section - Consza Style: Full-width background with dark overlay */}
      <section className="relative bg-cover bg-center h-[600px] lg:h-[700px]" style={{
        backgroundImage: `linear-gradient(rgba(26, 34, 56, 0.85), rgba(26, 34, 56, 0.85)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
      }}>
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <div className="mb-6">
              <span className="bg-primary-500 text-white px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider inline-block">
                Find Your Dream Home
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              We Will Build Your <br />
              <span className="text-primary-500">Dream Property</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
              High-quality construction solutions for residentials & industries!<br />
              You can dream, create, design and build the most wonderful place in the world.
            </p>
            
            {/* CTA Buttons - Consza Style */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/properties"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-md font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg inline-block text-center"
              >
                Browse Properties
              </Link>
              <Link
                to="/about"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-accent-500 text-white px-8 py-4 rounded-md font-semibold uppercase text-sm tracking-wide transition-all duration-300 inline-block text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Consza Style: Dark Navy Background */}
      <section className="py-16 lg:py-20 bg-accent-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 bg-opacity-20 text-primary-500 rounded-full mb-4">
                <FaBuilding className="text-3xl" />
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold text-white mb-2">1,345+</h3>
              <p className="text-gray-300 text-sm uppercase tracking-wide">Properties Listed</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 bg-opacity-20 text-primary-500 rounded-full mb-4">
                <FaUsers className="text-3xl" />
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold text-white mb-2">5,240+</h3>
              <p className="text-gray-300 text-sm uppercase tracking-wide">Happy Clients</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 bg-opacity-20 text-primary-500 rounded-full mb-4">
                <FaHome className="text-3xl" />
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold text-white mb-2">890+</h3>
              <p className="text-gray-300 text-sm uppercase tracking-wide">Projects Complete</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 bg-opacity-20 text-primary-500 rounded-full mb-4">
                <FaChartLine className="text-3xl" />
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold text-white mb-2">25+</h3>
              <p className="text-gray-300 text-sm uppercase tracking-wide">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Consza Style */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wider">About Us</span>
              <h2 className="text-3xl lg:text-5xl font-bold text-accent-500 mt-4 mb-6 leading-tight">
                We've Been Building Our Experience
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                We've been building our experience high quality construction solutions for residentials & industries!
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                You can dream, create, design and build the most wonderful place in the world. But it requires people. Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-accent-500 mb-1">Construction Services</h4>
                    <p className="text-gray-600 text-sm">Lorem ipsum dolor sit piscing sed nonmy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-accent-500 mb-1">Unique Technology</h4>
                    <p className="text-gray-600 text-sm">Lorem ipsum dolor sit piscing sed nonmy</p>
                  </div>
                </div>
              </div>

              <Link
                to="/about"
                className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-md font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                More About
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"
                alt="Modern Building"
                className="rounded-lg shadow-2xl w-full"
              />
              <div className="absolute -bottom-10 -left-10 bg-primary-500 text-white p-8 rounded-lg shadow-xl hidden lg:block">
                <p className="text-5xl font-bold mb-2">25+</p>
                <p className="text-sm uppercase tracking-wide">Years of Services</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties - Consza Style */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary-500 font-bold text-sm uppercase tracking-wider">Explore Recent Work</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-accent-500 mt-4 mb-4">
              Some of Our Finished Projects
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              That will amaze you. Quality and reliability services to provide a solution to your project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="h-72 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={getImageUrl(property.images?.[0])}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-accent-500 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                      <Link
                        to={`/properties/${property._id}`}
                        className="text-white border-2 border-white px-6 py-3 rounded-md font-semibold uppercase text-sm hover:bg-white hover:text-accent-500 transition-all duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                    <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-md text-sm font-bold uppercase">
                      {property.propertyType || 'Property'}
                    </div>
                    {property.status === 'available' && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-md text-xs font-bold uppercase">
                        Available
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <FaMapMarkerAlt className="text-primary-500 text-sm" />
                      <span className="text-sm">{property.address?.city || 'Location'}, {property.address?.state || ''}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-accent-500 mb-3 line-clamp-1">
                      {property.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {property.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaBed className="text-primary-500" />
                        <span className="text-sm font-semibold">{property.bedrooms || 0} Beds</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaBath className="text-primary-500" />
                        <span className="text-sm font-semibold">{property.bathrooms || 0} Baths</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaRulerCombined className="text-primary-500" />
                        <span className="text-sm font-semibold">{property.area?.value || property.area || 0} sqft</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Rent</p>
                        <p className="text-2xl font-bold text-primary-500">
                          ${property.rent?.amount || property.rent || 0}
                          <span className="text-sm text-gray-500 font-normal">/mo</span>
                        </p>
                      </div>
                      <Link
                        to={`/properties/${property._id}`}
                        className="text-primary-500 font-semibold text-sm uppercase tracking-wide hover:text-accent-500 transition-colors flex items-center gap-2"
                      >
                        View Details <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16 bg-white rounded-lg shadow-lg">
                <FaHome className="text-gray-300 text-6xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Properties Available Yet</h3>
                <p className="text-gray-500 text-lg mb-2">We're working on adding new listings!</p>
                <p className="text-gray-400 text-sm mb-6">Check back soon or contact us to list your property.</p>
                {/* Debug info - remove in production */}
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded inline-block">
                  <p className="text-xs text-gray-600 mb-1">Debug Info:</p>
                  <p className="text-xs text-gray-500">Properties count: {properties?.length || 0}</p>
                  <p className="text-xs text-gray-500">Loading: {loading ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-md font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section - Consza Style */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary-500 font-bold text-sm uppercase tracking-wider">What We Do!</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-accent-500 mt-4 mb-4">
              We Provide All Of Construction <br className="hidden lg:block" />
              And Building Exclusive Service
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Comprehensive property management and rental solutions tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 group border-b-4 border-primary-500">
              <div className="w-20 h-20 bg-primary-500 text-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaHome className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-accent-500 mb-4">Architecture Design</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Lorem ipsum dolor sit and amet, adipisicing elit, sed do eiusmod tempor. Happy with our services.
              </p>
              <Link
                to="/properties"
                className="text-primary-500 font-semibold uppercase text-sm tracking-wide hover:text-accent-500 transition-colors flex items-center gap-2"
              >
                View All <span>→</span>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 group border-b-4 border-primary-500">
              <div className="w-20 h-20 bg-primary-500 text-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaBuilding className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-accent-500 mb-4">Build Construction</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Complete property management solutions for landlords. Handle tenants, payments, and maintenance all in one place.
              </p>
              <Link
                to="/properties"
                className="text-primary-500 font-semibold uppercase text-sm tracking-wide hover:text-accent-500 transition-colors flex items-center gap-2"
              >
                View All <span>→</span>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 group border-b-4 border-primary-500">
              <div className="w-20 h-20 bg-primary-500 text-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaChartLine className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-accent-500 mb-4">Building Renovation</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Advanced analytics and reporting tools to track your property performance, revenue, and occupancy rates.
              </p>
              <Link
                to="/properties"
                className="text-primary-500 font-semibold uppercase text-sm tracking-wide hover:text-accent-500 transition-colors flex items-center gap-2"
              >
                View All <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Consza Style */}
      <section className="py-20 lg:py-28 bg-accent-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-10 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Join thousands of happy tenants and landlords who trust our platform for their rental needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-md font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg inline-block"
            >
              Get Started as Tenant
            </Link>
            <Link
              to="/signup"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-accent-500 text-white px-8 py-4 rounded-md font-semibold uppercase text-sm tracking-wide transition-all duration-300 inline-block"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Floating Button */}
      <AdminFloatingButton position="bottom-right" />
    </div>
  );
};

export default Home;
