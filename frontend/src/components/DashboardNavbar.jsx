import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaBell, FaUser, FaSignOutAlt, FaSearch, FaCog, FaQuestionCircle, FaChevronDown, FaBars } from 'react-icons/fa';
import { logout } from '../redux/slices/authSlice';
import { useState } from 'react';

const DashboardNavbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const notificationLink = user ? `/${user.role}/notifications` : '/';
  const profileLink = user ? `/${user.role}/profile` : '/';

  // Get page title from current route
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav className="bg-white shadow-card px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
      <div className="flex justify-between items-center">
        {/* Left: Mobile Menu & Page Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            <FaBars className="text-primary-700 text-xl" />
          </button>
          
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-primary-700">
              {getPageTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5 sm:mt-1 hidden sm:block">
              Welcome back, {user?.name}!
            </p>
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-neutral-100 rounded-xl px-4 py-2.5">
            <FaSearch className="text-neutral-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-primary-700 w-64 placeholder:text-neutral-400"
            />
          </div>

          {/* Help Icon */}
          <button className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors" title="Help">
            <FaQuestionCircle className="text-neutral-600 text-xl" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              <FaBell className="text-neutral-600 text-xl" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-card border border-neutral-200 z-50">
                <div className="p-4 border-b border-neutral-200">
                  <h3 className="font-bold text-primary-700">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {unreadCount > 0 ? (
                    <div className="p-4">
                      <p className="text-neutral-600 text-sm">You have {unreadCount} unread notifications</p>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <FaBell className="mx-auto text-4xl text-neutral-300 mb-2" />
                      <p className="text-neutral-500 text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-neutral-200">
                  <Link
                    to={notificationLink}
                    className="text-accent-600 hover:text-accent-700 text-sm font-semibold block text-center"
                    onClick={() => setShowNotifications(false)}
                  >
                    View All Notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 hover:bg-neutral-100 rounded-xl px-3 py-2 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white font-bold shadow-btn">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-primary-700">{user?.name}</p>
                <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
              </div>
              <FaChevronDown className="text-neutral-400 text-sm" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-card border border-neutral-200 z-50">
                <div className="p-3 border-b border-neutral-200">
                  <p className="font-bold text-primary-700">{user?.name}</p>
                  <p className="text-sm text-neutral-500">{user?.email}</p>
                </div>
                <div className="py-2">
                  <Link
                    to={profileLink}
                    className="flex items-center space-x-3 px-4 py-2 text-primary-700 hover:bg-neutral-100 transition-colors font-medium"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaUser className="text-neutral-500" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to={`/${user?.role}/profile`}
                    className="flex items-center space-x-3 px-4 py-2 text-primary-700 hover:bg-neutral-100 transition-colors font-medium"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaCog className="text-neutral-500" />
                    <span>Settings</span>
                  </Link>
                </div>
                <div className="border-t border-neutral-200 py-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-3 px-4 py-2 text-error-500 hover:bg-error-100 transition-colors w-full font-medium"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

DashboardNavbar.propTypes = {
  onMenuClick: PropTypes.func,
};

export default DashboardNavbar;
