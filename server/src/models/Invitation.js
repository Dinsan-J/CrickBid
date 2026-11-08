import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation',
      required: true
    },
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      default: null
    },
    scope: {
      type: String,
      enum: ['ORGANISATION', 'TOURNAMENT'],
      default: 'ORGANISATION'
    },
    role: {
      type: String,
      required: true
    },
    assignedTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED'],
      default: 'PENDING'
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    acceptedAt: {
      type: Date,
      default: null
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

invitationSchema.index({ email: 1, organisationId: 1, tournamentId: 1, status: 1 });

export const Invitation = mongoose.model('Invitation', invitationSchema);
