import mongoose from 'mongoose';

const auctionSessionSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
      unique: true
    },
    activePlayerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      default: null
    },
    currentBidderTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },
    currentBidAmount: {
      type: Number,
      default: 0
    },
    startingBidAmount: {
      type: Number,
      default: 0
    },
    bidCount: {
      type: Number,
      default: 0
    },
    sessionStatus: {
      type: String,
      enum: ['IDLE', 'IN_PROGRESS', 'PAUSED', 'COMPLETED'],
      default: 'IDLE'
    },
    hasBidsPlaced: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const AuctionSession = mongoose.model('AuctionSession', auctionSessionSchema);
