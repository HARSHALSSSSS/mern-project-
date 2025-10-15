import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHome,
  FaPaperPlane
} from 'react-icons/fa';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-accent-500 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <FaHome className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold">Consza</h2>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner in finding the perfect property. We make real estate simple, transparent, and accessible for everyone.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent-600 hover:bg-primary-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent-600 hover:bg-primary-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <FaTwitter />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent-600 hover:bg-primary-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <FaLinkedinIn />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent-600 hover:bg-primary-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-primary-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/properties" 
                  className="text-gray-300 hover:text-primary-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Properties
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-primary-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-primary-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/tenant/dashboard" 
                  className="text-gray-300 hover:text-primary-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Tenant Portal
                </Link>
              </li>
              <li>
                <Link 
                  to="/landlord/dashboard" 
                  className="text-gray-300 hover:text-primary-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Landlord Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wide">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300">
                <FaMapMarkerAlt className="text-primary-500 text-xl mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Address</p>
                  <p className="text-sm">123 Main Street, City</p>
                  <p className="text-sm">State, ZIP 12345</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <FaPhoneAlt className="text-primary-500 text-xl mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <a href="tel:+1234567890" className="text-sm hover:text-primary-500 transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <FaEnvelope className="text-primary-500 text-xl mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <a href="mailto:info@consza.com" className="text-sm hover:text-primary-500 transition-colors">
                    info@consza.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wide">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to get the latest property updates and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-accent-600 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-md uppercase tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
              >
                <FaPaperPlane />
                Subscribe
              </button>
              {subscribed && (
                <p className="text-green-400 text-sm text-center animate-fade-in">
                  ✓ Successfully subscribed!
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Consza Real Estate. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-500 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-primary-500 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
