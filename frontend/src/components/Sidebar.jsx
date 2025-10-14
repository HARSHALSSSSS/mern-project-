import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  FaTachometerAlt, FaBuilding, FaFileAlt, FaDollarSign, 
  FaWrench, FaBell, FaUser, FaUsers, FaChartBar, FaCheckCircle,
  FaCog, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaHome, FaTimes
} from 'react-icons/fa';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);

  const getTenantLinks = () => [
    { path: '/tenant/dashboard', icon: FaTachometerAlt, label: 'Dashboard', badge: null },
    { path: '/tenant/applications', icon: FaFileAlt, label: 'My Applications', badge: null },
    { path: '/tenant/payments', icon: FaDollarSign, label: 'Payments', badge: null },
    { path: '/tenant/contracts', icon: FaFileAlt, label: 'Contracts', badge: null },
    { path: '/tenant/maintenance', icon: FaWrench, label: 'Maintenance', badge: null },
    { path: '/tenant/notifications', icon: FaBell, label: 'Notifications', badge: 3 },
    { path: '/tenant/profile', icon: FaUser, label: 'Profile', badge: null },
  ];

  const getLandlordLinks = () => [
    { path: '/landlord/dashboard', icon: FaTachometerAlt, label: 'Dashboard', badge: null },
    { path: '/landlord/properties', icon: FaBuilding, label: 'My Properties', badge: null },
    { path: '/landlord/applications', icon: FaFileAlt, label: 'Applications', badge: 5 },
    { path: '/landlord/rent', icon: FaDollarSign, label: 'Rent Management', badge: null },
    { path: '/landlord/maintenance', icon: FaWrench, label: 'Maintenance', badge: 2 },
    { path: '/landlord/notifications', icon: FaBell, label: 'Notifications', badge: 7 },
    { path: '/landlord/profile', icon: FaUser, label: 'Profile', badge: null },
  ];

  const getAdminLinks = () => [
    { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard', badge: null },
    { path: '/admin/users', icon: FaUsers, label: 'User Management', badge: null },
    { path: '/admin/properties', icon: FaBuilding, label: 'Property Approval', badge: 8 },
    { path: '/admin/payments', icon: FaDollarSign, label: 'Payment Monitoring', badge: null },
    { path: '/admin/analytics', icon: FaChartBar, label: 'Analytics', badge: null },
    { path: '/admin/notifications', icon: FaBell, label: 'Notifications', badge: 12 },
    { path: '/admin/profile', icon: FaUser, label: 'Profile', badge: null },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'tenant':
        return getTenantLinks();
      case 'landlord':
        return getLandlordLinks();
      case 'admin':
        return getAdminLinks();
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-primary-800 via-primary-700 to-primary-800 text-white shadow-card transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary-600">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-accent-500 to-accent-600 p-2.5 rounded-xl shadow-btn">
              <FaBuilding className="text-white text-xl" />
            </div>
            <div>
              <span className="text-xl font-bold">RealEstate</span>
              <p className="text-xs text-neutral-300 capitalize">{user?.role} Panel</p>
            </div>
          </Link>
        )}
        <div className="flex items-center gap-2">
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-primary-600 rounded-xl transition-colors"
          >
            <FaTimes />
          </button>
          {/* Desktop Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-2 hover:bg-primary-600 rounded-xl transition-colors"
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 overflow-y-auto h-[calc(100vh-180px)]">
        <ul className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-btn'
                      : 'text-neutral-200 hover:bg-primary-600 hover:text-white'
                  }`}
                  title={collapsed ? link.label : ''}
                >
                  <Icon className={`text-xl ${collapsed ? 'mx-auto' : ''}`} />
                  {!collapsed && (
                    <>
                      <span className="font-semibold flex-1">{link.label}</span>
                      {link.badge && (
                        <span className="bg-error-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                          {link.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && link.badge && (
                    <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-4 border-t border-primary-600"></div>

        {/* Quick Links */}
        <ul className="space-y-1">
          <li>
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-neutral-200 hover:bg-primary-600 hover:text-white transition-all duration-200"
              title={collapsed ? 'Home' : ''}
            >
              <FaHome className={`text-xl ${collapsed ? 'mx-auto' : ''}`} />
              {!collapsed && <span className="font-semibold">Back to Home</span>}
            </Link>
          </li>
          <li>
            <Link
              to={`/${user?.role}/profile`}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-neutral-200 hover:bg-primary-600 hover:text-white transition-all duration-200"
              title={collapsed ? 'Settings' : ''}
            >
              <FaCog className={`text-xl ${collapsed ? 'mx-auto' : ''}`} />
              {!collapsed && <span className="font-semibold">Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Info Footer */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-primary-900 border-t border-primary-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white font-bold shadow-btn">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-neutral-300 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

Sidebar.propTypes = {
  onClose: PropTypes.func,
};

export default Sidebar;
