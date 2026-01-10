const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ✅ missing import
const User = require('../models/User');
const Listing = require('../models/Listing');
const Notification = require('../models/Notification');
require('dotenv').config();

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Validate Google OAuth configuration
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️  WARNING: Google OAuth credentials not set. Google login will not work.');
  console.warn('   Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
}

if (!process.env.GOOGLE_CALLBACK_URL) {
  console.warn('⚠️  WARNING: GOOGLE_CALLBACK_URL not set. Using default.');
  console.warn('   For local dev: http://localhost:5000/api/auth/google/callback');
  console.warn('   For Render: https://your-backend.onrender.com/api/auth/google/callback');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // First, check if user exists by Google ID
        let user = await User.findOne({ googleId: profile.id });

        // If not, check if a user exists with the same email
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            // Attach googleId to existing account
            user.googleId = profile.id;
            user.avatar = profile.photos[0].value;
            await user.save();
          }
        }

        // If still no user, create a new one
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: profile.photos[0].value,
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);



// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create user (pre-save hook will hash password)
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const bcrypt = require('bcryptjs'); // ✅ Make sure this is required
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });


    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

console.log("Auth routes loaded ✅");

// Middleware to verify JWT
const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    // Get user with password field to check if it exists
    const userWithPassword = await User.findById(req.userId);
    if (!userWithPassword) return res.status(404).json({ message: 'User not found' });
    
    // Convert to object and remove password from response (but check if it exists first)
    const userObj = userWithPassword.toObject();
    const hasPassword = !!(userWithPassword.password && userWithPassword.password.trim() !== '');
    delete userObj.password; // Remove password from response
    userObj.hasPassword = hasPassword;
    
    console.log('User hasPassword:', hasPassword, 'for user:', req.userId);
    
    res.json({ user: userObj });
  } catch (err) {
    console.error('Error in /me:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/profile - Update user profile (kitchen name, avatar, etc.)
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update name if provided
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ message: 'Kitchen name is required' });
      }
      user.name = name.trim();
    }

    // Update avatar if provided
    if (avatar !== undefined) {
      user.avatar = avatar; // Base64 string or URL
    }

    await user.save();

    res.json({ 
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/change-password - Change password (for users with existing password)
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has a password set
    if (!user.password) {
      return res.status(400).json({ message: 'You do not have a password set. Please set a password first.' });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/set-password - Set password for Google users (or users without password)
router.put('/set-password', protect, async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already has a password
    if (user.password) {
      return res.status(400).json({ message: 'You already have a password set. Use change password instead.' });
    }

    // Set password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password set successfully' });
  } catch (err) {
    console.error('Error setting password:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/auth/account - Delete user account and all associated data
router.delete('/account', protect, async (req, res) => {
  try {
    const userId = req.userId;

    // Delete all listings associated with this user
    await Listing.deleteMany({ user: userId });

    // Delete all notifications associated with this user (as provider)
    await Notification.deleteMany({ provider: userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Redirect to Google for login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Debug: Log environment variables
    console.log('🔍 Debugging OAuth Redirect:');
    console.log('  FRONTEND_URL:', process.env.FRONTEND_URL);
    console.log('  NODE_ENV:', process.env.NODE_ENV);
    
    // Get frontend URL - be more explicit about production
    let frontendUrl;
    if (process.env.FRONTEND_URL) {
      frontendUrl = process.env.FRONTEND_URL.trim(); // Remove any whitespace
    } else if (process.env.NODE_ENV === 'production') {
      // If in production and FRONTEND_URL is not set, this is an error
      console.error('❌ ERROR: FRONTEND_URL not set in production!');
      console.error('   This will cause redirect to localhost.');
      frontendUrl = 'https://tiffianhub-frontend.onrender.com'; // Fallback to your known URL
    } else {
      frontendUrl = 'http://localhost:3000'; // Development only
    }
    
    console.log('  Using frontendUrl:', frontendUrl);
    
    const redirectUrl = `${frontendUrl}/auth/google/success?token=${token}`;
    console.log('  Redirecting to:', redirectUrl);
    
    res.redirect(redirectUrl);
  }
);


module.exports = router;