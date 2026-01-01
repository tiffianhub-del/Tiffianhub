# 🔧 MongoDB Connection Error Fix

## Error: `querySrv ENOTFOUND _mongodb._tcp.cluster0.pcwhtia.mongodb.net`

This error means your computer cannot resolve the DNS for your MongoDB Atlas cluster.

---

## ✅ Quick Fixes (Try These First)

### **1. Check Your Internet Connection**
- Make sure you're connected to the internet
- Try accessing https://cloud.mongodb.com in your browser

### **2. Verify MongoDB Atlas Cluster Status**
1. Go to https://cloud.mongodb.com
2. Log in to your account
3. Check if your cluster is **running** (not paused)
4. If paused, click "Resume" to start it

### **3. Check Your Connection String Format**

Your `MONGO_URI` in `backend/.env` should look like:

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster0.pcwhtia.mongodb.net/tiffinhub?retryWrites=true&w=majority
```

**For Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/tiffinhub
```

---

## 🔍 Detailed Troubleshooting

### **Option 1: Use Local MongoDB (Easiest)**

If you have MongoDB installed locally:

1. **Start MongoDB:**
   ```powershell
   # If MongoDB is installed as a service, it should already be running
   # Check with: Get-Service MongoDB
   ```

2. **Update `backend/.env`:**
   ```env
   MONGO_URI=mongodb://localhost:27017/tiffinhub
   ```

3. **Restart your backend server**

---

### **Option 2: Fix MongoDB Atlas Connection**

#### **Step 1: Verify Connection String**
1. Go to MongoDB Atlas Dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `tiffinhub` (or your database name)

**Correct Format:**
```
mongodb+srv://yourusername:yourpassword@cluster0.pcwhtia.mongodb.net/tiffinhub?retryWrites=true&w=majority
```

#### **Step 2: Check Network Access**
1. In MongoDB Atlas, go to "Network Access"
2. Make sure your IP address is whitelisted
3. Or add `0.0.0.0/0` to allow all IPs (for development only)

#### **Step 3: Check Database User**
1. Go to "Database Access" in MongoDB Atlas
2. Make sure your database user exists
3. Verify the password is correct

---

### **Option 3: Test Connection Manually**

Create a test file to verify connection:

**`backend/test-mongo.js`:**
```javascript
require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Present' : 'Missing');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:');
    console.error(err.message);
    process.exit(1);
  });
```

Run it:
```powershell
cd backend
node test-mongo.js
```

---

## 🚨 Common Issues & Solutions

### **Issue 1: Cluster is Paused**
**Solution:** Resume your cluster in MongoDB Atlas dashboard

### **Issue 2: Wrong Password**
**Solution:** 
- Reset password in MongoDB Atlas
- Update `MONGO_URI` in `.env` file

### **Issue 3: IP Not Whitelisted**
**Solution:**
- Add your IP to Network Access in MongoDB Atlas
- Or use `0.0.0.0/0` for development (not recommended for production)

### **Issue 4: Connection String Format Wrong**
**Solution:**
- Make sure it starts with `mongodb+srv://`
- No spaces in the connection string
- Password should be URL-encoded if it contains special characters

### **Issue 5: DNS Resolution Problem**
**Solution:**
- Try using Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1)
- Or switch to local MongoDB temporarily

---

## 💡 Recommended: Use Local MongoDB for Development

For local development, it's easier to use local MongoDB:

1. **Install MongoDB locally** (if not installed):
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB via Docker

2. **Update `backend/.env`:**
   ```env
   MONGO_URI=mongodb://localhost:27017/tiffinhub
   ```

3. **Start MongoDB service** (usually runs automatically)

4. **Restart your backend**

---

## ✅ Quick Test

After fixing, you should see:
```
✅ MongoDB connected
```

Instead of:
```
❌ MongoDB connection error: Error: querySrv ENOTFOUND...
```

---

## 📝 Next Steps

1. Check your `backend/.env` file - verify `MONGO_URI` is correct
2. Test internet connection
3. Verify MongoDB Atlas cluster is running
4. Check Network Access settings in MongoDB Atlas
5. Try local MongoDB as alternative

