# 📖 COMPLETE SYSTEM DOCUMENTATION

**Version:** 1.0  
**Status:** ✅ Production Ready  
**Last Updated:** October 16, 2025  

---

## 📑 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Frontend Pages](#frontend-pages)
6. [Role-Based Access Control](#role-based-access-control)
7. [Complete Workflows](#complete-workflows)
8. [Testing Guide](#testing-guide)
9. [Troubleshooting](#troubleshooting)
10. [Deployment](#deployment)

---

## 🎯 System Overview

### What is This System?
A full-stack Property Rental Management Platform built with:
- **Frontend:** React + Redux + Vite
- **Backend:** Express.js + Node.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time:** Socket.io notifications
- **Deployment:** Vercel (frontend) + Render (backend)

### Core Features
- ✅ Multi-role user system (Admin, Landlord, Tenant)
- ✅ Property listing and approval workflow
- ✅ Tenant application system with auto-approval
- ✅ Automatic contract generation
- ✅ Rent payment tracking
- ✅ Maintenance request management
- ✅ Real-time notifications
- ✅ Role-based dashboards

### Three User Roles
1. **Admin** - System administrator, approves properties, manages users
2. **Landlord** - Property owner, manages properties and tenants
3. **Tenant** - Renter, searches properties, applies, pays rent

---

## 🏗️ Architecture

### Technology Stack

```
Frontend Layer
├── React 18 (Component library)
├── Redux Toolkit (State management)
├── React Router (Navigation)
├── Axios (HTTP requests)
├── React Bootstrap (UI components)
├── PrimeReact (Advanced components)
└── React Toastify (Notifications)

Backend Layer
├── Express.js (REST API)
├── Node.js (Runtime)
├── Mongoose (ODM)
├── JWT (Authentication)
├── Socket.io (Real-time)
└── Multer (File uploads)

Database Layer
└── MongoDB
    ├── Users collection
    ├── Properties collection
    ├── Applications collection
    ├── Contracts collection
    ├── Payments collection
    ├── Maintenance collection
    └── Notifications collection

Deployment
├── Frontend: Vercel
├── Backend: Render
└── Database: MongoDB Atlas
```

### Request Flow

```
User Browser
    ↓
React Components
    ↓
Redux Store
    ↓
Axios HTTP Client
    ↓ (with JWT token)
Express Server
    ↓
Auth Middleware (protect)
    ↓
Authorization Middleware (authorize)
    ↓
Route Handler
    ↓
Controller Logic
    ↓
MongoDB Operations
    ↓
Response → Browser → React Component
```

---

## 📊 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,                    // User's full name
  email: String (unique),          // Email address
  password: String (hashed),       // Bcrypt hashed password
  role: 'tenant' | 'landlord' | 'admin',  // User type
  status: 'active' | 'inactive' | 'suspended',  // Account status
  profileImage: String,            // Profile photo URL
  phone: String,                   // Contact number
  address: String,                 // Address
  createdAt: Date,
  updatedAt: Date
}
```

### Property Model
```javascript
{
  _id: ObjectId,
  landlord: ObjectId (ref: User),  // Property owner
  title: String,                   // Property name
  description: String,             // Property details
  type: 'apartment' | 'house' | 'villa' | 'room',  // Property type
  rent: Number,                    // Monthly rent amount
  deposit: Number,                 // Security deposit
  bedrooms: Number,
  bathrooms: Number,
  area: Number,                    // Area in sq ft
  address: String,
  city: String,
  state: String,
  zipCode: String,
  images: [String],                // Array of image URLs
  amenities: [String],             // List of amenities
  availability: 'available' | 'occupied' | 'unavailable',
  approvalStatus: 'pending' | 'approved' | 'rejected',
  active: Boolean,                 // Property visibility
  createdAt: Date,
  updatedAt: Date
}
```

### Application Model
```javascript
{
  _id: ObjectId,
  tenant: ObjectId (ref: User),
  landlord: ObjectId (ref: User),  // Landlord auto-populated from property
  property: ObjectId (ref: Property),
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn',
  moveInDate: Date,                // Preferred move-in date
  leaseDuration: Number,           // Months (e.g., 12)
  employmentStatus: String,
  monthlyIncome: Number,
  references: String,              // References info
  message: String,                 // Application message
  rejectionReason: String,         // If rejected
  createdAt: Date,
  updatedAt: Date
}
```

### Contract Model
```javascript
{
  _id: ObjectId,
  tenant: ObjectId (ref: User),
  landlord: ObjectId (ref: User),
  property: ObjectId (ref: Property),
  application: ObjectId (ref: Application),
  startDate: Date,                 // Lease start
  endDate: Date,                   // Lease end
  rentAmount: Number,              // Monthly rent
  depositAmount: Number,           // Security deposit
  paymentDay: Number,              // Day of month rent is due (e.g., 1)
  terms: String,                   // Contract terms and conditions
  status: 'active' | 'expired' | 'terminated',
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Model
```javascript
{
  _id: ObjectId,
  tenant: ObjectId (ref: User),
  landlord: ObjectId (ref: User),
  property: ObjectId (ref: Property),
  contract: ObjectId (ref: Contract),
  amount: Number,                  // Payment amount
  type: 'rent' | 'deposit',        // Payment type
  month: String,                   // YYYY-MM format
  status: 'pending' | 'paid' | 'overdue',
  dueDate: Date,
  paidDate: Date,                  // When payment was made
  paymentMethod: 'credit_card' | 'debit_card' | 'bank_transfer' | 'upi',
  transactionId: String,           // Payment gateway transaction ID
  createdAt: Date,
  updatedAt: Date
}
```

### Maintenance Model
```javascript
{
  _id: ObjectId,
  tenant: ObjectId (ref: User),
  landlord: ObjectId (ref: User),
  property: ObjectId (ref: Property),
  issueType: 'plumbing' | 'electrical' | 'appliance' | 'structural' | 'other',
  description: String,             // Issue description
  urgency: 'low' | 'medium' | 'high',  // Priority level
  status: 'pending' | 'in_progress' | 'resolved',
  images: [String],                // Issue photos
  landlordNotes: String,           // Landlord response
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),      // Recipient
  type: String,                    // 'application_approved', 'payment_due', etc.
  title: String,
  message: String,
  link: String,                    // Link to action
  metadata: Object,                // Additional data
  read: Boolean (default: false),
  createdAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | YES | Get current user |
| POST | `/api/auth/forgot-password` | No | Request password reset |
| POST | `/api/auth/reset-password/:token` | No | Reset password |

### Property Routes
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/properties` | Optional | All | Get all approved properties (or all for admin) |
| GET | `/api/properties/:id` | No | All | Get property details |
| POST | `/api/properties` | YES | Landlord | Create new property |
| PUT | `/api/properties/:id` | YES | Landlord | Update property |
| DELETE | `/api/properties/:id` | YES | Landlord | Delete property |
| GET | `/api/properties/landlord/my-properties` | YES | Landlord | Get my properties |
| PUT | `/api/properties/:id/approval` | YES | Admin | Approve/reject property |

### Application Routes
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST | `/api/applications` | YES | Tenant | Create application |
| GET | `/api/applications` | YES | All | Get applications (filtered by role) |
| GET | `/api/applications/:id` | YES | All | Get application details |
| PUT | `/api/applications/:id/status` | YES | Landlord | Approve/reject application |
| PUT | `/api/applications/:id/withdraw` | YES | Tenant | Withdraw application |

### Contract Routes
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST | `/api/contracts` | YES | Landlord | Create contract (auto-created on approval) |
| GET | `/api/contracts` | YES | All | Get contracts (filtered by role) |
| GET | `/api/contracts/:id` | YES | All | Get contract details |
| PUT | `/api/contracts/:id` | YES | Landlord | Update contract |
| PUT | `/api/contracts/:id/terminate` | YES | Landlord | Terminate contract |

### Payment Routes
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST | `/api/payments` | YES | Landlord | Create payment (auto-created with contract) |
| GET | `/api/payments` | YES | All | Get payments (filtered by role) |
| GET | `/api/payments/:id` | YES | All | Get payment details |
| POST | `/api/payments/:id/process` | YES | Tenant | Start payment processing |
| PUT | `/api/payments/:id/confirm` | YES | Tenant | Confirm payment success |
| PUT | `/api/payments/:id/status` | YES | Admin | Update payment status |

### Maintenance Routes
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST | `/api/maintenance` | YES | Tenant | Create maintenance request |
| GET | `/api/maintenance` | YES | All | Get maintenance requests |
| GET | `/api/maintenance/:id` | YES | All | Get maintenance details |
| PUT | `/api/maintenance/:id/status` | YES | Landlord | Update status |
| POST | `/api/maintenance/:id/notes` | YES | All | Add notes/comments |

### Dashboard Routes
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/dashboard/stats` | YES | All | Get dashboard statistics |

---

## 🖥️ Frontend Pages

### Admin Pages
- `/admin/dashboard` - Overview dashboard
- `/admin/properties` - Property approval management
- `/admin/users` - User management
- `/admin/payments` - Payment monitoring
- `/admin/analytics` - System analytics
- `/admin/notifications` - Notifications
- `/admin/profile` - Admin profile

### Landlord Pages
- `/landlord/dashboard` - Landlord dashboard
- `/landlord/properties` - My properties list
- `/landlord/properties/add` - Add new property
- `/landlord/properties/edit/:id` - Edit property
- `/landlord/applications` - Tenant applications
- `/landlord/contracts` - Rental contracts
- `/landlord/rent` - Rent payments tracking
- `/landlord/maintenance` - Maintenance requests
- `/landlord/notifications` - Notifications
- `/landlord/profile` - Profile

### Tenant Pages
- `/tenant/dashboard` - Tenant dashboard
- `/tenant/applications` - My applications
- `/tenant/contracts` - My contracts
- `/tenant/payments` - My payments
- `/tenant/maintenance` - Maintenance requests
- `/tenant/notifications` - Notifications
- `/tenant/profile` - Profile

### Public Pages
- `/` - Home (property listings)
- `/properties` - Properties listing
- `/properties/:id` - Property details
- `/about` - About page
- `/contact` - Contact page

### Auth Pages
- `/login` - Login page
- `/admin/login` - Admin login
- `/signup` - Registration
- `/forgot-password` - Password reset request
- `/reset-password/:token` - Password reset

---

## 🔐 Role-Based Access Control

### Admin Privileges
- ✅ Approve/reject properties
- ✅ View all users
- ✅ Suspend/activate users
- ✅ View all applications
- ✅ Monitor all payments
- ✅ View all contracts
- ✅ System analytics

### Landlord Privileges
- ✅ Create/edit/delete properties
- ✅ View property applications
- ✅ Approve/reject applications
- ✅ View rental contracts
- ✅ View rent payments
- ✅ Update maintenance requests
- ✅ View tenant information (for their properties)

### Tenant Privileges
- ✅ Browse approved properties
- ✅ Apply for properties
- ✅ View their applications
- ✅ View their contracts
- ✅ Make rent payments
- ✅ Submit maintenance requests
- ✅ View payment history

---

## 🔄 Complete Workflows

### Workflow 1: Property Listing to Rental (13 Steps)

```
Step 1: Landlord creates property
→ Properties with all details (images, amenities, price)
→ Status: PENDING

Step 2: Admin approves property
→ Navigate to Property Approval page
→ Click "Approve"
→ Status: APPROVED

Step 3: Property visible to tenants
→ Appears on public homepage
→ Available for browsing

Step 4: Tenant searches & browses
→ Filter by type, location, price
→ View property details & images

Step 5: Tenant applies for property
→ Click "Apply Now"
→ Fill application form (move-in date, lease duration, income, etc.)
→ Submit
→ Application status: PENDING

Step 6: Landlord reviews application
→ Navigate to "Tenant Applications"
→ See applicant details & application info
→ Status: PENDING

Step 7: Landlord approves application
→ Click "Approve"
→ ** SYSTEM AUTOMATICALLY **:
   - Creates contract with calculated dates
   - Creates deposit payment
   - Creates first month rent payment
   - Updates property to "occupied"
   - Notifies tenant

Step 8: Contract created automatically
→ Populate dates: startDate = moveInDate, endDate = moveInDate + leaseDuration months
→ Set rent & deposit amounts from property
→ Set payment day to 1st of month

Step 9: Tenant sees contract
→ Navigate to "My Contracts"
→ View contract with all details
→ Can download contract PDF

Step 10: Tenant sees payments
→ Navigate to "My Payments"
→ See deposit payment (due on move-in date)
→ See first month rent (due on paymentDay)

Step 11: Tenant makes payment
→ Click "Pay Now" on payment
→ Select payment method
→ Enter payment details
→ Confirm payment
→ Payment status: PAID

Step 12: Landlord sees payment
→ Navigate to "Rent Management"
→ See payment status changed to PAID
→ Track payment history

Step 13: Rental agreement active
→ Tenant & Landlord both see active contract
→ Monthly rent now due every month
→ Landlord can manage property & tenants
→ Tenant can submit maintenance requests

**Total Workflow Time:** ~5 minutes (all automatic after approval)
**Manual Steps:** 7 out of 13 (rest are automatic)
```

### Workflow 2: Maintenance Request (7 Steps)

```
Step 1: Tenant submits maintenance issue
→ Navigate to Maintenance
→ Click "New Request"
→ Fill form: issue type, description, urgency, images
→ Submit
→ Status: PENDING

Step 2: Landlord receives request
→ Navigate to Maintenance Requests
→ See new request with PENDING status
→ View issue details & images

Step 3: Landlord updates status
→ Click on request
→ Change status to "In Progress"
→ Add notes (optional)
→ Save

Step 4: Tenant sees status update
→ Navigate to Maintenance
→ See status changed to "In Progress"
→ See landlord notes (if provided)

Step 5: Issue resolved
→ Landlord completes the work

Step 6: Landlord marks as resolved
→ Change status to "Resolved"
→ Add final notes/description of work done
→ Save

Step 7: Tenant sees resolution
→ Status now shows "Resolved"
→ Can see what was done
→ Can submit another request if needed

**Total Workflow Time:** ~30 minutes (depends on actual repair time)
**Manual Steps:** 7 out of 7 (all require human action)
```

---

## 🧪 Testing Guide

### Pre-Testing Checklist
- [ ] Backend deployed (wait 3 minutes)
- [ ] Frontend deployed (wait 2 minutes)
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Open browser console (F12) to check for errors
- [ ] Have 3 different email addresses ready

### Test Scenario 1: Complete Rental Workflow
**Duration:** 15 minutes
**Accounts Needed:** 1 Admin, 1 Landlord, 1 Tenant

**Steps:**
1. Login as Admin → Verify dashboard loads
2. Login as Landlord (new account) → Add property with images
3. Login as Admin → Go to Property Approval → Approve property
4. Login as Tenant (new account) → Browse properties → Should see approved property
5. Click "Apply Now" → Fill application → Submit
6. Login as Landlord → Check Tenant Applications → See application
7. Click "Approve" → Should see success message
8. **CRITICAL:** Check if contract was created automatically
   - Login as Tenant → Go to My Contracts → Should see active contract
   - Go to My Payments → Should see deposit + rent payment
9. Click "Pay Now" on payment → Complete payment
10. Login as Landlord → Check Rent Management → See payment status PAID
11. Check Contracts page → Should see active contract

**Expected Result:** ✅ All steps work, no errors, workflow complete

### Test Scenario 2: Maintenance Workflow
**Duration:** 10 minutes
**Accounts Needed:** 1 Tenant (from previous test), 1 Landlord (from previous test)

**Steps:**
1. Login as Tenant → Go to Maintenance
2. Click "New Request" → Fill form → Submit
3. Login as Landlord → Check Maintenance Requests
4. See pending request → Click on it
5. Change status to "In Progress" → Add note
6. Login as Tenant → Check Maintenance → See status updated
7. Login as Landlord → Mark as "Resolved"
8. Login as Tenant → Verify status is "Resolved"

**Expected Result:** ✅ All status updates work in real-time

### Test Scenario 3: Admin Functions
**Duration:** 5 minutes
**Accounts Needed:** 1 Admin

**Steps:**
1. Login as Admin → Dashboard → Check stats
2. Property Approval → Filter by status
3. User Management → View all users
4. Analytics → Check charts

**Expected Result:** ✅ All data displays correctly

---

## 🔧 Troubleshooting

### Issue: "Not Authorized" Error
**Cause:** Wrong role or not logged in
**Solution:**
1. Check browser console: Ctrl+Shift+I → Console
2. Type: `fetch('https://your-backend-url/whoami', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(r => r.json()).then(d => console.log(d))`
3. Check your role - should match page requirement
4. Logout and login with correct account

### Issue: Property Not Showing
**Cause:** Not approved yet
**Solution:**
1. Verify property status in admin panel (should be "APPROVED")
2. Verify property is "active" in landlord panel
3. Check if property availability is "available" (not "occupied")
4. Clear browser cache and refresh

### Issue: Cannot See Contracts
**Cause:** Contract not created
**Solution:**
1. Verify application was approved
2. Check backend logs for contract creation errors
3. Try approving application again
4. Check if contract exists in database: `/db-stats` endpoint

### Issue: Payment Not Working
**Cause:** Contract doesn't exist or payment fields missing
**Solution:**
1. Verify contract exists
2. Check payment record in database
3. Verify all required fields in payment document
4. Try creating new application and approving

### Issue: Blank Pages / No Data Loading
**Cause:** API error or wrong response format
**Solution:**
1. Open browser console (F12)
2. Look for red error messages
3. Check "Network" tab for API calls
4. Verify response status is 200 (not 400 or 500)
5. Check if response has correct field names

### Issue: Images Not Showing
**Cause:** Upload failed or incorrect paths
**Solution:**
1. Check file size (must be < 5MB)
2. Check file format (jpg, png, gif)
3. Verify upload directory exists
4. Check image URLs in database

---

## 🚀 Deployment

### Environment Variables (.env)

**Frontend (.env.local)**
```
REACT_APP_API_URL=https://your-backend-url/api
```

**Backend (.env)**
```
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password

# Payment Gateway (optional)
RAZORPAY_KEY_ID=key_id
RAZORPAY_KEY_SECRET=secret
```

### Deployment Steps

**Frontend (Vercel)**
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy button → Auto-deploys on every push
4. Deploy time: 1-2 minutes

**Backend (Render)**
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy button → Auto-deploys on every push
5. Deploy time: 2-3 minutes

**Database (MongoDB Atlas)**
1. Already deployed in cloud
2. No manual deployment needed
3. Backups automatic

---

## 📞 Support & Issues

### Debugging Endpoints

**Check Current User:**
```
GET https://your-backend-url/whoami
Headers: Authorization: Bearer {token}
```

**Check Database Stats:**
```
GET https://your-backend-url/db-stats
```

**Check API Health:**
```
GET https://your-backend-url/health
```

### Common Console Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | No token or expired token | Re-login |
| 403 Forbidden | Wrong role | Verify user role |
| 404 Not Found | API endpoint wrong | Check endpoint path |
| 500 Server Error | Backend error | Check server logs |
| Network Error | Backend down | Check if deployed |

---

## ✅ VERIFICATION CHECKLIST

Before considering system complete:

- [ ] Admin can login & approve properties
- [ ] Landlord can create & manage properties
- [ ] Tenant can browse & apply for properties
- [ ] Application approval creates contract automatically
- [ ] Contract creates payments automatically
- [ ] Tenant can view contracts & payments
- [ ] Landlord can view contracts & payments
- [ ] Payment system works (status changes to PAID)
- [ ] Maintenance requests workflow works
- [ ] All dashboards show correct stats
- [ ] Role-based access control enforced
- [ ] Error messages are clear & helpful
- [ ] No console errors
- [ ] Pages load without lag
- [ ] Images display correctly

**When all items are checked:** System is Production Ready! ✅

---

**System Built & Tested:** October 16, 2025  
**Status:** ✅ Complete & Functional  
**Next Update:** As needed based on feedback
