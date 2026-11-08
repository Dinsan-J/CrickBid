# Cricket Auction Management Platform - Database Design

## 1. Overview & Data Modeling Strategy

The database uses **MongoDB Atlas** with **Mongoose ODM**. It employs a multi-tenant shared-database, shared-schema pattern. Every tenant-specific document contains an indexed `organisationId` reference to ensure strict logical isolation.

---

## 2. Entity-Relationship Diagram (Mermaid)

```mermaid
erDiagram
    ORGANISATION ||--o{ USER : "employs / contains"
    ORGANISATION ||--o{ TOURNAMENT : "organises"
    TOURNAMENT ||--o{ TEAM : "competes in"
    TOURNAMENT ||--o{ PLAYER : "registers for"
    TOURNAMENT ||--o| AUCTION_SESSION : "has live session"
    AUCTION_SESSION ||--o{ BID : "logs bids"
    TEAM ||--o{ BID : "places"
    PLAYER ||--o{ BID : "bid upon"
    PLAYER ||--o| TEAM : "acquired by"
    PLAYER ||--o{ WHATSAPP_CONSENT_LOG : "records consent"
    PLAYER ||--o{ WHATSAPP_NOTIFICATION_LOG : "receives alerts"
    ORGANISATION ||--o{ AUDIT_LOG : "generates audit trail"

    ORGANISATION {
        ObjectId _id PK
        string name
        string slug UK
        string logoUrl
        string planTier "FREE | PRO | ENTERPRISE"
        boolean isManagedEventPlatform
        string contactEmail
        string contactPhone
        string status "ACTIVE | SUSPENDED"
        date createdAt
    }

    USER {
        ObjectId _id PK
        ObjectId organisationId FK "Nullable for SuperAdmin"
        string fullName
        string email UK
        string passwordHash
        string phone
        string role "SUPER_ADMIN | PLATFORM_AUCTIONEER | ORG_ADMIN | TOURNAMENT_DIRECTOR | TEAM_BIDDER | VIEWER"
        ObjectId assignedTeamId FK "Nullable"
        boolean isActive
        date lastLoginAt
    }

    TOURNAMENT {
        ObjectId _id PK
        ObjectId organisationId FK
        string name
        string slug
        string season
        string logoUrl
        string bannerUrl
        string auctionType "POINTS | MONEY"
        string currencyCode "LKR | USD | PTS"
        number startingPurse
        object squadRules
        array bidIncrementRules
        string status "DRAFT | REGISTRATION_OPEN | AUCTION_SCHEDULED | AUCTION_LIVE | AUCTION_PAUSED | COMPLETED"
        date auctionStartDate
        string obsStreamKey UK
    }

    TEAM {
        ObjectId _id PK
        ObjectId tournamentId FK
        ObjectId organisationId FK
        string name
        string shortCode
        string logoUrl
        string primaryColorHex
        string secondaryColorHex
        number totalPurse
        number spentPurse
        number remainingPurse
        array managerUserIds FK
        number maxSquadLimit
        number minSquadLimit
        date createdAt
    }

    PLAYER {
        ObjectId _id PK
        ObjectId tournamentId FK
        ObjectId organisationId FK
        string firstName
        string lastName
        string displayName
        string registrationNumber UK
        string phone
        string email
        string photoUrl
        string idProofUrl
        object cricketProfile
        string category "PLATINUM | GOLD | SILVER | BRONZE | ICON"
        number basePrice
        number soldPrice
        string auctionStatus "REGISTERED | APPROVED | SHORTLISTED | UNDER_THE_HAMMER | SOLD | UNSOLD | PASSED"
        ObjectId soldToTeamId FK
        number lotOrder
        boolean whatsappConsentGiven
        date whatsappConsentDate
    }

    AUCTION_SESSION {
        ObjectId _id PK
        ObjectId tournamentId FK UK
        ObjectId organisationId FK
        ObjectId activePlayerId FK
        ObjectId currentBidderTeamId FK
        number currentBidAmount
        number startingBidAmount
        number bidCount
        string sessionStatus "IDLE | IN_PROGRESS | PAUSED | COMPLETED"
        date timerExpiresAt
        number timerDurationSeconds
        date lotStartedAt
    }

    BID {
        ObjectId _id PK
        ObjectId auctionSessionId FK
        ObjectId tournamentId FK
        ObjectId organisationId FK
        ObjectId playerId FK
        ObjectId teamId FK
        ObjectId bidderUserId FK
        number amount
        number sequenceNumber
        string bidType "REGULAR | COUNTER | JUMP"
        date timestamp
    }

    WHATSAPP_CONSENT_LOG {
        ObjectId _id PK
        ObjectId playerId FK
        string phoneNumber
        boolean consentGranted
        string consentMethod "WEB_FORM_CHECKBOX | SMS_REPLY | ADMIN_IMPORT"
        string ipAddress
        string userAgent
        date timestamp
        date revokedAt
        string revocationReason
    }

    WHATSAPP_NOTIFICATION_LOG {
        ObjectId _id PK
        ObjectId tournamentId FK
        ObjectId playerId FK
        string recipientPhone
        string templateName
        object templateVariables
        string metaMessageId
        string status "QUEUED | SENT | DELIVERED | READ | FAILED"
        number costPoints
        string failureReason
        date sentAt
    }

    AUDIT_LOG {
        ObjectId _id PK
        ObjectId organisationId FK
        ObjectId actorUserId FK
        string action
        string entityType
        ObjectId entityId
        object previousState
        object newState
        string ipAddress
        date timestamp
    }
```

