# Cricket Auction Management Platform

A commercial-grade, multi-tenant cricket auction management SaaS and managed events platform designed for Sri Lankan cricket tournament organisers. Supports both points-based and money-based auctions (LKR/custom currency), real-time bidding via WebSockets, OBS Studio broadcast graphics, and automated player WhatsApp notifications powered by a central platform number.

---

## Key Features

- **Multi-Tenant SaaS Architecture**: Host independent cricket tournaments across multiple clubs, mercantile associations, and schools with complete data isolation.
- **Dual Auction Economy**: Full support for both **Points-based** and **Money-based (LKR)** auction valuations.
- **Real-Time Bidding Engine**: Powered by Socket.IO and Redis with sub-millisecond atomic locking to prevent race conditions and over-bidding.
- **Dedicated OBS Broadcast Suite**: Clean 1080p transparent browser overlays (`/overlay/live/:tournamentId?key=...`) with dynamic lower-thirds, live bidding alerts, team leaderboards, and sponsor banners.
- **Central Platform WhatsApp Engine**: Automated player notifications (registration receipts, under-the-hammer alerts, sold/unsold updates) dispatched through one central platform-owned WhatsApp Business Account with PDPA-compliant opt-in and instant STOP opt-out handling.
- **Auctioneer & Bidder Terminals**: Intuitive auctioneer master gavel console and responsive tablet/mobile bidding consoles for franchise team owners.
- **Strict Role-Based Access Control**: Platform Super Admins, Managed Event Auctioneers, Organisation Admins, Tournament Directors, and Franchise Bidders.

---

## Technology Stack

- **Frontend**: React (Vite) + JavaScript JSX + Tailwind CSS + Framer Motion (Strictly no TypeScript/TSX).
- **Backend**: Node.js + Express.js (Modular Layered Architecture: Controllers -> Services -> Models).
- **Database**: MongoDB Atlas + Mongoose ODM.
- **Real-Time Engine**: Socket.IO + Redis Pub/Sub Adapter.
- **Background Jobs**: Redis + BullMQ (WhatsApp alerts & PDF generation).
- **Authentication**: Secure, HTTP-only, SameSite cookies with JWT access/refresh rotation.
- **Media Storage**: Cloudinary / S3-compatible storage for player headshots and team logos.
- **Broadcast Integration**: HTML5 Canvas / CSS transparent overlays for OBS Studio / vMix.

---

## Directory Structure

```
/CrickBid
├── docs/                       # Comprehensive Architecture & Design Docs
│   ├── PROJECT_OVERVIEW.md     # Market context, business decisions, core modules
│   ├── SYSTEM_ARCHITECTURE.md  # Multi-tier architecture, real-time & worker pipeline
│   ├── DATABASE_DESIGN.md      # Mongoose schemas, relationships & ER diagram
│   ├── API_SPECIFICATION.md    # REST API endpoints, payload contracts & errors
│   ├── USER_ROLES.md           # RBAC permissions matrix & tenant isolation
│   ├── DEVELOPMENT_ROADMAP.md  # 7-phase implementation plan & milestones
│   ├── SECURITY_REQUIREMENTS.md# Auth, multi-tenancy, PDPA & broadcast security
│   └── AI_DEVELOPMENT_RULES.md # Coding standards, JavaScript rules & guidelines
├── client/                     # Frontend Single Page App (React + Vite + Tailwind JSX)
│   ├── public/                 # Static assets, sounds (gavel, bid alert)
│   ├── src/                    # Source code (components, hooks, pages, services)
│   └── package.json
├── server/                     # Backend API & WebSocket Cluster (Node.js + Express)
│   ├── src/                    # Source code (controllers, services, models, sockets)
│   └── package.json
└── README.md                   # This file
```

---

## Prerequisites

Ensure the following tools are installed on your environment:
1. **Node.js** (v20.x or higher) and `npm` (v10.x or higher).
2. **MongoDB** (Local instance or MongoDB Atlas connection URI).
3. **Redis** (Local instance or Redis Cloud URI for BullMQ & Socket.IO adapter).
4. **OBS Studio** (Optional, for testing live stream graphic overlays).

---

## Getting Started

### 1. Clone & Setup Workspace
```bash
cd CrickBid
```

### 2. Backend Setup
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
The Express API and Socket.IO server will start at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd ../client
cp .env.example .env
npm install
npm run dev
```
The React frontend will start at `http://localhost:5173`.

### 4. Background Worker (WhatsApp & Job Queues)
```bash
cd ../server
npm run worker
```

---

## Environment Variables Configuration

### Backend (`server/.env.example`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database & Cache
MONGODB_URI=mongodb://localhost:27017/crickbid
REDIS_URL=redis://localhost:6379

# Authentication & Security
JWT_ACCESS_SECRET=your_super_secret_access_key_here_32char
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_32char
COOKIE_SECRET=your_cookie_signing_secret_here

# Meta WhatsApp Cloud API (Platform Central Account)
META_WA_PHONE_NUMBER_ID=your_phone_number_id
META_WA_BUSINESS_ACCOUNT_ID=your_waba_id
META_WA_ACCESS_TOKEN=your_meta_system_user_token
META_WA_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token

# Cloud Media Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`client/.env.example`)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

---

## OBS Studio Live Stream Overlay Setup

1. Open **OBS Studio**.
2. Under **Sources**, click **+** and select **Browser**.
3. Set the **URL** to your tournament overlay endpoint:
   ```
   http://localhost:5173/overlay/live/{tournamentId}?key={obsStreamKey}
   ```
4. Set **Width** to `1920` and **Height** to `1080`.
5. Check **Shutdown source when not visible** and **Refresh browser when scene becomes active**.
6. The overlay renders with full CSS alpha transparency. As bids are placed and lots change in the Auctioneer console, the OBS overlay automatically updates in real time at 60 FPS.

---

## Documentation Index

- [Project Overview & Business Decisions](file:///c:/CrickBid/docs/PROJECT_OVERVIEW.md)
- [System Architecture & Concurrency Strategy](file:///c:/CrickBid/docs/SYSTEM_ARCHITECTURE.md)
- [Database Design & Mongoose Schemas](file:///c:/CrickBid/docs/DATABASE_DESIGN.md)
- [REST API Specification](file:///c:/CrickBid/docs/API_SPECIFICATION.md)
- [User Roles & Permissions Matrix](file:///c:/CrickBid/docs/USER_ROLES.md)
- [Development Roadmap & Milestones](file:///c:/CrickBid/docs/DEVELOPMENT_ROADMAP.md)
- [Security, Privacy & PDPA Compliance](file:///c:/CrickBid/docs/SECURITY_REQUIREMENTS.md)
- [AI Development Rules & Coding Conventions](file:///c:/CrickBid/docs/AI_DEVELOPMENT_RULES.md)
