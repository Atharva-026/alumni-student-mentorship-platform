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

    // Check if connection already exists
    const existingConnection = await Connection.findOne({ studentId, alumniId });
    if (existingConnection) {
      return res.status(400).json({ success: false, message: 'Connection request already exists' });
    }

    // Calculate match score
    const matchScore = calculateMatchScore(student, alumni);

    // Create connection with PENDING status (waiting for alumni approval)
    const connection = new Connection({
      studentId,
      alumniId,
      matchScore,
      status: 'pending',  // Changed from 'active' to 'pending'
      initiatedBy: 'student'
    });

    await connection.save();

    res.status(201).json({
      success: true,
      connection,
      message: 'Connection request sent successfully'
    });
  } catch (error) {
    console.error('Create connection error:', error);
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
// @route   GET /api/connection/alumni/:alumniId/requests
// @desc    Get pending connection requests for alumni
// @access  Private
router.get('/alumni/:alumniId/requests', protect, async (req, res) => {
  try {
    const connections = await Connection.find({
      alumniId: req.params.alumniId,
      status: 'pending'
    })
    .populate('studentId', 'firstName lastName email collegeName skills interests')
    .sort({ createdAt: -1 });

    // Format the response
    const formattedConnections = connections.map(conn => ({
      _id: conn._id,
      studentId: conn.studentId._id,
      studentName: `${conn.studentId.firstName} ${conn.studentId.lastName}`,
      studentEmail: conn.studentId.email,
      studentCollege: conn.studentId.collegeName,
      studentSkills: conn.studentId.skills,
      studentInterests: conn.studentId.interests,
      matchScore: conn.matchScore,
      createdAt: conn.createdAt
    }));

    res.status(200).json({
      success: true,
      count: formattedConnections.length,
      connections: formattedConnections
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/connection/alumni/:alumniId/accepted
// @desc    Get accepted connections for alumni
// @access  Private
router.get('/alumni/:alumniId/accepted', protect, async (req, res) => {
  try {
    const connections = await Connection.find({
      alumniId: req.params.alumniId,
      status: 'active'
    })
    .populate('studentId', 'firstName lastName email collegeName')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: connections.length,
      connections
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Add these routes to your existing routes/connection.js file

// @route   POST /api/connection/accept/:connectionId
// @desc    Accept connection request (Alumni accepts student's request)
// @access  Private
router.post('/accept/:connectionId', protect, async (req, res) => {
  try {
    console.log('Accepting connection:', req.params.connectionId);
    
    const connection = await Connection.findById(req.params.connectionId);
    
    if (!connection) {
      return res.status(404).json({ 
        success: false, 
        message: 'Connection not found' 
      });
    }

    // Verify that the alumni is the one accepting
    if (connection.alumniId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to accept this connection' 
      });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Connection is not pending' 
      });
    }

    connection.status = 'active';
    connection.lastActivityAt = new Date();
    await connection.save();

    console.log('Connection accepted successfully');

    res.status(200).json({
      success: true,
      connection,
      message: 'Connection accepted successfully'
    });
  } catch (error) {
    console.error('Accept connection error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// @route   POST /api/connection/reject/:connectionId
// @desc    Reject connection request (Alumni rejects student's request)
// @access  Private
router.post('/reject/:connectionId', protect, async (req, res) => {
  try {
    console.log('Rejecting connection:', req.params.connectionId);
    
    const connection = await Connection.findById(req.params.connectionId);
    
    if (!connection) {
      return res.status(404).json({ 
        success: false, 
        message: 'Connection not found' 
      });
    }

    // Verify that the alumni is the one rejecting
    if (connection.alumniId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to reject this connection' 
      });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Connection is not pending' 
      });
    }

    connection.status = 'rejected';
    connection.lastActivityAt = new Date();
    await connection.save();

    console.log('Connection rejected successfully');

    res.status(200).json({
      success: true,
      connection,
      message: 'Connection rejected successfully'
    });
  } catch (error) {
    console.error('Reject connection error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});
// @route   GET /api/connection/alumni/:alumniId/all-students
// @desc    Get all students for alumni to browse
// @access  Private
router.get('/alumni/:alumniId/all-students', protect, async (req, res) => {
  try {
    const students = await Student.find({ accountStatus: 'active' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// @route   GET /api/connection/student/:studentId/connected
// @desc    Get all accepted/active connections for a student
// @access  Private
router.get('/student/:studentId/connected', protect, async (req, res) => {
  try {
    const connections = await Connection.find({
      studentId: req.params.studentId,
      status: 'active'
    })
    .populate('alumniId', 'firstName lastName email company designation expertise skills yearsOfExperience')
    .sort({ createdAt: -1 });

    const formattedConnections = connections.map(conn => ({
      _id: conn._id,
      alumniId: conn.alumniId._id,
      alumniName: `${conn.alumniId.firstName} ${conn.alumniId.lastName}`,
      alumniEmail: conn.alumniId.email,
      alumniCompany: conn.alumniId.company,
      alumniDesignation: conn.alumniId.designation,
      alumniExpertise: conn.alumniId.expertise,
      alumniSkills: conn.alumniId.skills,
      alumniExperience: conn.alumniId.yearsOfExperience,
      matchScore: conn.matchScore,
      connectedAt: conn.updatedAt
    }));

    res.status(200).json({
      success: true,
      count: formattedConnections.length,
      connections: formattedConnections
    });
  } catch (error) {
    console.error('Get connected alumni error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;