# Fix MongoDB Connection on Render.com

## Current Connection String (WRONG ❌)
```
mongodb+srv://harshalsonawane297_db_user:9Lq7t1mKXE2ZHxu5@cluster0.cb4ysuk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## Corrected Connection String (CORRECT ✅)
```
mongodb+srv://harshalsonawane297_db_user:9Lq7t1mKXE2ZHxu5@cluster0.cb4ysuk.mongodb.net/real-estate?retryWrites=true&w=majority&appName=Cluster0
```

## What Changed?
Added `/real-estate` after `.mongodb.net` and before `?`

---

## Steps to Fix on Render.com

### 1. Go to Render Dashboard
   - Open: https://dashboard.render.com/

### 2. Select Your Backend Service
   - Click on your backend web service (the Node.js/Express one)

### 3. Go to Environment Tab
   - Click **"Environment"** in the left sidebar

### 4. Find MONGODB_URI
   - Scroll down to find the `MONGODB_URI` environment variable

### 5. Edit the Value
   - Click the **pencil/edit icon** next to `MONGODB_URI`
   - Replace the entire value with:
   ```
   mongodb+srv://harshalsonawane297_db_user:9Lq7t1mKXE2ZHxu5@cluster0.cb4ysuk.mongodb.net/real-estate?retryWrites=true&w=majority&appName=Cluster0
   ```

### 6. Save Changes
   - Click **"Save Changes"** button

### 7. Render Will Auto-Redeploy
   - Wait 2-3 minutes for the service to redeploy
   - Check the **"Logs"** tab to see if it says:
     ```
     ✅ MongoDB Connected: cluster0.cb4ysuk.mongodb.net
     ```

---

## Also Update Local .env File

Open `backend/.env` and update:

```properties
PORT=5000
MONGODB_URI=mongodb+srv://harshalsonawane297_db_user:9Lq7t1mKXE2ZHxu5@cluster0.cb4ysuk.mongodb.net/real-estate?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Then restart your local backend:
```powershell
cd backend
npm start
```

---

## Expected Result

**Before:**
- ❌ Signup: timeout of 15000 exceeded
- ❌ Backend logs: Connection errors

**After:**
- ✅ Signup: Works in 0.5-1 second
- ✅ Backend logs: "MongoDB Connected"
- ✅ Data saved to database
- ✅ Login works perfectly

---

## Verification

After updating on Render:

1. Go to your deployed frontend: https://mern-project-five-ashen.vercel.app
2. Click "Sign Up"
3. Fill in the form
4. Should create account instantly (no timeout!)

---

## Why This Happens

MongoDB connection string format:
```
mongodb+srv://username:password@host/DATABASE_NAME?options
```

Without the database name, MongoDB doesn't know which database to use, causing connection issues and timeouts.

---

## Database Name Options

You can use any name you want:
- `/real-estate` ← Recommended (matches your app)
- `/realestate`
- `/property-management`
- `/consza-db`

Just make sure it's there before the `?`!
