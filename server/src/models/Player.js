import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
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
    registrationNumber: {
      type: String,
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    photoUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80'
    },
    dob: {
      type: String,
      required: [true, 'Date of birth is required']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male'
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    whatsapp: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    town: {
      type: String,
      required: [true, 'Town is required'],
      trim: true
    },
    playingRole: {
      type: String,
      enum: [
        'TOP_ORDER_BATSMAN',
        'MIDDLE_ORDER_BATSMAN',
        'WICKET_KEEPER_BATSMAN',
        'BATTING_ALL_ROUNDER',
        'BOWLING_ALL_ROUNDER',
        'FAST_BOWLER',
        'SPIN_BOWLER'
      ],
      required: [true, 'Playing role is required']
    },
    battingStyle: {
      type: String,
      enum: ['RIGHT_HAND', 'LEFT_HAND'],
      required: [true, 'Batting style is required']
    },
    bowlingStyle: {
      type: String,
      default: 'Right-Arm Medium'
    },
    experience: {
      type: String,
      trim: true,
      default: 'Club Cricket'
    },
    additionalInfo: {
      type: String,
      trim: true,
      default: ''
    },
    whatsappConsent: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: [
        'PENDING',
        'APPROVED',
        'REJECTED',
        'SHORTLISTED',
        'UNDER_THE_HAMMER',
        'SOLD',
        'UNSOLD'
      ],
      default: 'PENDING'
    },
    basePrice: {
      type: Number,
      default: 50000
    },
    soldPrice: {
      type: Number,
      default: null
    },
    soldToTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },
    soldToTeamName: {
      type: String,
      default: null
    },
    category: {
      type: String,
      enum: ['ICON', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE'],
      default: 'GOLD'
    },
    lotNumber: {
      type: Number,
      default: null
    },
    // Career Cricket Statistics for Cinematic Profile Presentation
    stats: {
      matches: { type: Number, default: 42 },
      runs: { type: Number, default: 1250 },
      highestScore: { type: String, default: '94*' },
      battingAverage: { type: Number, default: 34.7 },
      strikeRate: { type: Number, default: 138.5 },
      wickets: { type: Number, default: 18 },
      bestBowling: { type: String, default: '4/22' },
      economy: { type: Number, default: 7.2 },
      catches: { type: Number, default: 14 }
    }
  },
  {
    timestamps: true
  }
);

// Compound index to prevent duplicate registrations for the same tournament with the same phone
playerSchema.index({ tournamentId: 1, phone: 1 }, { unique: true });

export const Player = mongoose.model('Player', playerSchema);
