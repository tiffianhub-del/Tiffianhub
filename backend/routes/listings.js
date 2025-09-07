// // routes/listings.js
// const express = require('express');
// const router = express.Router();
// const Listing = require('../models/Listing');
// const { protect } = require('../middleware/auth');

// // @desc    Get all listings
// // @route   GET /api/listings
// router.get('/', async (req, res) => {
//   try {
//     const listings = await Listing.find();
//     res.json({ listings });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // @desc    Create new listing
// // @route   POST /api/listings
// router.post('/', protect, async (req, res) => {
//   try {
//     const listing = await Listing.create({
//       ...req.body,
//       user: req.user._id, // link listing to logged-in user
//     });

//     res.status(201).json(listing);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // ✅ NEW: Get listings for logged-in provider
// router.get('/my', protect, async (req, res) => {
//   const listings = await Listing.find({ user: req.user._id });
//   res.json({ listings });
// });

// // Update a listing (provider only)
// router.put('/:id', protect, async (req, res) => {
//   try {
//     const listing = await Listing.findById(req.params.id);

//     if (!listing) {
//       return res.status(404).json({ message: 'Listing not found' });
//     }

//     // Ensure the logged-in user owns the listing
//     if (listing.user.toString() !== req.user.id) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }

//     // Update fields
//     Object.assign(listing, req.body);
//     const updatedListing = await listing.save();

//     res.json(updatedListing);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// // Delete a listing (provider only)
// router.delete('/:id', protect, async (req, res) => {
//   try {
//     const listing = await Listing.findById(req.params.id);

//     if (!listing) {
//       return res.status(404).json({ message: 'Listing not found' });
//     }

//     // Ensure the logged-in user owns the listing
//     if (listing.user.toString() !== req.user.id) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }

//     await listing.deleteOne();
//     res.json({ message: 'Listing removed' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// // GET /api/listings?page=1&limit=9
// router.get('/', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 9;

//     const skip = (page - 1) * limit;

//     const total = await Listing.countDocuments();
//     const listings = await Listing.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     res.json({
//       listings,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch listings' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

// GET all listings with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const total = await Listing.countDocuments();
    const listings = await Listing.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ listings, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET listings for logged-in user
router.get('/my', protect, async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user._id });
    res.json({ listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE listing (Base64 images)
router.post('/', protect, async (req, res) => {
  try {
    const { title, details, price, unit, days, method, cuisine, offdays, images } = req.body;

    if (!title || !price || !unit) {
      return res.status(400).json({ message: 'Title, price, and unit are required.' });
    }

    const listing = await Listing.create({
      title,
      details,
      price,
      unit,
      days: days || [],
      method,
      cuisine,
      offdays,
      images: images || [], // Base64 strings
      user: req.user._id,
    });

    res.status(201).json(listing);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE listing
router.put('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    Object.assign(listing, req.body); // updates any field, including images
    const updatedListing = await listing.save();
    res.json(updatedListing);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE listing
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    await listing.deleteOne();
    res.json({ message: 'Listing removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
