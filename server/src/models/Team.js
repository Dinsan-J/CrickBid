import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true
    },
    organisationId: {
      type: String,
      default: 'org_mca_01'
    },
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true
    },
    shortCode: {
      type: String,
      required: [true, 'Short code is required'],
      uppercase: true,
      trim: true
    },
    logoUrl: {
      type: String,
      default: ''
    },
    owner: {
      type: String,
      required: true,
      default: 'Team Owner'
    },
    ownerEmail: {
      type: String,
      default: ''
    },
    primaryColorHex: {
      type: String,
      default: '#10b981'
    },
    secondaryColorHex: {
      type: String,
      default: '#047857'
    },
    totalPurse: {
      type: Number,
      default: 10000000
    },
    spentPurse: {
      type: Number,
      default: 0
    },
    remainingPurse: {
      type: Number,
      default: 10000000
    },
    squadSize: {
      type: Number,
      default: 0
    },
    maxSquadLimit: {
      type: Number,
      default: 15
    },
    minSquadLimit: {
      type: Number,
      default: 11
    }
  },
  {
    timestamps: true
  }
);

export const Team = mongoose.model('Team', teamSchema);
