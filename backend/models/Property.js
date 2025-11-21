const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  maxGuests: { type: Number, required: true },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  type: { type: String, enum: ['apartment', 'house', 'villa', 'room'], default: 'apartment' },
  availability: [{
    date: { type: Date },
    available: { type: Boolean, default: true }
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Property', propertySchema);