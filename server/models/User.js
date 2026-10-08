import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    education: {
      university: { type: String, default: '', trim: true },
      degree: { type: String, default: '', trim: true },
      major: { type: String, default: '', trim: true },
      graduationYear: { type: String, default: '', trim: true }
    },
    location: {
      type: String,
      default: '',
      trim: true
    },
    preferredRoles: {
      type: [String],
      default: []
    },
    workMode: {
      type: String,
      enum: [
        'Remote', 'Hybrid', 'On-site', 'Any',
        'remote', 'hybrid', 'onsite', 'on-site', 'any'
      ],
      default: 'Any'
    },
    experienceLevel: {
      type: String,
      enum: [
        'Student', 'Fresher', '0–1 years', '0-1 years', '1–3 years', '1-3 years',
        'internship', 'entry-level', 'junior', 'all'
      ],
      default: 'Student'
    },
    resumePath: {
      type: String,
      default: ''
    },
    candidateProfile: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook: Hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to verify entered password against stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to return safe public user profile representation
userSchema.methods.toSafeObject = function () {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};

const User = mongoose.model('User', userSchema);

export default User;
