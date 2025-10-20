const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    phone: String,
    photo: String,
    collegeName: String,
    year: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: 3
    },
    branch: String,
    skills: [String],
    interests: [String],
    projectTopic: String,
    learningGoals: String,
    availability: [String],
    preferredMentorFields: [String],
    accountStatus: {
      type: String,
      enum: ['active', 'inactive', 'deleted'],
      default: 'active'
    }
  },
  { timestamps: true }
);

studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

studentSchema.methods.comparePassword = async function(passwordInput) {
  return await bcrypt.compare(passwordInput, this.password);
};

module.exports = mongoose.model('Student', studentSchema);