import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import PropertyListings from './pages/public/PropertyListings';
import PropertyDetails from './pages/public/PropertyDetails';

// Auth Pages
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Tenant Pages
import TenantDashboard from './pages/tenant/Dashboard';
import MyApplications from './pages/tenant/MyApplications';
import MyPayments from './pages/tenant/MyPayments';
import MyContracts from './pages/tenant/MyContracts';
import TenantMaintenance from './pages/tenant/Maintenance';

// Landlord Pages
import LandlordDashboard from './pages/landlord/Dashboard';
import MyProperties from './pages/landlord/MyProperties';
import AddProperty from './pages/landlord/AddProperty';
import EditProperty from './pages/landlord/EditProperty';
import TenantApplications from './pages/landlord/TenantApplications';
import RentManagement from './pages/landlord/RentManagement';
import LandlordMaintenance from './pages/landlord/Maintenance';
import LandlordContracts from './pages/landlord/Contracts';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import PropertyApproval from './pages/admin/PropertyApproval';
import PaymentMonitoring from './pages/admin/PaymentMonitoring';
import Analytics from './pages/admin/Analytics';

// Shared Pages
import Notifications from './pages/shared/Notifications';
import Profile from './pages/shared/Profile';

// Components
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/properties" element={<PropertyListings />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Tenant Routes */}
        <Route element={<PrivateRoute><RoleRoute allowedRoles={['tenant']} /></PrivateRoute>}>
          <Route element={<DashboardLayout />}>
            <Route path="/tenant/dashboard" element={<TenantDashboard />} />
            <Route path="/tenant/applications" element={<MyApplications />} />
            <Route path="/tenant/payments" element={<MyPayments />} />
            <Route path="/tenant/contracts" element={<MyContracts />} />
            <Route path="/tenant/maintenance" element={<TenantMaintenance />} />
            <Route path="/tenant/notifications" element={<Notifications />} />
            <Route path="/tenant/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Landlord Routes */}
        <Route element={<PrivateRoute><RoleRoute allowedRoles={['landlord']} /></PrivateRoute>}>
          <Route element={<DashboardLayout />}>
            <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
            <Route path="/landlord/properties" element={<MyProperties />} />
            <Route path="/landlord/properties/add" element={<AddProperty />} />
            <Route path="/landlord/properties/edit/:id" element={<EditProperty />} />
            <Route path="/landlord/applications" element={<TenantApplications />} />
            <Route path="/landlord/contracts" element={<LandlordContracts />} />
            <Route path="/landlord/rent" element={<RentManagement />} />
            <Route path="/landlord/maintenance" element={<LandlordMaintenance />} />
            <Route path="/landlord/notifications" element={<Notifications />} />
            <Route path="/landlord/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute><RoleRoute allowedRoles={['admin']} /></PrivateRoute>}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/properties" element={<PropertyApproval />} />
            <Route path="/admin/payments" element={<PaymentMonitoring />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
