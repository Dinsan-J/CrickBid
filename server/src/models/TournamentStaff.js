import mongoose from 'mongoose';

const tournamentStaffSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true
    },
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
      enum: [
        'TOURNAMENT_ADMIN',
        'AUCTIONEER',
        'TEAM_OWNER',
        'TEAM_MANAGER',
        'PLAYER',
        'BROADCAST_OPERATOR'
      ],
      required: true
    },
    assignedTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      default: null
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

tournamentStaffSchema.index({ tournamentId: 1, userId: 1, role: 1 }, { unique: true });

export const TournamentStaff = mongoose.model('TournamentStaff', tournamentStaffSchema);
