const express = require('express');
const router = express.Router();
const Connection = require('../models/Connection');
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');
const { calculateMatchScore, getTopStudentMatches, getTopAlumniMatches } = require('../utils/matchingAlgorithm');

// @route   GET /api/connection/student-matches/:studentId
// @desc    Get recommended alumni for a student
// @access  Private
router.get('/student-matches/:studentId', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const allAlumni = await Alumni.find({ accountStatus: 'active' });

    if (allAlumni.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No alumni available yet',
        matches: []
      });
    }

    const matches = getTopStudentMatches(student, allAlumni, 5);

    res.status(200).json({
      success: true,
      count: matches.length,
      matches: matches.map(match => ({
        alumni: match.alumni,
        matchScore: match.matchScore
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/connection/alumni-matches/:alumniId
// @desc    Get recommended students for alumni
// @access  Private
router.get('/alumni-matches/:alumniId', protect, async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.alumniId);
    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    const allStudents = await Student.find({ accountStatus: 'active' });

    if (allStudents.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No students available yet',
        matches: []
      });
    }

    const matches = getTopAlumniMatches(alumni, allStudents, 5);

    res.status(200).json({
      success: true,
      count: matches.length,
      matches: matches.map(match => ({
        student: match.student,
        matchScore: match.matchScore
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/connection/create
// @desc    Create connection between student and alumni
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const { studentId, alumniId } = req.body;

    if (!studentId || !alumniId) {
      return res.status(400).json({ success: false, message: 'Student and Alumni IDs required' });
    }

    const student = await Student.findById(studentId);
    const alumni = await Alumni.findById(alumniId);

    if (!student || !alumni) {
      return res.status(404).json({ success: false, message: 'Student or Alumni not found' });
    }

    const existingConnection = await Connection.findOne({ studentId, alumniId });
    if (existingConnection) {
      return res.status(400).json({ success: false, message: 'Connection already exists' });
    }

    const matchScore = calculateMatchScore(student, alumni);

    const connection = new Connection({
      studentId,
      alumniId,
      matchScore,
      status: 'active',
      initiatedBy: 'student'
    });

    await connection.save();

    res.status(201).json({
      success: true,
      connection,
      message: 'Connection created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/connection/send-message
// @desc    Send message in a connection
// @access  Private
router.post('/send-message', protect, async (req, res) => {
  try {
    const { connectionId, senderId, senderType, receiverId, message } = req.body;

    if (!connectionId || !senderId || !senderType || !receiverId || !message) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const newMessage = new Message({
      connectionId,
      senderId,
      senderType,
      receiverId,
      message
    });

    await newMessage.save();

    await Connection.findByIdAndUpdate(
      connectionId,
      { lastMessageAt: new Date(), lastActivityAt: new Date() }
    );

    res.status(201).json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/connection/:connectionId/messages
// @desc    Get all messages in a connection
// @access  Private
router.get('/:connectionId/messages', protect, async (req, res) => {
  try {
    const messages = await Message.find({ connectionId: req.params.connectionId }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/connection/:studentId/all-alumni
// @desc    Get all alumni for student to browse
// @access  Private
router.get('/:studentId/all-alumni', protect, async (req, res) => {
  try {
    const alumni = await Alumni.find({ accountStatus: 'active' }).select('-password');

    res.status(200).json({
      success: true,
      count: alumni.length,
      alumni
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;