---

## 3. Detailed Mongoose Schema Definitions

### 3.1 Organisation Schema (`organisations`)
```javascript
const organisationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  logoUrl: { type: String, default: null },
  planTier: { 
    type: String, 
    enum: ['FREE_TRIAL', 'STANDARD_SAAS', 'PREMIUM_SAAS', 'MANAGED_ENTERPRISE'], 
    default: 'FREE_TRIAL' 
  },
  isManagedEventPlatform: { type: Boolean, default: false },
  billing: {
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    address: { type: String },
    notificationCredits: { type: Number, default: 200 } // WhatsApp platform credit balance
  },
  settings: {
    defaultCurrency: { type: String, default: 'LKR' },
    brandColors: {
      primary: { type: String, default: '#0f172a' },
      accent: { type: String, default: '#f59e0b' }
    }
  },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'ARCHIVED'], default: 'ACTIVE' }
}, { timestamps: true });

organisationSchema.index({ slug: 1 });
organisationSchema.index({ status: 1 });
```

### 3.2 User Schema (`users`)
```javascript
const userSchema = new mongoose.Schema({
  organisationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organisation', 
    default: null // Null for SuperAdmins & Platform Auctioneers
  },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  phone: { type: String, required: true, trim: true },
  role: { 
    type: String, 
    enum: [
      'SUPER_ADMIN',             // Platform Owner
      'PLATFORM_AUCTIONEER',    // Platform managed event staff
      'ORG_ADMIN',              // Organisation Owner
      'TOURNAMENT_DIRECTOR',    // Assigned tournament manager
      'TEAM_BIDDER',            // Franchise team representative
      'GUEST_VIEWER'            // Read-only spectator
    ], 
    default: 'GUEST_VIEWER' 
  },
  assignedTeamId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team', 
    default: null 
  },
  refreshToken: { type: String, select: false },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date }
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ organisationId: 1, role: 1 });
```

