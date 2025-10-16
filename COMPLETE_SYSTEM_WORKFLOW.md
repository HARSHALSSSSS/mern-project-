# Complete Property Rental Management System - User Guide & Testing Flow

## 🎯 System Overview
A full-stack property rental platform with 3 user roles: **Admin**, **Landlord**, and **Tenant**

---

## 📋 COMPLETE WORKFLOW & FEATURES

### **1. ADMIN WORKFLOW**

#### **Initial Setup:**
```
System creates admin account on first run
- Email: admin@rental.com
- Password: Admin@123
- Role: admin
```

#### **Admin Features:**

**A. Property Approval Management**
- Navigate to: Admin Dashboard → Property Approval
- See all properties with status: Pending, Approved, Rejected
- **Workflow:**
  1. View property details (title, type, rent, location)
  2. Click "Approve" → Property becomes visible to tenants
  3. Click "Reject" → Property hidden from tenants
  4. Filter by status tabs
  5. See stats (total, pending, approved, rejected)

**B. User Management** (if implemented)
- View all users (tenants, landlords)
- Activate/Suspend accounts
- View user details

**C. System Monitoring**
- View total properties, applications, users
- Monitor platform activity

---

### **2. LANDLORD WORKFLOW**

#### **Registration & Login:**
```
1. Go to Register page
2. Fill form:
   - Name: [Your Name]
   - Email: [Your Email]
   - Password: [Min 6 chars]
   - Role: SELECT "landlord"
3. Login with credentials
```

#### **Landlord Features:**

**A. Property Management (My Properties)**
- **Add New Property:**
  1. Click "Add Property" button
  2. Fill form:
     - Title (e.g., "2BHK Apartment")
     - Description
     - Type: Apartment/House/Villa/Room
     - Rent Amount (monthly)
     - Deposit Amount
     - Bedrooms, Bathrooms
     - Area (sq ft)
     - Address, City, State, Zip
     - Upload images (multiple)
     - Amenities: Parking, Gym, Pool, Security, etc.
  3. Submit → Status: PENDING (awaits admin approval)
  4. Property appears in "My Properties" list

- **Manage Properties:**
  - **Edit:** Update any property details
  - **Delete:** Remove property listing
  - **Toggle Active/Inactive:** Control visibility
  - View status: Pending/Approved/Rejected

**B. Tenant Applications**
- View all applications for YOUR properties
- **Workflow:**
  1. Tenant applies → Application appears here
  2. See applicant details:
     - Tenant name, email
     - Property applied for
     - Application status
     - Move-in date requested
  3. **Actions:**
     - **Approve:** Accept tenant → Creates contract
     - **Reject:** Decline application
     - View application details

**C. Rent Management**
- View all rent payments for your properties
- **See:**
  - Tenant name
  - Property details
  - Due date, paid date
  - Amount, status (Paid/Pending/Overdue)
  - Payment method
- Track payment history

**D. Maintenance Requests**
- View maintenance requests from tenants
- **Workflow:**
  1. Tenant submits request
  2. Appears in your maintenance list
  3. View: Issue type, description, urgency, images
  4. **Update Status:**
     - Pending → In Progress → Resolved
  5. Add notes/comments

**E. Contracts**
- View active rental contracts
- See contract details:
  - Tenant information
  - Property details
  - Start/End dates
  - Rent amount
  - Terms & conditions
- Download contract PDFs

**F. Dashboard**
- Overview stats:
  - Total properties
  - Active properties
  - Pending applications
  - Total revenue
  - Maintenance requests
- Recent activity feed

---

### **3. TENANT WORKFLOW**

#### **Registration & Login:**
```
1. Go to Register page
2. Fill form:
   - Name: [Your Name]
   - Email: [Your Email]
   - Password: [Min 6 chars]
   - Role: SELECT "tenant"
3. Login with credentials
```

#### **Tenant Features:**

**A. Browse Properties (Homepage)**
- View all APPROVED properties
- **Filters:**
  - Property Type
  - City/Location
  - Price Range
  - Bedrooms
  - Amenities
- **Search:** By title, location
- View property cards with:
  - Images, title, rent
  - Location, bedrooms, bathrooms
  - Amenities icons
  - "View Details" button

**B. Property Details**
- Click property → Full details page
- See:
  - Image gallery
  - Full description
  - All amenities
  - Location map (if implemented)
  - Landlord contact
  - **"Apply Now" button**

