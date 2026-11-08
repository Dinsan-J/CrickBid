# Cricket Auction Management Platform - Project Overview

## 1. Executive Summary

The **Cricket Auction Management Platform** is a commercial multi-tenant Software-as-a-Service (SaaS) and managed event platform engineered exclusively for cricket tournament organisers. Focused on the Sri Lankan cricket ecosystem—from school old boy associations (OBAs), mercantile leagues, club invitationals, community tournaments, to premier corporate leagues—the platform provides a tournament-grade live auction experience modeled after premier professional cricket leagues (e.g., IPL, LPL).

The platform bridges the gap between chaotic manual spreadsheets/chalkboard auctions and expensive broadcast-grade auction software by combining:
1. **Self-Service SaaS**: Autonomous registration, squad setup, and auction hosting for independent clubs and leagues.
2. **Platform-Managed Auction Services**: Professional auctioneers, technical stream operators, and premium hardware integration provided directly by the platform team for high-stakes tournaments.
3. **Flexible Valuation**: Native support for both points-based purse allocations and real-currency (Sri Lankan Rupees - LKR) auctions.
4. **Broadcast & Production Readiness**: Direct Open Broadcaster Software (OBS) graphic overlays rendered via transparent browser sources for live streaming to YouTube, Facebook Live, and local television.
5. **Centralized WhatsApp Engine**: High-deliverability player notifications (registration receipts, auction notifications, bid confirmations, squad allocations) sent through a single platform-owned WhatsApp Business Number with automated compliance and cost governance.

---

## 2. Business Objectives & Market Context

### 2.1 The Sri Lankan Cricket Context
Cricket in Sri Lanka is deeply institutionalized across schools, mercantile firms, clubs, and regional associations. Traditional auctions are plagued by:
- Inaccurate manual purse tracking and category violation disputes.
- Delayed notification of players regarding their draft status or unsold rounds.
- Poor live-stream viewer experiences with clunky manual lower thirds.
- Lack of centralized player registries and performance verification.

### 2.2 Core Business Value Propositions
- **For Organisers**: Zero calculation errors, enforced squad constraints (e.g., overseas player caps, under-19 mandates, bowler/batsman minimums), real-time team purse validation, and automated PDF export of official squad sheets.
- **For Team Owners**: Real-time bidding console accessible via mobile or tablet with instant purse feedback, category count tracking, and tactical live squad views.
- **For Players**: Transparent bidding visibility and instant WhatsApp updates upon being shortlisted, put under the hammer, sold, or marked unsold.
- **For Broadcasters & Streamers**: Plug-and-play OBS browser sources with 60fps animations, sponsor banner integration, real-time lower thirds, and live ticker bars.
- **For Platform Operators**: Predictable SaaS subscription and pay-per-tournament revenue, plus high-margin premium managed event packages.

---

## 3. Key Business Decisions

### 3.1 Exclusively Cricket
The platform data model, player attributes, bidding mechanics, and squad rules are built exclusively for cricket. Attributes include batting style, bowling style, bowling arm, wicket-keeping proficiency, ICC/SLC player categories, overs bowled records, and cricket-specific player roles (Batsman, Pace Bowler, Spin Bowler, Batting All-Rounder, Bowling All-Rounder, Wicket-Keeper Batsman).

### 3.2 Dual Auction Economy (Points vs. Money)
Every tournament explicitly configures its auction financial model:
- **Points-Based Auctions**: Each franchise receives an identical purse (e.g., 100,000 points). Bid increments scale by point tiers.
- **Money-Based Auctions**: Real financial valuations denominated in Sri Lankan Rupees (LKR) or supported foreign currencies (USD, GBP, AED, etc.). Minimum bid increments adhere to realistic financial scales.

### 3.3 Multi-Tenant Organisation Hierarchy
- **Organisation (Tenant)**: The top-level legal or administrative entity (e.g., "Colombo Premier Cricket Club", "Mercantile Cricket Association").
- **Tournaments**: An organisation can create and manage unlimited tournaments over seasons (e.g., "MCA Division A 2026", "MCA Division A 2027").
- **Data Isolation**: Strict logical separation guarantees that player pools, team financial records, auction records, and billing data never cross tenant boundaries.

