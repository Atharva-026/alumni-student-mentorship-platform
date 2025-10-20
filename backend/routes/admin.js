const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Alumni = require('../models/Alumni');
const { protect, generateToken } = require('../middleware/auth');

// @route   POST /api/admin/register
// @desc    Register a new admin
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, collegeName, department } = req.body;

    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    admin = new Admin({
      firstName,
      lastName,
      email,
      password,
      phone: phone || '',
      collegeName,
      department: department || ''
    });

    await admin.save();

    const token = generateToken(admin._id, 'admin');

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: `${admin.firstName} ${admin.lastName}`,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/admin/login
// @desc    Login admin
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id, 'admin');

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: `${admin.firstName} ${admin.lastName}`,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/admin/invite-alumni
// @desc    Invite alumni to platform
// @access  Private (Admin only)
router.post('/invite-alumni', protect, async (req, res) => {
  try {
    const { alumniEmail } = req.body;

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    let alumni = await Alumni.findOne({ email: alumniEmail });
    if (!alumni) {
      alumni = new Alumni({
        email: alumniEmail,
        firstName: 'Pending',
        lastName: 'Alumni',
        password: 'temp',
        company: '',
        designation: '',
        invitationStatus: 'pending'
      });
      await alumni.save();
    }

    res.status(200).json({
      success: true,
      message: 'Invitation sent successfully',
      alumni: {
        id: alumni._id,
        email: alumni.email,
        status: alumni.invitationStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;