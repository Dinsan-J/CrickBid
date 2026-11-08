import mongoose from 'mongoose';

const organisationMemberSchema = new mongoose.Schema(
  {
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_ORGANISER'],
      default: 'ORG_ADMIN',
      required: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED'],
      default: 'ACTIVE'
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

organisationMemberSchema.index({ organisationId: 1, userId: 1 }, { unique: true });

export const OrganisationMember = mongoose.model('OrganisationMember', organisationMemberSchema);