### 3.3 Tournament Schema (`tournaments`)
```javascript
const tournamentSchema = new mongoose.Schema({
  organisationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organisation', 
    required: true, 
    index: true 
  },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true },
  season: { type: String, default: '2026' },
  description: { type: String },
  logoUrl: { type: String, default: null },
  bannerUrl: { type: String, default: null },
  
  // Financial Model
  auctionType: { 
    type: String, 
    enum: ['POINTS', 'MONEY'], 
    required: true, 
    default: 'POINTS' 
  },
  currencyCode: { type: String, default: 'LKR' }, // LKR, USD, or PTS
  startingPurse: { type: Number, required: true, min: 0 },
  
  // Squad Composition Rules
  squadRules: {
    minPlayersPerTeam: { type: Number, default: 11, min: 1 },
    maxPlayersPerTeam: { type: Number, default: 15, min: 1 },
    maxOverseasPlayers: { type: Number, default: 0 },
    maxIconPlayers: { type: Number, default: 1 },
    minWicketKeepers: { type: Number, default: 1 },
    minBowlers: { type: Number, default: 3 },
    minBatsmen: { type: Number, default: 3 },
    minAllRounders: { type: Number, default: 2 }
  },

  // Dynamic Bid Increment Ladder
  bidIncrementRules: [{
    fromAmount: { type: Number, required: true },
    toAmount: { type: Number, required: true },
    increment: { type: Number, required: true }
  }],

  // OBS Broadcasting Key
  obsStreamKey: { 
    type: String, 
    required: true, 
    unique: true 
  },
  obsThemeSettings: {
    theme: { type: String, default: 'DARK' }, // DARK, LIGHT, CUSTOM
    accentColor: { type: String, default: '#3b82f6' },
    showSponsorBanners: { type: Boolean, default: true },
    sponsorBannerUrl: { type: String, default: null }
  },

  // Lifecycle Status
  status: { 
    type: String, 
    enum: [
      'DRAFT', 
      'REGISTRATION_OPEN', 
      'REGISTRATION_CLOSED', 
      'AUCTION_SCHEDULED', 
      'AUCTION_LIVE', 
      'AUCTION_PAUSED', 
      'COMPLETED'
    ], 
    default: 'DRAFT' 
  },
  auctionStartDate: { type: Date }
}, { timestamps: true });

tournamentSchema.index({ organisationId: 1, slug: 1 }, { unique: true });
tournamentSchema.index({ obsStreamKey: 1 }, { unique: true });
```

### 3.4 Team Schema (`teams`)
```javascript
const teamSchema = new mongoose.Schema({
  tournamentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tournament', 
    required: true, 
    index: true 
  },
  organisationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organisation', 
    required: true 
  },
  name: { type: String, required: true, trim: true },
  shortCode: { type: String, required: true, uppercase: true, trim: true, maxlength: 4 },
  logoUrl: { type: String, default: null },
  primaryColorHex: { type: String, default: '#1e40af' },
  secondaryColorHex: { type: String, default: '#fbbf24' },
  
  // Financial State
  totalPurse: { type: Number, required: true, min: 0 },
  spentPurse: { type: Number, default: 0, min: 0 },
  remainingPurse: { type: Number, required: true, min: 0 },
  
  // Squad Roster Management
  acquiredPlayersCount: { type: Number, default: 0 },
  managerUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  status: { type: String, enum: ['ACTIVE', 'DISQUALIFIED'], default: 'ACTIVE' }
}, { timestamps: true });

teamSchema.index({ tournamentId: 1, shortCode: 1 }, { unique: true });
teamSchema.index({ tournamentId: 1, name: 1 }, { unique: true });
```

### 3.5 Player Schema (`players`)
```javascript
const playerSchema = new mongoose.Schema({
  tournamentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tournament', 
    required: true, 
    index: true 
  },
  organisationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organisation', 
    required: true 
  },
  
  // Personal Details
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  displayName: { type: String, required: true, trim: true },
  registrationNumber: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true }, // E.164 formatted: +947XXXXXXXX
  email: { type: String, lowercase: true, trim: true },
  photoUrl: { type: String, default: null },
  nicOrPassportUrl: { type: String, default: null },
  dateOfBirth: { type: Date },

  // Cricket Attributes (Exclusively Cricket)
  cricketProfile: {
    primaryRole: { 
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
      required: true 
    },
    battingStyle: { 
      type: String, 
      enum: ['RIGHT_HAND', 'LEFT_HAND'], 
      required: true 
    },
    bowlingStyle: { 
      type: String, 
      enum: [
        'RIGHT_ARM_FAST', 
        'RIGHT_ARM_MEDIUM', 
        'LEFT_ARM_FAST', 
        'LEFT_ARM_MEDIUM', 
        'RIGHT_ARM_OFF_SPIN', 
        'RIGHT_ARM_LEG_SPIN', 
        'LEFT_ARM_ORTHODOX', 
        'LEFT_ARM_UNORTHODOX', 
        'NONE'
      ], 
      default: 'NONE' 
    },
    isOverseas: { type: Boolean, default: false },
    isUnder19Eligible: { type: Boolean, default: false },
    matchesPlayed: { type: Number, default: 0 },
    runsScored: { type: Number, default: 0 },
    wicketsTaken: { type: Number, default: 0 },
    battingAverage: { type: Number, default: 0 },
    bowlingEconomy: { type: Number, default: 0 },
    previousClubs: [{ type: String }]
  },

  // Auction Setup
  category: { 
    type: String, 
    enum: ['ICON', 'PLATINUM', 'GOLD', 'SILVER', 'EMERGING'], 
    default: 'SILVER' 
  },
  basePrice: { type: Number, required: true, min: 0 },
  lotOrder: { type: Number, default: 9999 }, // Sequence in auction
  
  // Auction Results
  auctionStatus: { 
    type: String, 
    enum: ['REGISTERED', 'APPROVED', 'SHORTLISTED', 'UNDER_THE_HAMMER', 'SOLD', 'UNSOLD', 'PASSED'], 
    default: 'REGISTERED' 
  },
  soldPrice: { type: Number, default: null },
  soldToTeamId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team', 
    default: null 
  },

  // WhatsApp Consent & Opt-In (PDPA Compliant)
  whatsappConsentGiven: { type: Boolean, default: false },
  whatsappConsentDate: { type: Date, default: null }
}, { timestamps: true });

playerSchema.index({ tournamentId: 1, registrationNumber: 1 }, { unique: true });
playerSchema.index({ tournamentId: 1, lotOrder: 1 });
playerSchema.index({ tournamentId: 1, auctionStatus: 1 });
playerSchema.index({ phone: 1 });
```

