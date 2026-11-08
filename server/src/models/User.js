import mongoose from 'mongoose';

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
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    platformRole: {
      type: String,
      enum: ['SUPER_ADMIN', 'PLATFORM_STAFF', 'NONE'],
      default: 'NONE'
    },
    isEmailVerified: {
      type: Boolean,
      default: true
    },
    verificationToken: {
      type: String,
      default: null
    },
    lastLoginAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model('User', userSchema);
