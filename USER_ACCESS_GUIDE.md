# 🎯 COMPLETE USER ACCESS GUIDE - Real Estate Platform

## 📋 Overview

Your platform has **3 user types** with different access levels:
1. **Tenant** - Rent properties
2. **Landlord** - List and manage properties  
3. **Admin** - Manage the entire platform

---

## 🔐 HOW TO CREATE ACCOUNTS

### **Method 1: Via Signup Page (ALL ROLES)**

#### **Step 1: Go to Signup**
🔗 **URL:** https://mern-project-five-ashen.vercel.app/signup

#### **Step 2: Fill the Form**

**For TENANT:**
- Name: `John Doe`
- Email: `tenant@example.com`
- Phone: `+1 234 567 8900`
- **Role:** Select **"Rent a property (Tenant)"**
- Password: `Tenant@123`
- Confirm Password: `Tenant@123`
- Click **"Create Account"**
- ✅ Redirected to: `/tenant/dashboard`

**For LANDLORD:**
- Name: `Jane Smith`
- Email: `landlord@example.com`
- Phone: `+1 234 567 8901`
- **Role:** Select **"List my property (Landlord)"**
- Password: `Landlord@123`
- Confirm Password: `Landlord@123`
- Click **"Create Account"**
- ✅ Redirected to: `/landlord/dashboard`

**For ADMIN:**
- Name: `Admin User`
- Email: `admin@example.com`
- Phone: `+1 234 567 8902`
- **Role:** Select **"Manage the platform (Admin)"** ⭐ NEW!
- Password: `Admin@123`
- Confirm Password: `Admin@123`
- Click **"Create Account"**
- ✅ Redirected to: `/admin/dashboard`

---

### **Method 2: One-Time Admin Setup API (ADMIN ONLY)**

If you want to create an admin account programmatically:

**API Endpoint:** `POST /api/setup/admin`

**Using Postman/Browser:**
```
POST https://mern-project-1ob8.onrender.com/api/setup/admin
```

