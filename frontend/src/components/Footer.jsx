import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBuilding } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary-800 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 p-2.5 rounded-xl shadow-btn">
                <FaBuilding className="text-white text-2xl" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">RealEstate</span>
              </div>
            </Link>
            <p className="text-neutral-300 mb-6 leading-relaxed">
              Your trusted partner in finding the perfect property for rent. We provide comprehensive management solutions for both tenants and landlords.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-700 hover:bg-accent-500 rounded-xl flex items-center justify-center transition-all duration-300 shadow">
                <FaFacebook className="text-lg" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-700 hover:bg-accent-500 rounded-xl flex items-center justify-center transition-all duration-300 shadow">
                <FaTwitter className="text-lg" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-700 hover:bg-accent-500 rounded-xl flex items-center justify-center transition-all duration-300 shadow">
                <FaLinkedin className="text-lg" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-700 hover:bg-accent-500 rounded-xl flex items-center justify-center transition-all duration-300 shadow">
                <FaInstagram className="text-lg" />
              </a>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-accent-400 mt-1 flex-shrink-0" />
                <span className="text-neutral-300">
                  121 King Street, <br />
                  New York, NY 10001, USA
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-accent-400 flex-shrink-0" />
                <a href="tel:+15551234567" className="text-neutral-300 hover:text-accent-400 transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-accent-400 flex-shrink-0" />
                <a href="mailto:support@realestate.com" className="text-neutral-300 hover:text-accent-400 transition-colors">
                  support@realestate.com
                </a>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-neutral-300 hover:text-accent-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  → Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-neutral-300 hover:text-accent-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  → Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-300 hover:text-accent-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  → About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-300 hover:text-accent-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  → Contact
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-neutral-300 hover:text-accent-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  → Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Newsletter</h4>
            <p className="text-neutral-300 mb-4">
              Subscribe to get our latest updates and offers.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-primary-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 border border-primary-600 placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-6 py-3 rounded-xl font-semibold shadow-btn transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-primary-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-300 text-sm text-center md:text-left">
              © {new Date().getFullYear()} RealEstate. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-neutral-300 hover:text-accent-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-neutral-300 hover:text-accent-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/faq" className="text-neutral-300 hover:text-accent-400 text-sm transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
