import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHome, FaBuilding, FaInfoCircle, FaEnvelope, FaUser, FaSignInAlt, FaPhone, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    return `/${user.role}/dashboard`;
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-600 text-white py-2.5 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <FaPhone className="text-accent-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-accent-400" />
                <span>support@realestate.com</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>📍 121 King Street, NY, USA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-card sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-btn">
                <FaBuilding className="text-white text-xl sm:text-2xl" />
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-bold text-primary-700">RealEstate</span>
                <p className="text-xs text-neutral-500 font-medium hidden sm:block">Property Management</p>
              </div>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-primary-600 hover:text-accent-500 font-semibold transition-colors duration-200 flex items-center gap-2"
              >
                <FaHome className="text-sm" /> Home
              </Link>
              <Link 
                to="/properties" 
                className="text-primary-600 hover:text-accent-500 font-semibold transition-colors duration-200 flex items-center gap-2"
              >
                <FaBuilding className="text-sm" /> Properties
              </Link>
              <Link 
                to="/about" 
                className="text-primary-600 hover:text-accent-500 font-semibold transition-colors duration-200 flex items-center gap-2"
              >
                <FaInfoCircle className="text-sm" /> About
              </Link>
              <Link 
                to="/contact" 
                className="text-primary-600 hover:text-accent-500 font-semibold transition-colors duration-200 flex items-center gap-2"
              >
                <FaEnvelope className="text-sm" /> Contact
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <Link 
                  to={getDashboardLink()} 
                  className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-btn transition duration-300 flex items-center gap-2"
                >
                  <FaUser /> Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-primary-600 hover:text-accent-500 font-semibold transition-colors duration-200 flex items-center gap-2"
                  >
                    <FaSignInAlt /> Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-btn transition duration-300"
                  >
                    Sign Up
                  </Link>
                  <Link 
                    to="/admin/login" 
                    className="text-primary-700 hover:text-primary-900 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-neutral-100 border border-primary-300 text-sm"
                  >
                    Admin
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-primary-600 hover:text-accent-500 p-2"
            >
              {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-primary-600 hover:text-accent-500 font-semibold py-2 flex items-center gap-2"
                >
                  <FaHome /> Home
                </Link>
                <Link 
                  to="/properties" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-primary-600 hover:text-accent-500 font-semibold py-2 flex items-center gap-2"
                >
                  <FaBuilding /> Properties
                </Link>
                <Link 
                  to="/about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-primary-600 hover:text-accent-500 font-semibold py-2 flex items-center gap-2"
                >
                  <FaInfoCircle /> About
                </Link>
                <Link 
                  to="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-primary-600 hover:text-accent-500 font-semibold py-2 flex items-center gap-2"
                >
                  <FaEnvelope /> Contact
                </Link>
                
                <div className="border-t border-neutral-200 pt-4 mt-2">
                  {user ? (
                    <Link 
                      to={getDashboardLink()} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-6 py-3 rounded-xl font-semibold shadow-btn"
                    >
                      <FaUser className="inline mr-2" /> Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-center text-primary-600 hover:text-accent-500 font-semibold py-2 mb-2"
                      >
                        <FaSignInAlt className="inline mr-2" /> Login
                      </Link>
                      <Link 
                        to="/signup" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-center bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-6 py-3 rounded-xl font-semibold shadow-btn mb-2"
                      >
                        Sign Up
                      </Link>
                      <Link 
                        to="/admin/login" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-center text-primary-700 hover:bg-neutral-100 font-medium py-2 rounded-lg border border-primary-300"
                      >
                        Admin Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
