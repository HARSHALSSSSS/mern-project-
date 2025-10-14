# Real Estate Property Management & Rental Platform - Backend

A comprehensive REST API backend for a Real Estate Property Management & Rental Platform with role-based access control for Tenants, Landlords, and Admins.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Tenant, Landlord, Admin)
- Password hashing with bcrypt
- Password reset functionality
- Email verification

### User Management
- User registration and login
- Profile management
- Admin user management (activate/deactivate users)
- Audit logging for all actions

### Property Management
- CRUD operations for properties
- Image upload support (Multer + Cloudinary)
- Advanced filtering (location, price, type, bedrooms, etc.)
- Property approval system (Admin moderation)
- Property views tracking

### Application System
- Tenant application submissions
- Landlord approval/rejection workflow
- Application status tracking
- Document uploads

### Contract Management
- Digital contract creation
- Contract lifecycle management
- Automatic payment generation
- Contract expiration notifications

### Payment System
- Rent payment tracking
- Stripe payment gateway integration
- Payment history and receipts
- Overdue payment detection
- Admin manual payment adjustments

### Maintenance Requests
- Tenant request submission
- Status tracking (Pending → In Progress → Completed)
- Priority levels
- Cost estimation and tracking
- Notes and communication

### Dashboard & Analytics
- Role-specific dashboards
- Occupancy rate analytics
- Rent collection trends
- Maintenance completion rate
- Revenue analytics
- Property performance metrics

### Notifications
- In-app notifications
- Email notifications (Nodemailer)
- Real-time notifications (Socket.io)
- Event-triggered notifications

### Utilities
- Automated cron jobs for:
  - Monthly rent payment generation
  - Rent payment reminders
  - Overdue payment detection
  - Contract expiration alerts

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/real_estate_db

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@realestate.com

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

FRONTEND_URL=http://localhost:5173

MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the application**

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `PUT /api/auth/update-password` - Update password

### User Routes
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/:id/status` - Update user status (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `POST /api/users/avatar` - Upload avatar

### Property Routes
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (Landlord)
- `PUT /api/properties/:id` - Update property (Landlord)
- `DELETE /api/properties/:id` - Delete property (Landlord)
- `GET /api/properties/landlord/my-properties` - Get landlord's properties
- `PUT /api/properties/:id/approval` - Approve/reject property (Admin)

### Application Routes
- `POST /api/applications` - Create application (Tenant)
- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id/status` - Update status (Landlord)
- `PUT /api/applications/:id/withdraw` - Withdraw application (Tenant)

### Payment Routes
- `POST /api/payments` - Create payment (Landlord/Admin)
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments/:id/process` - Process payment (Tenant)
- `PUT /api/payments/:id/confirm` - Confirm payment
- `PUT /api/payments/:id/status` - Update status (Admin)

### Contract Routes
- `POST /api/contracts` - Create contract (Landlord)
- `GET /api/contracts` - Get all contracts
- `GET /api/contracts/:id` - Get contract details
- `PUT /api/contracts/:id` - Update contract
- `PUT /api/contracts/:id/terminate` - Terminate contract

### Maintenance Routes
- `POST /api/maintenance` - Create request (Tenant)
- `GET /api/maintenance` - Get all requests
- `GET /api/maintenance/:id` - Get request details
- `PUT /api/maintenance/:id/status` - Update status (Landlord)
- `POST /api/maintenance/:id/notes` - Add note

### Dashboard Routes
- `GET /api/dashboard/tenant` - Tenant dashboard
- `GET /api/dashboard/landlord` - Landlord dashboard
- `GET /api/dashboard/admin` - Admin dashboard

### Analytics Routes
- `GET /api/analytics/occupancy` - Occupancy rate
- `GET /api/analytics/rent-collection` - Rent collection trend
- `GET /api/analytics/maintenance-completion` - Maintenance stats
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/property-performance` - Property performance

### Notification Routes
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications` - Delete all notifications

## 🔐 Authentication

Include JWT token in request headers:
```
Authorization: Bearer <your_jwt_token>
```

## 📦 Project Structure

```
backend/
├── config/
│   ├── database.js
│   ├── cloudinary.js
│   ├── email.js
│   └── multer.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── propertyController.js
│   ├── applicationController.js
│   ├── paymentController.js
│   ├── contractController.js
│   ├── maintenanceController.js
│   ├── notificationController.js
│   ├── dashboardController.js
│   └── analyticsController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── auditLog.js
├── models/
│   ├── User.js
│   ├── Property.js
│   ├── Application.js
│   ├── Contract.js
│   ├── Payment.js
│   ├── Maintenance.js
│   ├── Notification.js
│   └── AuditLog.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── propertyRoutes.js
│   ├── applicationRoutes.js
│   ├── paymentRoutes.js
│   ├── contractRoutes.js
│   ├── maintenanceRoutes.js
│   ├── notificationRoutes.js
│   ├── dashboardRoutes.js
│   └── analyticsRoutes.js
├── utils/
│   ├── cronJobs.js
│   └── notifications.js
├── uploads/
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## 🎯 Cron Jobs

The application runs the following automated tasks:

- **Daily 9:00 AM**: Send rent payment reminders (3 days before due)
- **Daily 1:00 AM**: Check and mark overdue payments
- **Daily 8:00 AM**: Send contract expiration notifications (30 days before)
- **Monthly 1st 12:00 AM**: Generate monthly rent payments for active contracts

## 🛡️ Security Features

- Helmet.js for security headers
- CORS protection
- Rate limiting
- Input validation with express-validator
- Password hashing with bcrypt
- JWT token authentication
- File upload restrictions

## 📧 Email Templates

The system sends automated emails for:
- Account verification
- Password reset
- Rent payment reminders
- Payment confirmations
- Contract expiration notices
- Application status updates

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📄 License

ISC

## 👥 Support

For support, email support@realestate.com

---

**Built with ❤️ using Node.js, Express, MongoDB, and Socket.io**
