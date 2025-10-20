const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
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
    collegeName: {
      type: String,
      required: true
    },
    department: String,
    role: {
      type: String,
      enum: ['admin', 'faculty', 'coordinator'],
      default: 'faculty'
    },
    canInviteAlumni: { type: Boolean, default: true },
    canManageAlumni: { type: Boolean, default: true },
    canViewMetrics: { type: Boolean, default: true },
    accountStatus: {
      type: String,
      enum: ['active', 'inactive', 'deleted'],
      default: 'active'
    }
  },
  { timestamps: true }
);

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

adminSchema.methods.comparePassword = async function(passwordInput) {
  return await bcrypt.compare(passwordInput, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);