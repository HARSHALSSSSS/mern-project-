# Real Estate Property Management & Rental Platform - Frontend

A comprehensive React + Vite frontend application for a Real Estate Property Management & Rental Platform with separate interfaces for Tenants, Landlords, and Admins.

## 🚀 Features

### Public Pages
- **Home Page**: Hero section, property search, featured listings
- **Property Listings**: Browse and filter available properties
- **Property Details**: Detailed property information with application option
- **About Us**: Company information
- **Contact**: Contact form

### Authentication
- User registration (Tenant/Landlord)
- Login with JWT authentication
- Forgot password & reset functionality
- Protected routes with role-based access

### Tenant Dashboard
- Overview of active rentals and applications
- Apply for properties
- Payment management & history
- Contract viewing
- Maintenance request submission
- Real-time notifications

### Landlord Dashboard
- Property CRUD operations with image upload
- View and manage tenant applications
- Rent collection tracking
- Maintenance request management
- Analytics and reports

### Admin Dashboard
- User management (activate/deactivate)
- Property approval system
- Payment monitoring
- System-wide analytics
- Comprehensive reporting

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## 🛠️ Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The application will start on `http://localhost:5173`

## 📦 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   ├── DashboardNavbar.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── RoleRoute.jsx
│   ├── layouts/             # Layout components
│   │   ├── PublicLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── pages/               # Page components
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── PropertyListings.jsx
│   │   │   └── PropertyDetails.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── tenant/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyApplications.jsx
│   │   │   ├── MyPayments.jsx
│   │   │   ├── MyContracts.jsx
│   │   │   └── Maintenance.jsx
│   │   ├── landlord/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyProperties.jsx
│   │   │   ├── AddProperty.jsx
│   │   │   ├── EditProperty.jsx
│   │   │   ├── TenantApplications.jsx
│   │   │   ├── RentManagement.jsx
│   │   │   └── Maintenance.jsx
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── PropertyApproval.jsx
│   │   │   ├── PaymentMonitoring.jsx
│   │   │   └── Analytics.jsx
│   │   └── shared/
│   │       ├── Notifications.jsx
│   │       └── Profile.jsx
│   ├── redux/               # State management
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── propertySlice.js
│   │       ├── applicationSlice.js
│   │       ├── paymentSlice.js
│   │       ├── maintenanceSlice.js
│   │       ├── notificationSlice.js
│   │       └── dashboardSlice.js
│   ├── services/            # API services
│   │   ├── axios.js
│   │   ├── authService.js
│   │   ├── propertyService.js
│   │   ├── dashboardService.js
│   │   └── notificationService.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🎨 Styling

This project uses **Tailwind CSS** for styling with custom utility classes:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-outline` - Outlined button style
- `.input-field` - Input field style
- `.card` - Card container style
- `.badge-*` - Badge styles (success, warning, danger, info)

## 🔐 Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is automatically attached to API requests
4. Protected routes check for valid token
5. Role-based routes verify user permissions
6. Automatic redirect to login on token expiration

## 📡 State Management

Using **Redux Toolkit** for global state management:

- **authSlice**: User authentication state
- **propertySlice**: Property listings and management
- **applicationSlice**: Rental applications
- **paymentSlice**: Payment history and transactions
- **maintenanceSlice**: Maintenance requests
- **notificationSlice**: Real-time notifications
- **dashboardSlice**: Dashboard statistics

## 🔌 API Integration

All API calls use Axios with interceptors for:
- Automatic token attachment
- Global error handling
- Request/response transformation
- 401 redirect to login

## 🎯 Key Features Implementation

### Real-time Notifications
Socket.io client for instant updates on:
- New applications
- Payment confirmations
- Maintenance status updates
- Contract notifications

### Image Upload
React Dropzone for property image uploads with:
- Multiple file support
- Preview functionality
- Size validation
- Format validation

### Payment Processing
Stripe integration for secure payments:
- Payment intent creation
- Card element integration
- Payment confirmation
- Receipt generation

### Data Visualization
Chart.js for analytics:
- Occupancy rate charts
- Revenue trends
- Payment collection graphs
- Maintenance completion rates

## 🚀 Building for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

## 📱 Responsive Design

Fully responsive design that works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🧪 Testing

```bash
npm run test
```

## 📄 Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
VITE_SOCKET_URL=http://localhost:5000
```

## 🔧 Development Tips

1. **Hot Module Replacement**: Vite provides instant HMR for fast development
2. **Redux DevTools**: Install browser extension for state debugging
3. **React DevTools**: Use for component inspection
4. **Network Tab**: Monitor API calls and responses

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

ISC

## 👥 Support

For support, email support@realestate.com

---

**Built with ❤️ using React, Vite, Redux Toolkit, and Tailwind CSS**