**Response:**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "admin": {
    "id": "...",
    "name": "System Administrator",
    "email": "admin@realestate.com",
    "role": "admin"
  }
}
```

**Default Credentials:**
- Email: `admin@realestate.com`
- Password: `admin123`

**⚠️ Note:** This endpoint only works **ONCE**. After the first admin is created, it will return an error.

---

## 🚪 HOW TO LOGIN

### **Step 1: Go to Login Page**
🔗 **URL:** https://mern-project-five-ashen.vercel.app/login

### **Step 2: Enter Credentials**

**Login as TENANT:**
- Email: `tenant@example.com`
- Password: `Tenant@123`
- ✅ Redirected to: `/tenant/dashboard`

**Login as LANDLORD:**
- Email: `landlord@example.com`
- Password: `Landlord@123`
- ✅ Redirected to: `/landlord/dashboard`

**Login as ADMIN:**
- Email: `admin@example.com`
- Password: `Admin@123`
- ✅ Redirected to: `/admin/dashboard`

---

## 🎨 WHAT EACH USER CAN DO

### 👤 **TENANT WORKFLOW**

**After Login, Tenant Can:**

1. **Browse Properties**
   - Go to homepage → Search/filter properties
   - Click property → View details
   - Click "Apply" → Submit application

2. **Manage Applications**
   - `/tenant/applications` → View all applications
   - Status: Pending, Approved, Rejected

3. **Pay Rent**
   - `/tenant/payments` → View due payments
   - Click "Pay Now" → Pay via payment gateway
   - Download receipts

4. **View Contracts**
   - `/tenant/contracts` → View signed leases
   - Download contract PDFs

5. **Submit Maintenance Requests**
   - `/tenant/maintenance` → Report issues
   - Upload photos, describe problem
   - Track status (Pending → In Progress → Completed)

6. **Notifications**
   - Rent due alerts
   - Application status updates
   - Maintenance updates

---

### 🏢 **LANDLORD WORKFLOW**

**After Login, Landlord Can:**

1. **Add Properties**
   - `/landlord/properties` → Click "Add Property"
   - Upload images, set rent, add details
   - Submit for approval (if admin moderation enabled)

2. **Manage Properties**
   - View all listed properties
   - Edit property details
   - Mark as available/unavailable
   - Delete properties

3. **Review Applications**
   - `/landlord/applications` → See tenant applications
   - Approve or reject applications
   - View tenant details

4. **Track Rent**
   - `/landlord/rent` → View payment status
   - See received payments
   - Track overdue rents
   - Generate reports

5. **Handle Maintenance**
   - `/landlord/maintenance` → View tenant requests
   - Update status (Pending → In Progress → Completed)
   - Add notes, cost estimates

6. **Notifications**
   - New tenant applications
   - Rent received confirmations
   - Maintenance requests

---

### ⚙️ **ADMIN WORKFLOW**

**After Login, Admin Can:**

1. **Monitor Dashboard**
   - `/admin/dashboard` → Platform overview
   - Total users, properties, revenue
   - Charts: User growth, revenue trends

2. **Manage Users**
   - `/admin/users` → View all users
   - Filter by role (Tenant, Landlord, Admin)
   - Activate/deactivate accounts
   - Reset passwords
   - View user details

3. **Approve Properties**
   - `/admin/properties` → Review new listings
   - Approve or reject properties
   - Monitor all properties across platform

4. **Monitor Payments**
   - `/admin/payments` → View all transactions
   - Track overdue payments
   - Generate financial reports
   - Handle refunds/disputes

5. **View Analytics**
   - `/admin/analytics` → Detailed reports
   - Occupancy rates
   - Revenue trends
   - Maintenance completion rates
   - Property performance metrics

6. **Send Notifications**
   - Platform-wide announcements
   - Targeted notifications to users

---

## 🔄 COMPLETE USER JOURNEY EXAMPLES

### **Example 1: Tenant Renting a Property**

1. **Browse:** Visit homepage → Search "2BHK in Mumbai"
2. **Apply:** Click property → "Apply Now" → **Need to signup**
3. **Signup:** Create account as **Tenant**
4. **Dashboard:** Redirected to `/tenant/dashboard`
5. **Browse again:** Go to properties → Apply for property
6. **Wait:** Application status = "Pending"
7. **Approved:** Landlord approves → Status = "Approved"
8. **Contract:** Sign digital lease agreement
9. **Move in:** Property is yours!
10. **Pay Rent:** Monthly rent via `/tenant/payments`
11. **Issues:** Submit maintenance requests when needed

---

### **Example 2: Landlord Listing a Property**

1. **Signup:** Create account as **Landlord**
2. **Dashboard:** Redirected to `/landlord/dashboard`
3. **Add Property:** Go to `/landlord/properties/add`
4. **Upload:** Add 5-10 photos, property details, rent amount
5. **Submit:** Property goes for approval (if enabled)
6. **Approved:** Admin/Auto-approved → Property is live
7. **Applications:** Tenants start applying
8. **Review:** Check tenant profiles → Approve best tenant
9. **Contract:** Upload lease agreement
10. **Rent:** Track monthly rent payments
11. **Maintenance:** Handle tenant issues

---

### **Example 3: Admin Managing Platform**

1. **Login:** Login as **Admin**
2. **Dashboard:** See platform stats (100 users, 50 properties, $10k revenue)
3. **New Property:** Notification → "New property needs approval"
4. **Approve:** Go to `/admin/properties` → Review → Approve
5. **User Issue:** Tenant reports problem with landlord
6. **Investigate:** Check `/admin/users` → View both profiles
7. **Resolve:** Deactivate problematic user if needed
8. **Reports:** Generate monthly analytics
9. **Announcements:** Send platform-wide notification

---

## 📊 PAGE ACCESS MATRIX

| Page | Tenant | Landlord | Admin | Public |
|------|--------|----------|-------|--------|
| Homepage | ✅ | ✅ | ✅ | ✅ |
| Property Listings | ✅ | ✅ | ✅ | ✅ |
| Property Details | ✅ | ✅ | ✅ | ✅ |
| About/Contact | ✅ | ✅ | ✅ | ✅ |
| Tenant Dashboard | ✅ | ❌ | ❌ | ❌ |
| Landlord Dashboard | ❌ | ✅ | ❌ | ❌ |
| Admin Dashboard | ❌ | ❌ | ✅ | ❌ |
| My Applications | ✅ | ❌ | ❌ | ❌ |
| My Properties | ❌ | ✅ | ✅ | ❌ |
| User Management | ❌ | ❌ | ✅ | ❌ |
| Analytics | ❌ | ✅ | ✅ | ❌ |

---

## 🔐 SECURITY FEATURES

### **Role-Based Access Control:**
- Tenant can't access `/landlord/*` pages
- Landlord can't access `/tenant/*` pages
- Only Admin can access `/admin/*` pages
- Automatic redirect to appropriate dashboard

### **Protected Routes:**
- All dashboard pages require login
- JWT token-based authentication
- Token stored in localStorage
- Auto-logout on token expiration (7 days)

### **Account Security:**
- Password hashing (bcrypt)
- Email verification (optional - can be enabled)
- Password reset via email
- Forgot password functionality

---

## 🚀 TESTING INSTRUCTIONS

### **Test 1: Create All User Types**
1. Create Tenant account
2. Logout
3. Create Landlord account
4. Logout
5. Create Admin account
6. Verify each redirects to correct dashboard

### **Test 2: Test Access Control**
1. Login as Tenant
2. Try accessing `/landlord/dashboard` → Should redirect
3. Try accessing `/admin/dashboard` → Should redirect
4. ✅ Access only tenant pages

### **Test 3: Complete Flow**
1. **As Landlord:** Add property
2. **As Admin:** Approve property
3. **As Tenant:** Apply for property
4. **As Landlord:** Approve application
5. **As Tenant:** Pay rent
6. **As Landlord:** See payment received
7. **As Admin:** Monitor transaction

---

## 📝 RECOMMENDED CREDENTIALS FOR TESTING

Create these accounts for testing:

```
TENANT TEST ACCOUNT:
Email: test.tenant@example.com
Password: TestTenant@123
Role: Tenant

LANDLORD TEST ACCOUNT:
Email: test.landlord@example.com
Password: TestLandlord@123
Role: Landlord

ADMIN TEST ACCOUNT:
Email: admin@example.com
Password: Admin@123
Role: Admin
```

---

## ⚡ QUICK START CHECKLIST

- [ ] MongoDB Atlas configured ✅
- [ ] Backend deployed on Render ✅
- [ ] Frontend deployed on Vercel ✅
- [ ] Environment variables set ✅
- [ ] Create Admin account via signup
- [ ] Create Landlord test account
- [ ] Create Tenant test account
- [ ] Test property listing flow
- [ ] Test rent payment flow
- [ ] Test maintenance request flow

---

## 🎉 CURRENT STATUS

✅ **Admin portal fully created**
✅ **Signup form updated with Admin option**
✅ **All 3 user types can register via signup**
✅ **Backend setup route created for admin**
✅ **Code pushed to GitHub and deployed**

**Next Step:** Once MongoDB is connected, test all user flows!

---

**Last Updated:** October 14, 2025
**Status:** Ready for testing after MongoDB setup
