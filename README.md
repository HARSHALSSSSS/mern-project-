# 🏡 Real Estate Property Management & Rental Platform

A comprehensive full-stack property management and rental platform with separate panels for **Tenants**, **Landlords**, and **Admins**. Built with modern technologies including React, Node.js, Express, MongoDB, and Socket.io.

## 📸 Screenshots

[Add screenshots here once UI is implemented]

## ✨ Features

### 🌐 Public Features
- Browse available properties with advanced filters
- Detailed property pages with image galleries
- Location-based search
- Responsive design for all devices

### 👥 User Roles

#### 🏠 Tenant Features
- Apply for rental properties
- Track application status
- Make rent payments online (Stripe integration)
- Submit maintenance requests
- View rental contracts
- Real-time notifications
- Payment history and receipts

#### 🏢 Landlord Features
- List and manage properties (CRUD)
- Upload property images
- Review and approve/reject tenant applications
- Track rent payments
- Manage maintenance requests
- View analytics and reports
- Property performance metrics

#### ⚙️ Admin Features
- Approve/reject property listings
- Manage users (activate/deactivate accounts)
- Monitor all payments
- System-wide analytics
- Audit logs
- User management dashboard

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.io Client** - Real-time notifications
- **React Toastify** - Toast notifications
- **Chart.js** - Data visualization
- **Stripe** - Payment processing
- **React Hook Form** - Form handling
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **Socket.io** - Real-time communication
- **Node-cron** - Scheduled tasks
- **Stripe** - Payment gateway
- **Helmet** - Security headers
- **Morgan** - Logging

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**
- **Cloudinary Account** (for image uploads)
- **Stripe Account** (for payments)
- **Gmail/SMTP** (for emails)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pp2
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/real_estate_db
JWT_SECRET=your_super_secret_jwt_key
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

Start backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
VITE_SOCKET_URL=http://localhost:5000
```

Start frontend development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Database Setup

Ensure MongoDB is running:

```bash
mongod
```

The application will automatically create the database and collections on first run.

## 📁 Project Structure

```
pp2/
├── backend/                  # Node.js backend
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── uploads/             # Uploaded files
│   ├── server.js            # Entry point
│   └── package.json
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── layouts/         # Layout components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # Redux store & slices
│   │   ├── services/        # API services
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🔑 Default Users

After setting up, you can create test users:

**Admin:**
- Email: admin@example.com
- Password: admin123
- Role: admin

**Landlord:**
- Email: landlord@example.com
- Password: landlord123
- Role: landlord

**Tenant:**
- Email: tenant@example.com
- Password: tenant123
- Role: tenant

## 🔐 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user
- `POST /auth/forgot-password` - Request password reset
- `PUT /auth/reset-password/:token` - Reset password

### Property Endpoints
- `GET /properties` - Get all properties (with filters)
- `GET /properties/:id` - Get property by ID
- `POST /properties` - Create property (Landlord)
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property

[See full API documentation in backend/README.md]

## 🔄 Automated Cron Jobs

The system runs the following scheduled tasks:

- **Daily 9:00 AM**: Send rent payment reminders
- **Daily 1:00 AM**: Check and mark overdue payments
- **Daily 8:00 AM**: Send contract expiration notices
- **Monthly 1st 12:00 AM**: Generate monthly rent payments

## 📧 Email Notifications

Automated emails are sent for:
- Account verification
- Password reset
- Rent payment reminders
- Payment confirmations
- Application status updates
- Contract expiration alerts
- Maintenance updates

## 🔔 Real-time Notifications

Socket.io powers real-time notifications for:
- New rental applications
- Application approvals/rejections
- Payment confirmations
- Maintenance request updates
- System announcements

## 🎨 Theme Integration

This project is designed to integrate with:
- **Frontend Public/User**: Consza theme (https://thewebmax.org/consza/)
- **Backend/Admin**: DreamsTech CRMS theme (https://crms.dreamstechnologies.com/html/template/)

[Note: Themes need to be downloaded and converted to React components]

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables on your hosting platform
2. Build command: `npm install`
3. Start command: `npm start`

### Frontend Deployment (Vercel/Netlify)

1. Build command: `npm run build`
2. Output directory: `dist`
3. Set environment variables

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env

2. **CORS Error**
   - Verify FRONTEND_URL in backend .env
   - Check backend CORS configuration

3. **File Upload Error**
   - Verify Cloudinary credentials
   - Check file size limits

4. **Email Not Sending**
   - Enable "Less secure app access" in Gmail
   - Use App Password instead of account password

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Authors

[Your Name]

## 🙏 Acknowledgments

- Consza Theme by TheWebMax
- DreamsTech CRMS Theme
- All open-source contributors

## 📞 Support

For support, email support@realestate.com or open an issue in the repository.

---

**Built with ❤️ using MERN Stack**
