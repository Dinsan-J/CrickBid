# Cricket Auction Management Platform - API Specification

## 1. REST API Standards & Conventions

- **Base URL**: `/api/v1`
- **Data Exchange Format**: `application/json`
- **Authentication**: Secured via HTTP-only, SameSite cookies (`crickbid_access`, `crickbid_refresh`).
- **Standard Success Response**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Resource fetched successfully",
    "data": {}
  }
  ```
- **Standard Error Response**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Validation error message",
    "errors": [
      { "field": "basePrice", "message": "Base price must be greater than 0" }
    ]
  }
  ```

---

## 2. API Endpoint Matrix

### 2.1 Authentication & Profile (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/login` | Public | Authenticates user; sets HTTP-only `crickbid_access` & `crickbid_refresh` cookies. |
| `POST` | `/logout` | Authenticated | Clears auth cookies and invalidates session token in DB. |
| `POST` | `/refresh-token` | Public (Cookie) | Issues fresh access token cookie using valid refresh token cookie. |
| `GET` | `/me` | Authenticated | Retrieves current authenticated user profile, tenant info, and permissions. |
| `PUT` | `/profile` | Authenticated | Updates current user's profile details. |
| `POST` | `/forgot-password` | Public | Sends password reset token. |
| `POST` | `/reset-password` | Public | Resets password using valid token. |

---

### 2.2 Organisation Management (`/api/v1/organisations`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Super Admin | Lists all organisations across the platform with subscription status. |
| `POST` | `/` | Super Admin | Creates a new organisation tenant. |
| `GET` | `/:orgId` | Org Admin / Super Admin | Retrieves organisation details, branding, and credit balances. |
| `PUT` | `/:orgId` | Org Admin / Super Admin | Updates organisation profile and branding colors. |
| `GET` | `/:orgId/users` | Org Admin / Super Admin | Lists users belonging to this organisation. |
| `POST` | `/:orgId/users` | Org Admin / Super Admin | Invites or creates a new user within the organisation. |

---

