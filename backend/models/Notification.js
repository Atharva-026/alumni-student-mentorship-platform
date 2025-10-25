const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // Recipient & Sender
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    senderName: String,
    senderPhoto: String,
    
    // Notification Details
    type: {
      type: String,
      enum: ['like', 'comment', 'mention', 'connection', 'message'],
      required: true
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Connection'
    },
    
    // Message
    message: String,
    
    // Status
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);