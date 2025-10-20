const express = require('express');
const router = express.Router();
const Alumni = require('../models/Alumni');
const { protect, generateToken } = require('../middleware/auth');

// @route   POST /api/alumni/register
// @desc    Register a new alumni
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, company, designation, expertise, skills, yearsOfExperience } = req.body;

    let alumni = await Alumni.findOne({ email });
    if (alumni) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    alumni = new Alumni({
      firstName,
      lastName,
      email,
      password,
      phone: phone || '',
      company,
      designation,
      expertise: expertise || [],
      skills: skills || [],
      yearsOfExperience: yearsOfExperience || 0
    });

    await alumni.save();

    const token = generateToken(alumni._id, 'alumni');

    res.status(201).json({
      success: true,
      token,
      alumni: {
        id: alumni._id,
        name: `${alumni.firstName} ${alumni.lastName}`,
        email: alumni.email
      }
    });
  } catch (error) {
    console.error('Alumni registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/alumni/login
// @desc    Login alumni
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const alumni = await Alumni.findOne({ email }).select('+password');
    if (!alumni) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await alumni.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(alumni._id, 'alumni');

    res.status(200).json({
      success: true,
      token,
      alumni: {
        id: alumni._id,
        name: `${alumni.firstName} ${alumni.lastName}`,
        email: alumni.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/alumni/:id
// @desc    Get alumni profile
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }
    res.status(200).json({ success: true, alumni });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/alumni/:id
// @desc    Update alumni profile
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let alumni = await Alumni.findById(req.params.id);
    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    alumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, alumni });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;