### 3.6 Auction Session Schema (`auction_sessions`)
```javascript
const auctionSessionSchema = new mongoose.Schema({
  tournamentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tournament', 
    required: true, 
    unique: true 
  },
  organisationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organisation', 
    required: true 
  },
  
  // Real-time Active Lot State
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
  currentBidAmount: { type: Number, default: 0 },
  startingBidAmount: { type: Number, default: 0 },
  bidCount: { type: Number, default: 0 },
  
  // Timer State
  sessionStatus: { 
    type: String, 
    enum: ['IDLE', 'IN_PROGRESS', 'PAUSED', 'LOT_ENDED', 'COMPLETED'], 
    default: 'IDLE' 
  },
  timerDurationSeconds: { type: Number, default: 20 },
  timerExpiresAt: { type: Date, default: null },
  lotStartedAt: { type: Date, default: null },

  // Auctioneer Controls
  hammerStage: { 
    type: String, 
    enum: ['NONE', 'GOING_ONCE', 'GOING_TWICE', 'SOLD', 'UNSOLD'], 
    default: 'NONE' 
  }
}, { timestamps: true });

auctionSessionSchema.index({ tournamentId: 1 });
```

### 3.7 Bid Schema (`bids`)
```javascript
const bidSchema = new mongoose.Schema({
  auctionSessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AuctionSession', 
    required: true 
  },
  tournamentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tournament', 
    required: true, 
    index: true 
  },
  organisationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organisation', 
    required: true 
  },
  playerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Player', 
    required: true, 
    index: true 
  },
  teamId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team', 
    required: true, 
    index: true 
  },
  bidderUserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { type: Number, required: true, min: 0 },
  sequenceNumber: { type: Number, required: true },
  bidType: { 
    type: String, 
    enum: ['INITIAL', 'INCREMENTAL', 'DIRECT_CALL'], 
    default: 'INCREMENTAL' 
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

bidSchema.index({ tournamentId: 1, playerId: 1, sequenceNumber: 1 });
```

### 3.8 WhatsApp Consent & Notification Logs
```javascript
// whatsapp_consent_logs
const whatsappConsentLogSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true, index: true },
  phoneNumber: { type: String, required: true, index: true },
  consentGranted: { type: Boolean, required: true },
  consentMethod: { 
    type: String, 
    enum: ['WEB_REGISTRATION_CHECKBOX', 'SMS_OPT_IN', 'MANUAL_OFFLINE_FORM'], 
    required: true 
  },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now },
  revokedAt: { type: Date, default: null },
  revocationReason: { type: String, default: null }
}, { timestamps: true });

// whatsapp_notification_logs
const whatsappNotificationLogSchema = new mongoose.Schema({
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true, index: true },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  recipientPhone: { type: String, required: true },
  templateName: { type: String, required: true },
  templateVariables: { type: Map, of: String },
  metaMessageId: { type: String, default: null },
  status: { 
    type: String, 
    enum: ['PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'REVOKED_OPTOUT'], 
    default: 'PENDING', 
    index: true 
  },
  failureReason: { type: String, default: null },
  sentAt: { type: Date }
}, { timestamps: true });
```
