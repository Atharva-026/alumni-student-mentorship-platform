const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumni',
      required: true
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    matchReason: String,
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'rejected'],
      default: 'active'
    },
    initiatedBy: {
      type: String,
      enum: ['system', 'student', 'alumni'],
      default: 'system'
    },
    lastMessageAt: Date,
    lastActivityAt: Date,
    studentRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    studentFeedback: String,
    alumniRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    alumniFeedback: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Connection', connectionSchema);