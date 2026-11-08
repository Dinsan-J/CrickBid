import mongoose from 'mongoose';

const organisationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organisation name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    logoUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80'
    },
    planTier: {
      type: String,
      enum: ['FREE', 'PRO_SAAS', 'MANAGED_ENTERPRISE'],
      default: 'PRO_SAAS'
    },
    contactEmail: {
      type: String,
      default: ''
    },
    contactPhone: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED'],
      default: 'ACTIVE'
    }
  },
  {
    timestamps: true
  }
);

export const Organisation = mongoose.model('Organisation', organisationSchema);
