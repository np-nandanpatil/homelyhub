const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

const router = express.Router();

// Dashboard stats
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });

    const bookingStats = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = bookingStats[0]?.totalRevenue || 0;

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('property', 'title location');

    res.json({
      totalUsers,
      totalProperties,
      totalBookings,
      confirmedBookings,
      totalRevenue,
      recentBookings
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user details
router.get('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userBookings = await Booking.find({ user: req.params.id });
    const userProperties = await Property.find({ host: req.params.id });

    res.json({
      user,
      bookings: userBookings,
      properties: userProperties
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Booking.deleteMany({ user: req.params.id });
    await Property.deleteMany({ host: req.params.id });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.put('/users/:id/role', auth, adminAuth, async (req, res) => {
  const { role } = req.body;

  if (!['user', 'host', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all properties
router.get('/properties', auth, adminAuth, async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('host', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get property details
router.get('/properties/:id', auth, adminAuth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('host', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const bookings = await Booking.find({ property: req.params.id })
      .populate('user', 'name email');

    res.json({
      property,
      bookings
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete property
router.delete('/properties/:id', auth, adminAuth, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    await Booking.deleteMany({ property: req.params.id });

    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
router.get('/bookings', auth, adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('property', 'title location price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking details
router.get('/bookings/:id', auth, adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user')
      .populate('property');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete booking
router.delete('/bookings/:id', auth, adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get revenue statistics
router.get('/stats/revenue', auth, adminAuth, async (req, res) => {
  try {
    const monthlyRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]);

    res.json(monthlyRevenue);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
