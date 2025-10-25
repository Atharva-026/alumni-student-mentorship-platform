const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    // Author Info
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    authorType: {
      type: String,
      enum: ['student', 'alumni'],
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    authorPhoto: String,
    authorCompany: String,
    
    // Post Content
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    content: {
      type: String,
      required: true
    },
    image: String,
    
    // Post Metadata
    postType: {
      type: String,
      enum: ['opportunity', 'course', 'project', 'article', 'achievement', 'tip', 'other'],
      default: 'other'
    },
    tags: [String],
    category: String,
    
    // Engagement
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      }
    ],
    comments: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        commentorId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        commentorName: String,
        commentorPhoto: String,
        commentorType: {
          type: String,
          enum: ['student', 'alumni']
        },
        text: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      }
    ],
    views: {
      type: Number,
      default: 0
    },
    
    // Status
    isEdited: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);