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

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to properties page with filters
    window.location.href = `/properties?location=${searchQuery.location}&type=${searchQuery.type}&price=${searchQuery.priceRange}`;
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-32 sm:w-64 h-32 sm:h-64 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-accent-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4 sm:mb-6 inline-block">
              <span className="bg-accent-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-btn">
                FIND YOUR DREAM HOME
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-4">
              We Will Build Your <br className="hidden sm:block" />
              <span className="text-accent-400">Dream Property</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 text-neutral-200 max-w-2xl mx-auto px-4">
              Discover the perfect property for rent. We provide high-quality rental solutions for tenants and comprehensive property management for landlords.
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-card p-4 sm:p-6 max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="relative sm:col-span-2 lg:col-span-1">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={searchQuery.location}
                    onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-primary-700"
                  />
                </div>
                
                <select
                  value={searchQuery.type}
                  onChange={(e) => setSearchQuery({ ...searchQuery, type: e.target.value })}
                  className="px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-primary-700"
                >
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="condo">Condo</option>
                </select>

                <select
                  value={searchQuery.priceRange}
                  onChange={(e) => setSearchQuery({ ...searchQuery, priceRange: e.target.value })}
                  className="px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-primary-700"
                >
                  <option value="">Price Range</option>
                  <option value="0-1000">$0 - $1,000</option>
                  <option value="1000-2000">$1,000 - $2,000</option>
                  <option value="2000-3000">$2,000 - $3,000</option>
                  <option value="3000+">$3,000+</option>
                </select>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-btn transition duration-300 flex items-center justify-center gap-2 sm:col-span-2 lg:col-span-1"
                >
                  <FaSearch /> <span>Search</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary-600 text-white rounded-full mb-3 sm:mb-4">
                <FaBuilding className="text-xl sm:text-3xl" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-primary-800 mb-1 sm:mb-2">1,345+</h3>
              <p className="text-sm sm:text-base text-neutral-600">Properties Listed</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-success-500 text-white rounded-full mb-3 sm:mb-4">
                <FaUsers className="text-xl sm:text-3xl" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-primary-800 mb-1 sm:mb-2">5,240+</h3>
              <p className="text-sm sm:text-base text-neutral-600">Happy Tenants</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-warning-500 text-white rounded-full mb-3 sm:mb-4">
                <FaHome className="text-xl sm:text-3xl" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-primary-800 mb-1 sm:mb-2">890+</h3>
              <p className="text-sm sm:text-base text-neutral-600">Trusted Landlords</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-accent-600 text-white rounded-full mb-3 sm:mb-4">
                <FaChartLine className="text-xl sm:text-3xl" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-primary-800 mb-1 sm:mb-2">98%</h3>
              <p className="text-sm sm:text-base text-neutral-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <span className="text-accent-600 font-semibold text-sm uppercase tracking-wide">About Us</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-800 mt-4 mb-4 sm:mb-6">
                We've Been Building Our Experience
              </h2>
              <p className="text-neutral-600 mb-4 sm:mb-6 leading-relaxed">
                We provide high-quality property rental and management solutions for both residential properties. Our platform connects tenants with their dream homes and empowers landlords with efficient management tools.
              </p>
              <p className="text-neutral-600 mb-6 sm:mb-8 leading-relaxed">
                With years of experience in the real estate industry, we understand what it takes to create successful rental relationships. Our comprehensive platform handles everything from property listings to payment processing and maintenance requests.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-success-500 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary-800 mb-1">Verified Properties</h4>
                    <p className="text-neutral-600 text-sm">All properties are verified and approved</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Secure Payments</h4>
                    <p className="text-gray-600 text-sm">Safe and encrypted payment processing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">24/7 Support</h4>
                    <p className="text-gray-600 text-sm">Round the clock customer assistance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Easy Management</h4>
                    <p className="text-gray-600 text-sm">Comprehensive property management tools</p>
                  </div>
                </div>
              </div>

              <Link
                to="/about"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
              >
                More About Us
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80"
                alt="Modern Building"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-blue-600 text-white p-8 rounded-xl shadow-xl">
                <p className="text-5xl font-bold mb-2">25+</p>
                <p className="text-sm">Years of Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Featured Properties</span>
            <h2 className="text-4xl font-bold text-gray-800 mt-4 mb-4">
              Explore Our Best Properties
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover handpicked properties that offer the best value, location, and amenities for your lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <Link
                  key={property._id}
                  to={`/properties/${property._id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold">
                      ${property.rent}/mo
                    </div>
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {property.status}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span>{property.address?.city}, {property.address?.state}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {property.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-1 text-gray-700">
                        <FaBed className="text-blue-600" />
                        <span className="text-sm font-semibold">{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <FaBath className="text-blue-600" />
                        <span className="text-sm font-semibold">{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <FaRulerCombined className="text-blue-600" />
                        <span className="text-sm font-semibold">{property.area} sqft</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500 text-lg">No properties available at the moment.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Our Services</span>
            <h2 className="text-4xl font-bold text-gray-800 mt-4 mb-4">
              What We Offer
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive property management and rental solutions tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <FaHome className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Property Rentals</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse through thousands of verified properties and find your perfect home. Easy application process and transparent pricing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <FaBuilding className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Property Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete property management solutions for landlords. Handle tenants, payments, and maintenance all in one place.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                <FaChartLine className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Analytics & Reporting</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced analytics and reporting tools to track your property performance, revenue, and occupancy rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of happy tenants and landlords who trust our platform for their rental needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition duration-300"
            >
              Get Started as Tenant
            </Link>
            <Link
              to="/signup"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition duration-300"
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
