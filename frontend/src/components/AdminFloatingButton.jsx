import { Link } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';

const AdminFloatingButton = ({ position = 'bottom-right' }) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-20 right-6',
    'top-left': 'top-20 left-6',
  };

  return (
    <Link
      to="/admin/login"
      className={`fixed ${positionClasses[position]} z-50 group`}
      title="Admin Login"
    >
      {/* Main Button */}
      <div className="relative">
        {/* Pulsing Animation Ring */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-800 rounded-full opacity-75 group-hover:opacity-100 blur animate-pulse"></div>
        
        {/* Button */}
        <div className="relative flex items-center gap-2 bg-gradient-to-br from-primary-800 to-primary-900 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 transform hover:scale-110 border-2 border-primary-600">
          <FaShieldAlt className="text-xl text-accent-400" />
          <span className="font-bold text-sm whitespace-nowrap hidden sm:inline">Admin</span>
        </div>

        {/* Tooltip for Mobile */}
        <div className="sm:hidden absolute -top-12 left-1/2 transform -translate-x-1/2 bg-primary-900 text-white px-3 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Admin Login
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-primary-900"></div>
        </div>
      </div>
    </Link>
  );
};

AdminFloatingButton.propTypes = {
  position: PropTypes.oneOf(['bottom-right', 'bottom-left', 'top-right', 'top-left'])
};

export default AdminFloatingButton;
