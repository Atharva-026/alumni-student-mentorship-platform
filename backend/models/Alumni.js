const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const alumniSchema = new mongoose.Schema(
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
    linkedInURL: String,
    company: String,
    designation: String,
    department: String,
    yearsOfExperience: Number,
    skills: [String],
    expertise: [String],
    industries: [String],
    mentorshipInterests: [String],
    availabilityPerWeek: String,
    mentorAvailability: [String],
    collegeAlumnus: String,
    batch: Number,
    accountStatus: {
      type: String,
      enum: ['active', 'inactive', 'deleted'],
      default: 'active'
    },
    invitationStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

alumniSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

alumniSchema.methods.comparePassword = async function(passwordInput) {
  return await bcrypt.compare(passwordInput, this.password);
};

module.exports = mongoose.model('Alumni', alumniSchema);