### 2.3 Tournament Management (`/api/v1/tournaments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Org Member | Lists all tournaments belonging to the user's active organisation. |
| `POST` | `/` | Org Admin / Tournament Director | Creates a new tournament with auction type, purse, and squad rules. |
| `GET` | `/:tournamentId` | Authenticated / Public | Retrieves tournament configuration and status. |
| `PUT` | `/:tournamentId` | Org Admin / Tournament Director | Updates tournament rules, schedule, and bid increment ladders. |
| `DELETE` | `/:tournamentId` | Org Admin | Deletes tournament (only if auction hasn't started). |
| `POST` | `/:tournamentId/regenerate-obs-key` | Org Admin | Generates a new secret OBS streaming key. |

#### Example Request: Create Tournament (`POST /api/v1/tournaments`)
```json
{
  "name": "Colombo Mercantile Trophy 2026",
  "season": "2026",
  "auctionType": "MONEY",
  "currencyCode": "LKR",
  "startingPurse": 5000000,
  "squadRules": {
    "minPlayersPerTeam": 11,
    "maxPlayersPerTeam": 16,
    "maxOverseasPlayers": 2,
    "minWicketKeepers": 1,
    "minBowlers": 4
  },
  "bidIncrementRules": [
    { "fromAmount": 10000, "toAmount": 100000, "increment": 5000 },
    { "fromAmount": 100000, "toAmount": 500000, "increment": 25000 },
    { "fromAmount": 500000, "toAmount": 5000000, "increment": 50000 }
  ]
}
```

---

### 2.4 Team Management (`/api/v1/tournaments/:tournamentId/teams`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Authenticated | Lists all teams in tournament with live purse totals and squad counts. |
| `POST` | `/` | Org Admin / Director | Adds a new team with allocated starting purse. |
| `GET` | `/:teamId` | Authenticated | Retrieves single team profile, managers, and acquired players. |
| `PUT` | `/:teamId` | Org Admin / Director | Updates team name, shortcode, primary color, or logo. |
| `DELETE` | `/:teamId` | Org Admin | Removes team (if no players assigned). |
| `POST` | `/:teamId/assign-manager` | Org Admin | Binds a user account to this team as its designated live bidder. |

---

### 2.5 Player Management (`/api/v1/tournaments/:tournamentId/players`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Authenticated | Paginated, filterable player roster (filter by role, category, status). |
| `POST` | `/` | Org Admin / Director | Manually creates a player profile. |
| `POST` | `/register-public` | Public | Public player self-registration with mandatory WhatsApp consent. |
| `POST` | `/bulk-import-csv` | Org Admin / Director | Uploads CSV to bulk-create players with category and base price mapping. |
| `GET` | `/:playerId` | Authenticated | Retrieves complete player stats, cricket profile, and bid history. |
| `PUT` | `/:playerId` | Org Admin / Director | Modifies player category, base price, or auction status. |
| `POST` | `/:playerId/upload-photo` | Org Admin / Director | Uploads player headshot to Cloudinary/S3. |
| `PUT` | `/reorder-lots` | Org Admin / Auctioneer | Updates `lotOrder` sequence for the upcoming auction session. |

#### Example Request: Public Player Registration (`POST /api/v1/tournaments/:tournamentId/players/register-public`)
```json
{
  "firstName": "Nuwan",
  "lastName": "Perera",
  "displayName": "Nuwan Perera",
  "phone": "+94771234567",
  "email": "nuwan.perera@example.lk",
  "cricketProfile": {
    "primaryRole": "TOP_ORDER_BATSMAN",
    "battingStyle": "RIGHT_HAND",
    "bowlingStyle": "RIGHT_ARM_OFF_SPIN",
    "matchesPlayed": 42,
    "runsScored": 1380
  },
  "whatsappConsent": {
    "consentGranted": true,
    "consentMethod": "WEB_REGISTRATION_CHECKBOX"
  }
}
```

---

### 2.6 Real-Time Auction Operations (`/api/v1/tournaments/:tournamentId/auctions`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/session` | Authenticated | Gets active auction session state (active player, current bid, timer). |
| `POST` | `/start` | Platform / Org Auctioneer | Transitions tournament into `AUCTION_LIVE` state. |
| `POST` | `/pause` | Platform / Org Auctioneer | Pauses active auction clock and disables bidding buttons. |
| `POST` | `/lot/load-next` | Platform / Org Auctioneer | Loads next player lot in order and notifies Socket.IO room. |
| `POST` | `/lot/load-specific/:playerId` | Platform / Org Auctioneer | Brings specific player directly to the auction podium. |
| `POST` | `/lot/hammer` | Platform / Org Auctioneer | Triggers hammer call (`GOING_ONCE`, `GOING_TWICE`, `SOLD`, `UNSOLD`). |
| `POST` | `/lot/sold` | Platform / Org Auctioneer | Finalizes sale: updates player status, deducts team purse atomically. |
| `POST` | `/lot/unsold` | Platform / Org Auctioneer | Marks player unsold and adds them to the re-auction pool. |
| `POST` | `/bid/override` | Platform / Org Auctioneer | Administrative correction for mistaken bid amounts or wrong team attribution. |

---

### 2.7 OBS Broadcast Suite (`/api/v1/obs`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/live-state` | Public (with Stream Key) | Poll/bootstrap state for OBS overlay widgets via query `?key=...`. |
| `GET` | `/theme/:tournamentId` | Public (with Stream Key) | Retrieves custom overlay theme colors and sponsor banner assets. |

---

### 2.8 WhatsApp & Webhooks (`/api/v1/whatsapp`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/webhook` | Meta Cloud API | Meta challenge verification endpoint. |
| `POST` | `/webhook` | Meta Cloud API | Inbound message listener (processes STOP/Opt-Out replies & delivery receipts). |
| `POST` | `/opt-out` | Public | Standalone unsubscribe endpoint for players. |
| `GET` | `/logs/:tournamentId` | Org Admin / Super Admin | Audit trail of sent WhatsApp notifications and delivery statuses. |

---

### 2.9 Reports & Exports (`/api/v1/tournaments/:tournamentId/reports`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/squads-pdf` | Authenticated | Generates broadcast-ready PDF with all team rosters and financial balances. |
| `GET` | `/players-csv` | Authenticated | Exports complete player database with sold status, prices, and stats. |
| `GET` | `/bid-audit-csv` | Org Admin / Super Admin | Full immutable CSV transaction log of every bid placed during the event. |
