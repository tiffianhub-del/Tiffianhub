const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Debug environment variables at startup
console.log('🔍 Environment Check at Startup:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET ❌');
console.log('  GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || 'NOT SET ❌');

const passport = require('passport');

// Import routes
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const contactRoutes = require('./routes/contact');
const notificationRoutes = require('./routes/notifications');

const app = express();

app.use(passport.initialize());

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:3000'),
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // allow large Base64 payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notifications', notificationRoutes);

// Connect to MongoDB
console.log('MONGO_URI present?', Boolean(process.env.MONGO_URI));

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not set in environment variables!');
  console.error('Please create a .env file in the backend directory with:');
  console.error('MONGO_URI=your_connection_string_here');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000, // 10 seconds timeout
  socketTimeoutMS: 45000, // 45 seconds socket timeout
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('\n❌ MongoDB connection error:', err.message);
    
    // Provide specific guidance based on error type
    if (err.name === 'MongooseServerSelectionError') {
      console.error('\n🔍 This error usually means:');
      console.error('   1. Your IP address is NOT whitelisted in MongoDB Atlas');
      console.error('   2. The cluster might be paused or unreachable');
      console.error('   3. Network/firewall issues blocking the connection\n');
      console.error('📋 Quick Fix Steps:');
      console.error('   1. Go to https://cloud.mongodb.com');
      console.error('   2. Navigate to: Network Access → Add IP Address');
      console.error('   3. Click "Add Current IP Address" (or add 0.0.0.0/0 for development)');
      console.error('   4. Wait 1-2 minutes for changes to propagate');
      console.error('   5. Restart this server\n');
      console.error('📖 For detailed instructions, see: MONGODB_CONNECTION_FIX.md\n');
    } else if (err.name === 'MongoParseError') {
      console.error('\n🔍 Invalid connection string format!');
      console.error('   Make sure your MONGO_URI is correctly formatted');
      console.error('   Example: mongodb+srv://username:password@cluster.mongodb.net/dbname\n');
    } else if (err.message.includes('authentication failed')) {
      console.error('\n🔍 Authentication failed!');
      console.error('   Check your username and password in the connection string');
      console.error('   Make sure special characters in password are URL-encoded\n');
    }
    
    console.error('Full error details:', err);
    process.exit(1); // Exit if can't connect to DB
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