**C. Apply for Property**
- Click "Apply Now"
- Fill application form:
  - Preferred move-in date
  - Lease duration (months)
  - Current employment status
  - Monthly income
  - Additional notes
- Submit → Status: PENDING

**D. My Applications**
- View all your applications
- **Status tracking:**
  - Pending: Awaiting landlord review
  - Approved: Landlord accepted → Contract created
  - Rejected: Application declined
- **Actions:**
  - **Withdraw:** Cancel pending application
  - View application details
  - Check property info

**E. My Contracts**
- View active rental agreements
- See:
  - Property details
  - Landlord information
  - Contract period (start/end)
  - Rent amount, deposit
  - Terms & conditions
- **Download contract PDF**
- Contract status: Active/Expired

**F. My Payments**
- View rent payment history
- **Details:**
  - Property name
  - Amount due
  - Due date
  - Status: Pending/Paid/Overdue
- **Make Payment:**
  1. Click "Pay Now" on pending payment
  2. Select payment method:
     - Credit Card
     - Debit Card
     - Net Banking
     - UPI
  3. Enter payment details
  4. Confirm → Status: PAID
- Download payment receipts

**G. Maintenance Requests**
- Submit maintenance issues
- **Create Request:**
  1. Click "New Request"
  2. Fill form:
     - Issue Type: Plumbing/Electrical/Appliance/Structural/Other
     - Description
     - Urgency: Low/Medium/High
     - Upload images (optional)
  3. Submit → Goes to landlord
- **Track Requests:**
  - View status: Pending/In Progress/Resolved
  - See landlord responses
  - Add comments

**H. Tenant Dashboard**
- Personal overview:
  - Active contracts
  - Pending payments
  - Maintenance requests status
  - Application status
- **Browse Available Properties section** (same as homepage)

---

## 🔄 COMPLETE END-TO-END WORKFLOWS

### **Workflow 1: Property Listing to Rental**

```
1. LANDLORD adds property → Status: PENDING
   ↓
2. ADMIN reviews in Property Approval page
   ↓
3. ADMIN clicks "Approve" → Status: APPROVED
   ↓
4. Property appears on HOMEPAGE (public)
   ↓
5. TENANT browses, finds property
   ↓
6. TENANT clicks "Apply Now", submits application
   ↓
7. LANDLORD sees application in "Tenant Applications"
   ↓
8. LANDLORD clicks "Approve"
   ↓
9. System creates CONTRACT automatically
   ↓
10. TENANT sees contract in "My Contracts"
    ↓
11. TENANT sees payment due in "My Payments"
    ↓
12. TENANT clicks "Pay Now", completes payment
    ↓
13. LANDLORD sees payment in "Rent Management"
```

### **Workflow 2: Maintenance Request**

```
1. TENANT submits maintenance request
   ↓
2. LANDLORD receives in "Maintenance Requests"
   ↓
3. LANDLORD updates status → "In Progress"
   ↓
4. TENANT sees status update
   ↓
5. Issue resolved
   ↓
6. LANDLORD marks "Resolved"
   ↓
7. TENANT can view resolution
```

---

## 🧪 COMPLETE TESTING CHECKLIST

### **Phase 1: Admin Testing**
- [ ] Login as admin (admin@rental.com / Admin@123)
- [ ] Access Property Approval page
- [ ] See stats (pending, approved, rejected counts)
- [ ] View property details
- [ ] Approve a property
- [ ] Reject a property
- [ ] Filter by status tabs
- [ ] Logout

### **Phase 2: Landlord Testing**
- [ ] Register new landlord account
- [ ] Login successfully
- [ ] **Add Property:**
  - [ ] Fill all required fields
  - [ ] Upload images
  - [ ] Select amenities
  - [ ] Submit successfully
  - [ ] Verify status: PENDING
- [ ] **My Properties:**
  - [ ] See property in list
  - [ ] Edit property details
  - [ ] Toggle active/inactive
  - [ ] Delete property (if needed)
- [ ] **Wait for admin approval** (or login as admin and approve)
- [ ] **Dashboard:**
  - [ ] View stats (properties, revenue, etc.)
- [ ] Logout

### **Phase 3: Tenant Testing**
- [ ] Register new tenant account (DIFFERENT EMAIL!)
- [ ] Login successfully
- [ ] **Homepage:**
  - [ ] See approved properties
  - [ ] Use filters (type, location, price)
  - [ ] Search properties
- [ ] **Property Details:**
  - [ ] Click property card
  - [ ] View full details
  - [ ] See image gallery
  - [ ] Check amenities
