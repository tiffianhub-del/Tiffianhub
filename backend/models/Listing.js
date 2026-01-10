// const mongoose = require('mongoose');

// const listingSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   price: { type: Number, required: true },
//   unit: { type: String, required: true },
//   status: { type: String, default: 'active' },
//   details: { type: String },
//   days: [{ type: String }],
//   method: { type: String },
//   cuisine: { type: String }, // e.g. "North Indian", "South Indian"
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// }, { timestamps: true });

// module.exports = mongoose.model('Listing', listingSchema);


const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: String,
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  days: [{ type: String }],
  method: String,
  cuisine: String,
  offdays: String,
  location: String,
  images: { type: [String], default: [] }, // Base64 strings
  status: { type: String, default: 'active' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 0, max: 5 },
    createdAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);


