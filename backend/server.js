const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const passport = require('passport');

// Import routes
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const contactRoutes = require('./routes/contact');

const app = express();

app.use(passport.initialize());

// Middleware
app.use(cors()); // or cors({ origin: 'http://localhost:3000' })
app.use(express.json({ limit: '50mb' })); // allow large Base64 payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/contact', contactRoutes);

// Connect to MongoDB
console.log('MONGO_URI present?', Boolean(process.env.MONGO_URI));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
