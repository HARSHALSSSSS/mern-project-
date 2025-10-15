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
      {/* Top Bar - Consza Style: Dark Navy Background */}
      <div className="bg-accent-500 text-white py-3 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 hover:text-primary-500 transition-colors cursor-pointer">
                <FaPhone className="text-primary-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 hover:text-primary-500 transition-colors cursor-pointer">
                <FaEnvelope className="text-primary-500" />
                <span>support@realestate.com</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>📍 121 King Street, NY, USA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar - Consza Style: Clean White */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-primary-500 p-3 rounded-lg">
                <FaBuilding className="text-white text-2xl" />
              </div>
              <div>
                <span className="text-2xl font-bold text-accent-500">Consza</span>
                <p className="text-xs text-neutral-600 font-medium hidden sm:block">Real Estate Solutions</p>
              </div>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-accent-500 hover:text-primary-500 font-semibold text-sm uppercase tracking-wide transition-colors duration-300 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/properties" 
                className="text-accent-500 hover:text-primary-500 font-semibold text-sm uppercase tracking-wide transition-colors duration-300 relative group"
              >
                Properties
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/about" 
                className="text-accent-500 hover:text-primary-500 font-semibold text-sm uppercase tracking-wide transition-colors duration-300 relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/contact" 
                className="text-accent-500 hover:text-primary-500 font-semibold text-sm uppercase tracking-wide transition-colors duration-300 relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            {/* Auth Buttons - Consza Style */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <Link 
                  to={getDashboardLink()} 
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <FaUser /> Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-accent-500 hover:text-primary-500 font-semibold uppercase text-sm tracking-wide transition-colors duration-300 flex items-center gap-2"
                  >
                    <FaSignInAlt /> Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-accent-500 hover:text-primary-500 p-2"
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
                  className="text-accent-500 hover:text-primary-500 font-semibold py-2 uppercase text-sm tracking-wide flex items-center gap-2"
                >
                  <FaHome /> Home
                </Link>
                <Link 
                  to="/properties" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-accent-500 hover:text-primary-500 font-semibold py-2 uppercase text-sm tracking-wide flex items-center gap-2"
                >
                  <FaBuilding /> Properties
                </Link>
                <Link 
                  to="/about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-accent-500 hover:text-primary-500 font-semibold py-2 uppercase text-sm tracking-wide flex items-center gap-2"
                >
                  <FaInfoCircle /> About
                </Link>
                <Link 
                  to="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-accent-500 hover:text-primary-500 font-semibold py-2 uppercase text-sm tracking-wide flex items-center gap-2"
                >
                  <FaEnvelope /> Contact
                </Link>
                
                <div className="border-t border-neutral-200 pt-4 mt-2">
                  {user ? (
                    <Link 
                      to={getDashboardLink()} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md font-semibold uppercase text-sm tracking-wide"
                    >
                      <FaUser className="inline mr-2" /> Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-center text-accent-500 hover:text-primary-500 font-semibold py-2 mb-2 uppercase text-sm tracking-wide"
                      >
                        <FaSignInAlt className="inline mr-2" /> Login
                      </Link>
                      <Link 
                        to="/signup" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-center bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md font-semibold uppercase text-sm tracking-wide"
                      >
                        Sign Up
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
