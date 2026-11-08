import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tournament name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    season: {
      type: String,
      default: '2026'
    },
    auctionType: {
      type: String,
      enum: ['POINTS', 'MONEY'],
      default: 'MONEY',
      required: true
    },
    currencyCode: {
      type: String,
      enum: ['LKR', 'USD', 'PTS'],
      default: 'LKR',
      required: true
    },
    startingPurse: {
      type: Number,
      default: 10000000
    },
    purseDisplay: {
      type: String,
      default: 'LKR 10,000,000'
    },
    status: {
      type: String,
      enum: [
        'DRAFT',
        'REGISTRATION_OPEN',
        'AUCTION_SCHEDULED',
        'AUCTION_LIVE',
        'AUCTION_PAUSED',
        'COMPLETED'
      ],
      default: 'REGISTRATION_OPEN'
    },
    hasStartedBidding: {
      type: Boolean,
      default: false
    },
    bidsCount: {
      type: Number,
      default: 0
    },
    organisationId: {
      type: String,
      default: 'org_mca_01'
    },
    squadRules: {
      minPlayers: { type: Number, default: 11 },
      maxPlayers: { type: Number, default: 15 },
      maxOverseas: { type: Number, default: 2 }
    }
  },
  {
    timestamps: true
  }
);

export const Tournament = mongoose.model('Tournament', tournamentSchema);
