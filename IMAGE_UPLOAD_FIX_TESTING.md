# Image Upload Issue - Fix & Testing Guide

## Issue Identified ❌

**Root Cause:** The axios HTTP interceptor was forcing `Content-Type: application/json` header on ALL requests, including multipart/form-data requests for image uploads.

**Impact:** 
- FormData with images was being sent with wrong Content-Type
- Browser couldn't properly encode the multipart boundary
- Backend couldn't parse the files correctly
- `req.files` was always empty
- Images never made it to the `/uploads` directory

## Fix Applied ✅

### 1. **axios.js Interceptor Fix** (CRITICAL)
```javascript
// BEFORE: Headers always set to application/json
headers: {
  'Content-Type': 'application/json',
}

// AFTER: Detect FormData and remove Content-Type header
if (config.data instanceof FormData) {
  delete config.headers['Content-Type'];
  // Browser will now set it to: multipart/form-data; boundary=...
}
```

### 2. **Comprehensive Logging Added**

#### Frontend (AddProperty.jsx)
- Logs images array and count before submission
- Logs each image's name, size, and type
- Logs ALL FormData entries being sent
- Shows what the browser will send to backend

#### Backend (propertyController.js)
- `createProperty()`: Logs `req.files` to verify files are received
- `updateProperty()`: Logs new files for updates
- Shows image paths being saved to database

## Testing Steps

### Pre-requisites
- Have browser DevTools open (F12)
- Go to Console tab
- Have backend server running (`npm start` in /backend)
- Have frontend dev server running (`npm run dev` in /frontend)

### Test 1: Test Simple Property Creation (No Images)
1. Login as Landlord
2. Go to "Add Property"
3. Fill in all fields (Step 1 & 2)
4. On Step 3 (Images): **DON'T select any images**
5. Click Submit
6. **Expected:**
   - Console shows "📤 FormData request detected - removing Content-Type header"
   - Backend logs show: "⚠️ NO FILES RECEIVED - req.files: undefined"
   - Property created successfully with `images: []`
   - ✅ Property appears in "My Properties"

### Test 2: Test Property Creation WITH Images
1. Login as Landlord
2. Go to "Add Property"
3. Fill in all fields (Step 1 & 2)
4. On Step 3 (Images): **Select 2-3 JPG/PNG images**
5. Frontend should show: "✓ 3 image(s) selected"
6. Click Submit
7. **Expected in Console:**

   ```
   // Frontend logs:
   📸 Adding images to FormData...
     Image 0: {name: "photo1.jpg", size: 245783, type: "image/jpeg"}
     Image 1: {name: "photo2.jpg", size: 189456, type: "image/jpeg"}
   📤 FormData request detected - removing Content-Type header
   
   // Backend logs:
   ✅ IMAGES RECEIVED! Count: 2
   📷 Saved image paths: [
     { url: '/uploads/images-1729123456789-123456789.jpg', publicId: '...' },
     { url: '/uploads/images-1729123456790-123456790.jpg', publicId: '...' }
   ]
   ```

8. **Verify files on disk:**
   ```powershell
   dir backend\uploads\
   # Should show 2-3 files like:
   # - images-1729123456789-123456789.jpg
   # - images-1729123456790-123456790.jpg
   ```

9. **Verify in database:**
   - Go to "My Properties" page
   - Find the new property
   - **Expected:** Images should display as thumbnails
   - Hover over property card to see first image

### Test 3: Property Details Page - Image Display
1. Click on a property with images (from Test 2)
2. Navigate to Property Details page
3. **Expected:**
   - First image displays in hero section
   - Previous/Next buttons work
   - Image counter shows "1 / 2" (or however many)
   - All images visible by clicking through

### Test 4: Update Property with New Images
1. Go to "My Properties"
2. Click "Edit" on a property
3. Add new images to the existing property
4. Submit update
5. **Expected in Console:**

   ```
   // Backend logs:
   UPDATE PROPERTY - REQUEST DETAILS:
   ✅ NEW IMAGES RECEIVED! Count: 1
   📷 Updated image paths: [
     ...old images...,
     { url: '/uploads/images-...-new.jpg', publicId: '...' }
   ]
   ```

6. **Verify:** Property now shows all images (old + new)

### Test 5: Admin Property Approval - Images Persist
1. Create a property as Landlord (with images)
2. Login as Admin
3. Go to "Property Approval"
4. Approve the property
5. **Expected:**
   - Approval succeeds
   - Images still visible in database
   - Property appears on homepage with images

### Test 6: Tenant Browsing Properties
1. Login as Tenant (or stay public)
2. Go to "Browse Properties" (homepage)
3. Filter for "Approved" properties
4. **Expected:**
   - Properties with images show the first image as thumbnail
   - Properties without images show placeholder image
   - Click property → Details page shows all images

## Troubleshooting

### ❌ Images still not showing
1. Check browser console for errors
2. Check backend server console for error logs
3. Verify `/uploads` directory exists: `dir backend\uploads\`
4. Verify files are actually in the directory
5. Check image file permissions are readable

### ❌ "No files received" message
1. Verify file input has `multiple` and `accept="image/*"`
2. Check FormData.entries() shows image files
3. Verify Content-Type header is NOT being set (it should be deleted)
4. Check multer config: `/backend/config/multer.js`
5. Verify `upload.array('images', 10)` middleware is applied to route

### ❌ Files uploaded but images not displaying
1. Check if image URLs in database are correct: `/uploads/filename.jpg`
2. Verify `/uploads` route is exposed in server.js: `app.use('/uploads', express.static('uploads'));`
3. Try accessing image directly: `http://localhost:5000/uploads/filename.jpg`
4. Check if BASE_URL is correct in frontend (should be `http://localhost:5000`)

### ❌ Upload works but files disappear after restart
- Files are in `/uploads` directory which might be in `.gitignore`
- This is normal for development
- In production, use cloud storage (Cloudinary, AWS S3, etc.)

## Key Files Changed

```
frontend/src/services/axios.js              ✅ Fixed interceptor
frontend/src/pages/landlord/AddProperty.jsx ✅ Enhanced logging
backend/controllers/propertyController.js   ✅ Added debugging logs
backend/config/multer.js                    ✅ (Already correct)
backend/server.js                           ✅ (Already correct)
```

## Expected Behavior After Fix

✅ Landlord uploads images when creating property
✅ Files saved to `/backend/uploads/` directory
✅ Image URLs stored in MongoDB as: `{url: '/uploads/filename.jpg', publicId: 'filename'}`
✅ Frontend displays images on:
  - Property card (thumbnail)
  - My Properties page (thumbnail)
  - Property Details page (full image gallery)
✅ Images persist through:
  - Admin approval
  - Property updates
  - Application approval
  - Data retrieval from database

## Next Steps if Still Not Working

1. Provide screenshot of:
   - Browser console during upload
   - Backend server console during upload
   - What's in `backend/uploads/` directory

2. Check if any error messages appear

3. Verify environment variables:
   - Frontend: `VITE_API_URL=http://localhost:5000/api`
   - Backend: `.env` file has `PORT=5000`

4. Try uploading a small file (< 1MB) to rule out size limits

5. Check if issue is specific to:
   - Chrome/Firefox/Safari browser
   - Specific image format (JPG vs PNG)
   - Adding new property vs editing existing
