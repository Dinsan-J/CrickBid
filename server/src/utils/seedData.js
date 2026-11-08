import mongoose from 'mongoose';
import { Tournament } from '../models/Tournament.js';
import { Team } from '../models/Team.js';
import { Player } from '../models/Player.js';
import { AuctionSession } from '../models/AuctionSession.js';

export async function seedDatabase() {
  try {
    const tournamentCount = await Tournament.countDocuments();
    if (tournamentCount > 0) {
      console.log('[Seed] Database already seeded. Skipping initial seed.');
      const activeTournament = await Tournament.findOne({ slug: 'mca-premier-league-2026' });
      return activeTournament;
    }

    console.log('[Seed] Seeding initial tournament, teams, and players into MongoDB...');

    // 1. Create Active Tournament
    const tournament = await Tournament.create({
      name: 'MCA Premier League 2026',
      slug: 'mca-premier-league-2026',
      season: '2026',
      auctionType: 'MONEY',
      currencyCode: 'LKR',
      startingPurse: 10000000,
      purseDisplay: 'LKR 10,000,000',
      status: 'AUCTION_LIVE',
      hasStartedBidding: false, // will allow toggling until bidding starts
      bidsCount: 0,
      organisationId: 'org_mca_01',
      squadRules: {
        minPlayers: 11,
        maxPlayers: 15,
        maxOverseas: 2
      }
    });

    // 2. Create Teams
    const colomboKings = await Team.create({
      tournamentId: tournament._id,
      organisationId: 'org_mca_01',
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

    const kandyWarriors = await Team.create({
      tournamentId: tournament._id,
      organisationId: 'org_mca_01',
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

    const galleTitans = await Team.create({
      tournamentId: tournament._id,
      organisationId: 'org_mca_01',
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

    const jaffnaStallions = await Team.create({
      tournamentId: tournament._id,
      organisationId: 'org_mca_01',
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

    // 3. Create Players
    const playersToSeed = [
      {
        tournamentId: tournament._id,
        registrationNumber: 'REG-2026-001',
        fullName: 'Pathum Nissanka',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        dob: '1998-05-18',
        gender: 'Male',
        phone: '+94 77 123 4567',
        whatsapp: '+94 77 123 4567',
        district: 'Galle',
        town: 'Kalegana',
        playingRole: 'TOP_ORDER_BATSMAN',
        battingStyle: 'RIGHT_HAND',
        bowlingStyle: 'Right-Arm Off Spin',
        experience: 'Sri Lanka National Team, 50+ ODIs, Double Century in ODIs',
        additionalInfo: 'First Sri Lankan to score an ODI double hundred. High strike rate powerplay specialist.',
        status: 'UNDER_THE_HAMMER',
        category: 'ICON',
        basePrice: 100000,
        lotNumber: 18,
        stats: {
          matches: 58,
          runs: 2140,
          highestScore: '210*',
          battingAverage: 42.8,
          strikeRate: 139.2,
          wickets: 4,
          bestBowling: '2/18',
          economy: 6.8,
          catches: 28
        }
      },
      {
        tournamentId: tournament._id,
        registrationNumber: 'REG-2026-002',
        fullName: 'Wanindu Hasaranga',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
        dob: '1997-07-29',
        gender: 'Male',
        phone: '+94 77 987 6543',
        whatsapp: '+94 77 987 6543',
        district: 'Galle',
        town: 'Richmond Hill',
        playingRole: 'BOWLING_ALL_ROUNDER',
        battingStyle: 'RIGHT_HAND',
        bowlingStyle: 'Right-Arm Leg Spin / Googly',
        experience: 'World No. 1 T20I Bowler, Global Franchise Leagues (IPL, BBL, LPL)',
        additionalInfo: 'Top-tier wrist spinner with deceptive googly and explosive lower-order batting firepower.',
        status: 'SOLD',
        soldPrice: 1200000,
        soldToTeamId: kandyWarriors._id,
        soldToTeamName: 'Kandy Warriors',
        category: 'ICON',
        basePrice: 150000,
        lotNumber: 17,
        stats: {
          matches: 68,
          runs: 1080,
          highestScore: '71',
          battingAverage: 24.5,
          strikeRate: 146.4,
          wickets: 104,
          bestBowling: '5/18',
          economy: 6.88,
          catches: 22
        }
      },
      {
        tournamentId: tournament._id,
        registrationNumber: 'REG-2026-003',
        fullName: 'Dushmantha Chameera',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
        dob: '1992-01-11',
        gender: 'Male',
        phone: '+94 71 456 7890',
        whatsapp: '+94 71 456 7890',
        district: 'Gampaha',
        town: 'Ragama',
        playingRole: 'FAST_BOWLER',
        battingStyle: 'RIGHT_HAND',
        bowlingStyle: 'Right-Arm Fast (145kph+)',
        experience: 'Express strike bowler for Sri Lanka in World Cups and Test cricket',
        additionalInfo: 'High-pace outswing bowler capable of hitting speeds over 145 kph consistently.',
        status: 'SOLD',
        soldPrice: 650000,
        soldToTeamId: galleTitans._id,
        soldToTeamName: 'Galle Titans',
        category: 'PLATINUM',
        basePrice: 80000,
        lotNumber: 16,
        stats: {
          matches: 52,
          runs: 280,
          highestScore: '29',
          battingAverage: 12.0,
          strikeRate: 110.0,
          wickets: 62,
          bestBowling: '4/17',
          economy: 7.75,
          catches: 11
        }
      },
      {
        tournamentId: tournament._id,
        registrationNumber: 'REG-2026-004',
        fullName: 'Charith Asalanka',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
        dob: '1997-06-29',
        gender: 'Male',
        phone: '+94 75 333 9999',
        whatsapp: '+94 75 333 9999',
        district: 'Galle',
        town: 'Elpitiya',
        playingRole: 'MIDDLE_ORDER_BATSMAN',
        battingStyle: 'LEFT_HAND',
        bowlingStyle: 'Right-Arm Off Break',
        experience: 'Sri Lanka White Ball Captain, Elite Finisher',
        additionalInfo: 'Clutch match winner against spin and pace alike, tactical middle-overs aggressor.',
        status: 'SOLD',
        soldPrice: 750000,
        soldToTeamId: jaffnaStallions._id,
        soldToTeamName: 'Jaffna Stallions',
        category: 'PLATINUM',
        basePrice: 80000,
        lotNumber: 15,
        stats: {
          matches: 49,
          runs: 1350,
          highestScore: '83',
          battingAverage: 35.5,
          strikeRate: 132.8,
          wickets: 12,
          bestBowling: '3/20',
          economy: 7.1,
          catches: 19
        }
      },
      {
        tournamentId: tournament._id,
        registrationNumber: 'REG-2026-005',
        fullName: 'Kusal Janith Perera',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
        dob: '1990-08-17',
        gender: 'Male',
        phone: '+94 72 111 2222',
        whatsapp: '+94 72 111 2222',
        district: 'Colombo',
        town: 'Kotikawatta',
        playingRole: 'WICKET_KEEPER_BATSMAN',
        battingStyle: 'LEFT_HAND',
        bowlingStyle: 'Wicket-Keeper',
        experience: 'Hero of Durban 153*, Veteran T20 and ODI explosive opener',
        additionalInfo: 'Jayasuriya-esque bat swing with fearless aerial attack in powerplay overs.',
        status: 'APPROVED',
        category: 'PLATINUM',
        basePrice: 80000,
        lotNumber: 19,
        stats: {
          matches: 64,
          runs: 1680,
          highestScore: '84',
          battingAverage: 28.4,
          strikeRate: 142.1,
          wickets: 0,
          bestBowling: '-',
          economy: 0,
          catches: 45
        }
      },
      {
        tournamentId: tournament._id,
        registrationNumber: 'REG-2026-006',
        fullName: 'Dunith Wellalage',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
        dob: '2003-01-09',
        gender: 'Male',
        phone: '+94 77 444 8888',
        whatsapp: '+94 77 444 8888',
        district: 'Colombo',
        town: 'Moratuwa',
        playingRole: 'BOWLING_ALL_ROUNDER',
        battingStyle: 'LEFT_HAND',
        bowlingStyle: 'Slow Left-Arm Orthodox',
        experience: 'Under-19 World Cup Leading Wicket Taker, 5-for against India in Asia Cup',
        additionalInfo: 'Prodigious spinning all-rounder with excellent control and gritty batting technique.',
        status: 'PENDING', // Great for testing the approval workflow!
        category: 'GOLD',
        basePrice: 50000,
        lotNumber: 20,
        stats: {
          matches: 26,
          runs: 420,
          highestScore: '48',
          battingAverage: 23.3,
          strikeRate: 118.0,
          wickets: 32,
          bestBowling: '5/40',
          economy: 5.4,
          catches: 12
        }
      },
      {
        tournamentId: tournament._id,
        registrationNumber: 'REG-2026-007',
        fullName: 'Matheesha Pathirana',
        photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
        dob: '2002-12-18',
        gender: 'Male',
        phone: '+94 78 555 1234',
        whatsapp: '+94 78 555 1234',
        district: 'Kandy',
        town: 'Trinity College',
        playingRole: 'FAST_BOWLER',
        battingStyle: 'RIGHT_HAND',
        bowlingStyle: 'Right-Arm Fast (Sling Yorker Specialist)',
        experience: 'IPL Champion with CSK, Premier Death Overs Bowler',
        additionalInfo: 'Baby Malinga action with unplayable 150kph toe-crushing yorkers and slower dipping balls.',
        status: 'APPROVED',
        category: 'ICON',
        basePrice: 120000,
        lotNumber: 21,
        stats: {
          matches: 34,
          runs: 45,
          highestScore: '12*',
          battingAverage: 9.0,
          strikeRate: 98.0,
          wickets: 48,
          bestBowling: '4/24',
          economy: 7.9,
          catches: 8
        }
      },
      {
        tournamentId: tournament._id,
        registrationNumber: 'REG-2026-008',
        fullName: 'Kamindu Mendis',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
        dob: '1998-09-30',
        gender: 'Male',
        phone: '+94 70 888 7777',
        whatsapp: '+94 70 888 7777',
        district: 'Galle',
        town: 'Richmond College',
        playingRole: 'BATTING_ALL_ROUNDER',
        battingStyle: 'LEFT_HAND',
        bowlingStyle: 'Ambidextrous (Right Off Spin & Left Orthodox Spin)',
        experience: 'Record-breaking Test batter with hundreds in consecutive matches; unique ambidextrous bowler',
        additionalInfo: 'Phenomenal run scorer with average over 50. Bowls with both arms depending on batsman.',
        status: 'PENDING', // Also pending for review testing!
        category: 'GOLD',
        basePrice: 90000,
        lotNumber: 22,
        stats: {
          matches: 28,
          runs: 980,
          highestScore: '112*',
          battingAverage: 54.4,
          strikeRate: 134.0,
          wickets: 14,
          bestBowling: '3/15',
          economy: 6.9,
          catches: 15
        }
      }
    ];

    await Player.insertMany(playersToSeed);

    // 4. Create Auction Session
    await AuctionSession.create({
      tournamentId: tournament._id,
      sessionStatus: 'IN_PROGRESS',
      hasBidsPlaced: false, // Initially false so user can test format toggle
      bidCount: 0
    });

    console.log('[Seed] Database successfully seeded with MCA Premier League 2026!');
    return tournament;
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
}
