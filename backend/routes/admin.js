const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Alumni = require('../models/Alumni');
const Student = require('../models/Student');
const Connection = require('../models/Connection');
const { protect } = require('../middleware/auth');
const { generateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// @route   POST /api/admin/register
// @desc    Register admin
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;

    // Verify secret key (you should set this in .env)
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ success: false, message: 'Invalid secret key' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword
    });

    await admin.save();

    const token = generateToken(admin._id, 'admin');

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/admin/login
// @desc    Login admin
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id, 'admin');

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Private (Admin only)
router.get('/stats', protect, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalAlumni = await Alumni.countDocuments();
    const activeAlumni = await Alumni.countDocuments({ accountStatus: 'active' });
    const pendingAlumni = await Alumni.countDocuments({ accountStatus: 'pending' });
    const totalConnections = await Connection.countDocuments();
    const activeConnections = await Connection.countDocuments({ status: 'active' });
    const pendingConnections = await Connection.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalAlumni,
        activeAlumni,
        pendingAlumni,
        totalConnections,
        activeConnections,
        pendingConnections
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/alumni
// @desc    Get all alumni (for management)
// @access  Private (Admin only)
router.get('/alumni', protect, async (req, res) => {
  try {
    const alumni = await Alumni.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: alumni.length,
      alumni
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/alumni/:id/approve
// @desc    Approve alumni account
// @access  Private (Admin only)
router.put('/alumni/:id/approve', protect, async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { accountStatus: 'active' },
      { new: true }
    ).select('-password');

    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    res.json({
      success: true,
      alumni,
      message: 'Alumni approved successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/alumni/:id/reject
// @desc    Reject alumni account
// @access  Private (Admin only)
router.put('/alumni/:id/reject', protect, async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { accountStatus: 'rejected' },
      { new: true }
    ).select('-password');

    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    res.json({
      success: true,
      alumni,
      message: 'Alumni rejected'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/alumni/:id
// @desc    Delete alumni account
// @access  Private (Admin only)
router.delete('/alumni/:id', protect, async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);

    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    // Also delete related connections
    await Connection.deleteMany({ alumniId: req.params.id });

    res.json({
      success: true,
      message: 'Alumni deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