### 3.4 Platform-Managed Events Model
High-profile tournaments often demand professional auction operators. The platform supports assigning **Platform Auctioneers** and **Platform Technical Operators** to an organisation's tournament. These platform staff members have elevated operational privileges to execute the auction on behalf of the client while keeping the client in control of approvals and financial settlements.

### 3.5 Central Platform-Owned WhatsApp Business Number
Rather than requiring every tournament organiser to navigate Meta Business Verification, procure dedicated phone numbers, and configure webhooks, the platform operates **one central, verified Meta WhatsApp Business Account (WABA)**.
- **Platform-Borne Messaging Costs**: The platform absorbs the Meta conversation fees and bills tournament organizers either through bundled SaaS tiers or per-tournament notification add-on credits.
- **Cost & Rate Control**: BullMQ asynchronous queuing enforces throttling, template caching, and daily budget caps to prevent runaway expenses.

### 3.6 Strict WhatsApp Consent & Player Privacy
In compliance with the Sri Lanka Personal Data Protection Act (PDPA No. 9 of 2022) and Meta WhatsApp Business Policies:
- Players must explicitly opt in (via checkbox and recorded digital consent) during registration.
- Every outgoing message includes an effortless opt-out trigger ("Reply STOP to unsubscribe").
- Explicit consent timestamps, IP addresses, and opt-out logs are immutably archived.

### 3.7 Native OBS Streaming Support
OBS Studio, vMix, and Streamlabs integration is treated as a first-class feature:
- Clean 1080p (1920x1080) transparent web URLs (`/overlay/live/:tournamentId?token=...`).
- Automatic graphics updates via WebSockets with zero manual intervention from the stream operator.
- Configurable visual widgets: Active Player Card with photo and career stats, Real-Time Bid Hammer alert, Team Purse Status Sidebar, Live Scrolling Ticker of recent buys, and Upcoming Lots preview.

---

## 4. Key Functional Modules

```
+-----------------------------------------------------------------------------------+
|                        CRICKET AUCTION PLATFORM ECOSYSTEM                        |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Public Portals ]              [ Tenant Admin ]           [ Auction Engine ]     |
|  - Player Self-Registration     - Org & Team Management    - Auctioneer Gavel     |
|  - Live Public Viewer           - Tournament Rules         - Team Bidder Console  |
|  - WhatsApp Opt-in / Opt-out    - Player Roster & CSV      - Real-Time Validation |
|                                                                                   |
|  [ Broadcast Suite ]            [ Notification Engine ]    [ Platform Back-Office]|
|  - OBS Chroma / Transparent     - Central WhatsApp WABA    - Managed Event Ops    |
|  - Dynamic Lower-Thirds         - BullMQ Async Queue       - Org Billing & Limits |
|  - Live Team Leaderboards       - Template Management      - Audit & Compliance   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

1. **Multi-Tenant Administration**: Self-service organization onboarding, tournament lifecycle management, brand customization (logos, tournament theme colors), and squad rule constraints.
2. **Player Management & Registration**: Public registration portal, manual entry, and bulk CSV import. Supports player categorization, base price tagging, medical/ID upload, and verification workflows.
3. **Real-Time Auction Engine**: Low-latency WebSocket room powered by Socket.IO. Handles dynamic bid increment ladders, bid submission, instant purse validation, countdown timer synchronisation, hammer falls (Sold / Unsold), and pass-over lots.
4. **Team Bidder Terminal**: Optimized for tablets and phones used by franchise owners at the auction table. Shows available purse balance, maximum permissible bid based on remaining required squad slots, live player stats, and instant one-tap bid buttons.
5. **OBS Broadcast Overlay Suite**: Ultra-clean broadcast graphics designed with CSS transparency for direct rendering inside OBS Studio browser sources without capture cards.
6. **WhatsApp Notification Worker**: Background BullMQ workers executing templated Meta WhatsApp Cloud API calls with status callback handling (sent, delivered, read, failed).
7. **Post-Auction Analytics & Reports**: Instant PDF/CSV exports of final team squads, financial spending summaries, unsold player rosters, and tournament audit trails.
