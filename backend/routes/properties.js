const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');
const { validatePropertyData } = require('../middleware/validation');
const Property = require('../models/Property');

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all properties
router.get('/', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, amenities } = req.query;
    let query = {};
    if (location) query.location = new RegExp(location, 'i');
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
    if (amenities) query.amenities = { $in: amenities.split(',') };

    const properties = await Property.find(query).populate('host', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('host', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create property (host only)
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  if (req.user.role !== 'host' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only hosts can create properties' });
  }

  const { title, description, location, price, amenities, maxGuests, bedrooms, bathrooms, type } = req.body;
  
  // Validate required fields
  const errors = validatePropertyData({ title, description, location, price, maxGuests, bedrooms, bathrooms, type });
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'At least one image is required' });
  }

  const images = req.files.map(file => file.filename);
  try {
    const property = new Property({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      price: parseFloat(price),
      images,
      amenities: amenities ? amenities.split(',').map(a => a.trim()) : [],
      maxGuests: parseInt(maxGuests),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      type,
      host: req.user.id
    });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update property
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.host.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const updates = req.body;
    if (req.files) updates.images = req.files.map(file => file.filename);
    if (updates.amenities) updates.amenities = updates.amenities.split(',');

    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updatedProperty);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete property
router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.host.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get properties by host
router.get('/host/:hostId', auth, async (req, res) => {
  try {
    const properties = await Property.find({ host: req.params.hostId });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;