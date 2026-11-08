import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Organisation } from '../models/Organisation.js';
import { OrganisationMember } from '../models/OrganisationMember.js';
import { Tournament } from '../models/Tournament.js';
import { TournamentStaff } from '../models/TournamentStaff.js';
import { Team } from '../models/Team.js';
import { Player } from '../models/Player.js';
import { AuctionSession } from '../models/AuctionSession.js';

export async function seedDatabase() {
  try {
    console.log('[Seed] Checking database collections and running safe RBAC migration...');

    // 1. Check or Create Default Users
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('CricketBid2026!', salt);

    // Super Admin
    let superAdmin = await User.findOne({ email: 'admin@cricketbid.lk' });
    if (!superAdmin) {
      superAdmin = await User.create({
        name: 'Dharshana Senanayake (Super Admin)',
        email: 'admin@cricketbid.lk',
        passwordHash: defaultPasswordHash,
        phone: '+94 11 234 5678',
        platformRole: 'SUPER_ADMIN',
        isEmailVerified: true
      });
      console.log('[Seed] Super Administrator created: admin@cricketbid.lk');
    }

    // Org Owner
    let orgOwner = await User.findOne({ email: 'kusal.owner@colombocricket.lk' });
    if (!orgOwner) {
      orgOwner = await User.create({
        name: 'Kusal Mendis',
        email: 'kusal.owner@colombocricket.lk',
        passwordHash: defaultPasswordHash,
        phone: '+94 77 123 4567',
        platformRole: 'NONE',
        isEmailVerified: true
      });
      console.log('[Seed] Org Owner user created: kusal.owner@colombocricket.lk');
    }

    // Auctioneer
    let auctioneer = await User.findOne({ email: 'auctioneer@colombocricket.lk' });
    if (!auctioneer) {
      auctioneer = await User.create({
        name: 'Charu Sharma (Master Auctioneer)',
        email: 'auctioneer@colombocricket.lk',
        passwordHash: defaultPasswordHash,
        phone: '+94 77 999 8888',
        platformRole: 'NONE',
        isEmailVerified: true
      });
      console.log('[Seed] Auctioneer user created: auctioneer@colombocricket.lk');
    }

    // Team Owner (Colombo Kings)
    let teamOwner = await User.findOne({ email: 'ranjan.owner@colombokings.lk' });
    if (!teamOwner) {
      teamOwner = await User.create({
        name: 'Ranjan Madugalle',
        email: 'ranjan.owner@colombokings.lk',
        passwordHash: defaultPasswordHash,
        phone: '+94 77 222 3333',
        platformRole: 'NONE',
        isEmailVerified: true
      });
      console.log('[Seed] Team Owner user created: ranjan.owner@colombokings.lk');
    }

    // Broadcast Operator
    let broadcastOp = await User.findOne({ email: 'broadcast@colombocricket.lk' });
    if (!broadcastOp) {
      broadcastOp = await User.create({
        name: 'Thilina OBS Lead',
        email: 'broadcast@colombocricket.lk',
        passwordHash: defaultPasswordHash,
        phone: '+94 71 333 4444',
        platformRole: 'NONE',
        isEmailVerified: true
      });
      console.log('[Seed] Broadcast Operator user created: broadcast@colombocricket.lk');
    }

    // Regular Spectator
    let spectator = await User.findOne({ email: 'spectator@cricketbid.lk' });
    if (!spectator) {
      spectator = await User.create({
        name: 'Nimal Perera (Spectator)',
        email: 'spectator@cricketbid.lk',
        passwordHash: defaultPasswordHash,
        phone: '+94 75 000 1111',
        platformRole: 'NONE',
        isEmailVerified: true
      });
      console.log('[Seed] Regular Spectator created: spectator@cricketbid.lk');
    }

    // 2. Check or Create Default Organisation
    let organisation = await Organisation.findOne({ slug: 'mca-srilanka' });
    if (!organisation) {
      organisation = await Organisation.create({
        name: 'Mercantile Cricket Association',
        slug: 'mca-srilanka',
        ownerId: orgOwner._id,
        logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80',
        planTier: 'PRO_SAAS',
        contactEmail: 'info@colombocricket.lk',
        contactPhone: '+94 11 234 5678'
      });
      console.log('[Seed] Organisation created: Mercantile Cricket Association');
    }

    // 3. Link Organisation Members
    await OrganisationMember.findOneAndUpdate(
      { organisationId: organisation._id, userId: orgOwner._id },
      { organisationId: organisation._id, userId: orgOwner._id, role: 'ORG_OWNER', status: 'ACTIVE' },
      { upsert: true }
    );

    // 4. Check or Create Active Tournament
    let tournament = await Tournament.findOne({ slug: 'mca-premier-league-2026' });
    if (!tournament) {
      tournament = await Tournament.create({
        name: 'MCA Premier League 2026',
        slug: 'mca-premier-league-2026',
        season: '2026',
        auctionType: 'MONEY',
        currencyCode: 'LKR',
        startingPurse: 10000000,
        purseDisplay: 'LKR 10,000,000',
        status: 'AUCTION_LIVE',
        hasStartedBidding: false,
        bidsCount: 0,
        organisationId: organisation._id,
        squadRules: {
          minPlayers: 11,
          maxPlayers: 15,
          maxOverseas: 2
        }
      });
      console.log('[Seed] Tournament created: MCA Premier League 2026');
    } else if (tournament.organisationId !== String(organisation._id)) {
      tournament.organisationId = organisation._id;
      await tournament.save();
    }

    // 5. Check or Create Teams
    let colomboKings = await Team.findOne({ shortCode: 'CK', tournamentId: tournament._id });
    if (!colomboKings) {
      colomboKings = await Team.create({
        tournamentId: tournament._id,
        organisationId: organisation._id,
        name: 'Colombo Kings',
        shortCode: 'CK',
        logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=120&auto=format&fit=crop&q=80',
        owner: 'Ranjan Madugalle',
        ownerEmail: 'ranjan.owner@colombokings.lk',
        primaryColorHex: '#1e40af',
        secondaryColorHex: '#fbbf24',
        totalPurse: 10000000,
        spentPurse: 6550000,
        remainingPurse: 3450000,
        squadSize: 11,
        maxSquadLimit: 15,
        minSquadLimit: 11
      });
    }

    let kandyWarriors = await Team.findOne({ shortCode: 'KW', tournamentId: tournament._id });
    if (!kandyWarriors) {
      kandyWarriors = await Team.create({
        tournamentId: tournament._id,
        organisationId: organisation._id,
        name: 'Kandy Warriors',
        shortCode: 'KW',
        logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=120&auto=format&fit=crop&q=80',
        owner: 'Aravinda de Silva',
        ownerEmail: 'aravinda@kandywarriors.lk',
        primaryColorHex: '#b91c1c',
        secondaryColorHex: '#f97316',
        totalPurse: 10000000,
        spentPurse: 7100000,
        remainingPurse: 2900000,
        squadSize: 10,
        maxSquadLimit: 15,
        minSquadLimit: 11
      });
    }

    let galleTitans = await Team.findOne({ shortCode: 'GT', tournamentId: tournament._id });
    if (!galleTitans) {
      galleTitans = await Team.create({
        tournamentId: tournament._id,
        organisationId: organisation._id,
        name: 'Galle Titans',
        shortCode: 'GT',
        logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=120&auto=format&fit=crop&q=80',
        owner: 'Upul Tharanga',
        ownerEmail: 'upul@galletitans.lk',
        primaryColorHex: '#047857',
        secondaryColorHex: '#10b981',
        totalPurse: 10000000,
        spentPurse: 5800000,
        remainingPurse: 4200000,
        squadSize: 9,
        maxSquadLimit: 15,
        minSquadLimit: 11
      });
    }

    let jaffnaStallions = await Team.findOne({ shortCode: 'JS', tournamentId: tournament._id });
    if (!jaffnaStallions) {
      jaffnaStallions = await Team.create({
        tournamentId: tournament._id,
        organisationId: organisation._id,
        name: 'Jaffna Stallions',
        shortCode: 'JS',
        logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=120&auto=format&fit=crop&q=80',
        owner: 'Thilina Kandamby',
        ownerEmail: 'thilina@jaffnastallions.lk',
        primaryColorHex: '#6d28d9',
        secondaryColorHex: '#c084fc',
        totalPurse: 10000000,
        spentPurse: 4500000,
        remainingPurse: 5500000,
        squadSize: 8,
        maxSquadLimit: 15,
        minSquadLimit: 11
      });
    }

    // 6. Link Tournament Staff with Scoped Roles
    // Auctioneer for MCA Premier League 2026 only
    await TournamentStaff.findOneAndUpdate(
      { tournamentId: tournament._id, userId: auctioneer._id, role: 'AUCTIONEER' },
      {
        tournamentId: tournament._id,
        organisationId: organisation._id,
        userId: auctioneer._id,
        role: 'AUCTIONEER',
        status: 'ACTIVE'
      },
      { upsert: true }
    );

    // Team Owner for Colombo Kings in this tournament
    await TournamentStaff.findOneAndUpdate(
      { tournamentId: tournament._id, userId: teamOwner._id, role: 'TEAM_OWNER' },
      {
        tournamentId: tournament._id,
        organisationId: organisation._id,
        userId: teamOwner._id,
        role: 'TEAM_OWNER',
        assignedTeamId: colomboKings._id,
        status: 'ACTIVE'
      },
      { upsert: true }
    );

    // Broadcast Operator for this tournament
    await TournamentStaff.findOneAndUpdate(
      { tournamentId: tournament._id, userId: broadcastOp._id, role: 'BROADCAST_OPERATOR' },
      {
        tournamentId: tournament._id,
        organisationId: organisation._id,
        userId: broadcastOp._id,
        role: 'BROADCAST_OPERATOR',
        status: 'ACTIVE'
      },
      { upsert: true }
    );

    // 7. Check or Create Auction Session
    let session = await AuctionSession.findOne({ tournamentId: tournament._id });
    if (!session) {
      await AuctionSession.create({
        tournamentId: tournament._id,
        sessionStatus: 'IN_PROGRESS',
        hasBidsPlaced: false,
        bidCount: 0
      });
    }

    console.log('[Seed] RBAC data & scoped memberships safely seeded and migrated!');
    return { organisation, tournament, users: { superAdmin, orgOwner, auctioneer, teamOwner, broadcastOp, spectator } };
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
}