- [ ] **Apply for Property:**
  - [ ] Click "Apply Now"
  - [ ] Fill application form
  - [ ] Enter move-in date
  - [ ] Enter lease duration (e.g., 12 months)
  - [ ] Submit application
- [ ] **My Applications:**
  - [ ] See application with status: PENDING
  - [ ] Verify property details
- [ ] Logout

### **Phase 4: Application Approval**
- [ ] Login as LANDLORD (who owns the property)
- [ ] **Tenant Applications:**
  - [ ] See new application
  - [ ] View applicant details
  - [ ] Click "Approve"
  - [ ] Verify success message
- [ ] **Contracts:**
  - [ ] See newly created contract
  - [ ] Verify details
- [ ] Logout

### **Phase 5: Tenant Contract & Payment**
- [ ] Login as TENANT
- [ ] **My Applications:**
  - [ ] See status changed to: APPROVED
- [ ] **My Contracts:**
  - [ ] See active contract
  - [ ] Verify property details
  - [ ] Download PDF (if available)
- [ ] **My Payments:**
  - [ ] See pending payment
  - [ ] Verify amount
  - [ ] Click "Pay Now"
  - [ ] Select payment method
  - [ ] Complete payment
  - [ ] Verify status: PAID
- [ ] Logout

### **Phase 6: Maintenance Flow**
- [ ] Login as TENANT
- [ ] **Maintenance Requests:**
  - [ ] Click "New Request"
  - [ ] Select issue type
  - [ ] Write description
  - [ ] Set urgency
  - [ ] Upload image (optional)
  - [ ] Submit
  - [ ] Verify appears in list
- [ ] Logout
- [ ] Login as LANDLORD
- [ ] **Maintenance Requests:**
  - [ ] See tenant's request
  - [ ] View details
  - [ ] Update status to "In Progress"
  - [ ] Add notes
  - [ ] Update to "Resolved"
- [ ] Logout
- [ ] Login as TENANT
- [ ] Verify status updated

---

## ⚠️ IMPORTANT TESTING NOTES

### **Common Issues & Solutions:**

**1. "Not Authorized" Error:**
- **Problem:** Logged in with wrong role
- **Solution:** 
  - Check whoami: Open browser console, type:
    ```javascript
    fetch('https://your-backend-url/whoami', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then(r => r.json()).then(d => console.log(d))
    ```
  - Logout and login with correct account

**2. Property Not Showing:**
- Verify: Property status is APPROVED (admin must approve first)
- Check: Property is Active (landlord toggle)

**3. Landlord Can't See Application:**
- Verify: Tenant applied to YOUR property (not admin's or other landlord's)
- Check: Application exists in database

**4. Payment Not Working:**
- Verify: Contract exists (application must be approved first)
- Check: Payment status is PENDING

**5. Empty Tables/Lists:**
- Check browser console for errors
- Verify API endpoint responses
- Check data field names (response.data.applications, NOT response.data.data)

### **Testing Users:**

**Create Multiple Accounts:**
```
ADMIN:
- Email: admin@rental.com
- Password: Admin@123
- Role: admin

LANDLORD 1:
- Email: landlord1@test.com
- Password: Test@123
- Role: landlord

LANDLORD 2:
- Email: landlord2@test.com
- Password: Test@123
- Role: landlord

TENANT 1:
- Email: tenant1@test.com
- Password: Test@123
- Role: tenant

TENANT 2:
- Email: tenant2@test.com
- Password: Test@123
- Role: tenant
```

**⚠️ CRITICAL: Use different emails for each role! Don't use same email for tenant and landlord!**

---

## 🔍 DEBUGGING ENDPOINTS

**Check Current User:**
```javascript
// In browser console (after login)
fetch('https://your-backend-url/whoami', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
}).then(r => r.json()).then(d => console.log('Current User:', d))
```

**Check Database Stats:**
```javascript
fetch('https://your-backend-url/db-stats')
  .then(r => r.json())
  .then(d => console.log('DB Stats:', d))
```

---

## 📊 EXPECTED RESULTS

**After Complete Testing:**
- ✅ 1 Admin account
- ✅ 2+ Landlord accounts
- ✅ 2+ Tenant accounts
- ✅ 3+ Properties (approved)
- ✅ 2+ Applications (1 pending, 1 approved)
- ✅ 1+ Contract (active)
- ✅ 1+ Payment (paid)
- ✅ 1+ Maintenance request (resolved)

This completes a full cycle of the rental platform! 🎉
