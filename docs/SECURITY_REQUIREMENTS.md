# Cricket Auction Management Platform - Security & Compliance Requirements

## 1. Multi-Tenant Data Isolation

Data isolation between independent organisations is a core architectural requirement:
1. **Logical Separation via Indexed Tenant Keys**: Every tournament, team, player, bid, and auction session document stores an `organisationId` matching its parent tenant.
2. **Mandatory Query Filtering**:
   - Backend services never query collections without an explicit `organisationId` filter (unless invoked in a Super Admin context).
   - Route middleware `verifyTenantScope` extracts the tenant ID from the authenticated user's session and attaches it to `req.tenantId`.
3. **Cross-Tenant Mutation Prevention**: All update and delete operations use `findOneAndUpdate({ _id: id, organisationId: req.tenantId })` so that a user cannot manipulate an entity from another organisation even if they guess its MongoDB ObjectId.

---

## 2. Authentication & Session Hardening

```mermaid
flowchart LR
    Client["Browser Client"]
    Server["Express Auth Controller"]
    CookieStore["HTTP-Only Cookie Jar"]

    Client->>Server: POST /api/v1/auth/login
    Server-->>CookieStore: Set-Cookie: crickbid_access; HttpOnly; Secure; SameSite=Strict
    Server-->>CookieStore: Set-Cookie: crickbid_refresh; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth
    Server-->>Client: 200 OK { userProfile }
```

1. **Cookie-Based Token Storage**:
   - JWT tokens are strictly transmitted in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
   - Tokens are **never** returned in the JSON payload or stored in `localStorage` / `sessionStorage`, mitigating Cross-Site Scripting (XSS) token theft.
2. **Dual-Token Architecture**:
   - **Access Token**: Short-lived (15 minutes). Contains user ID, role, and organisation ID.
   - **Refresh Token**: Long-lived (7 days). Stored hashed in the database. Can be revoked immediately if a device is compromised.
3. **CSRF Mitigation**:
   - Strict `SameSite=Strict` cookies natively defend against CSRF in modern browsers.
   - A custom `X-Requested-With: XMLHttpRequest` or CSRF header is verified on mutating HTTP requests (`POST`, `PUT`, `DELETE`).

---

## 3. Real-Time Auction Bidding Integrity

1. **Server-Side Bid Authoritativeness**:
   - The client never dictates the bid amount. The client only sends `{ tournamentId, teamId, action: 'BID' }`.
   - The backend resolves the current active lot, calculates the next minimum required bid based on the tournament's bid ladder, and verifies that the team has sufficient purse balance.
2. **Team Bidder Authentication on WebSocket**:
   - Socket handshakes are authenticated using the same HTTP-only session cookies as REST calls.
   - The server verifies that the socket's authenticated user is authorized for the specific `teamId`. Users cannot place bids for opposing teams.
3. **Atomic Concurrency (No Over-Drafting)**:
   - Redis distributed locking (`tournament:lock:ID`) prevents race conditions between simultaneous clicks.
   - Minimum reserve purse validation ensures a team cannot bid so much that they cannot afford the remaining minimum base prices for remaining required squad slots:
     $$\text{PurseRemaining} - \text{BidAmount} \ge (\text{MinSquadRequired} - \text{CurrentSquadCount} - 1) \times \text{MinBasePrice}$$

---

## 4. WhatsApp Privacy & Sri Lanka PDPA Compliance

1. **Explicit Opt-In Required**:
   - Players must actively check a digital consent box before their phone number can receive WhatsApp notifications.
   - The registration system records:
     - Player ID and E.164 phone number.
     - Timestamp of consent.
     - Registration IP address and user-agent string.
2. **Automatic Opt-Out Engine**:
   - Any player sending a WhatsApp message containing "STOP", "CANCEL", or "UNSUBSCRIBE" triggers an automatic webhook callback to `/api/v1/whatsapp/webhook`.
   - The system immediately sets `whatsappConsentGiven: false` and revokes future notification dispatches to that number.
3. **PII Data Minimization**:
   - National Identity Card (NIC) / Passport photos are encrypted or access-restricted via signed URLs with short expirations.
   - Player phone numbers in public viewer views and OBS overlays are strictly hidden or masked (e.g., `+94 77 **** 567`).

---

## 5. OBS Stream Key & Broadcast Security

1. **Secret Stream Key Access**:
   - OBS browser overlays are accessed via a dedicated route authenticated by a cryptographically secure 64-character token:
     `https://app.crickbid.com/overlay/live/:tournamentId?key=obs_live_8f9a2b...`
   - Stream keys can be regenerated instantly by the Organisation Admin if compromised.
2. **Read-Only Capability**:
   - The OBS stream key grants read-only access to the public auction broadcast WebSocket room.
   - It cannot be used to invoke administrative REST endpoints, trigger bids, or modify tournament data.

---

## 6. Infrastructure & Network Defenses

1. **Rate Limiting**:
   - General API: 100 requests per minute per IP.
   - Authentication Endpoints (`/login`, `/register`): 5 requests per 15 minutes to prevent brute-force credential stuffing.
   - Public Player Registration: 10 registrations per hour per IP.
2. **Input Sanitization & Injection Defense**:
   - Express middleware sanitizes incoming request bodies against MongoDB query operator injection (e.g., stripping `$` and `.`).
   - Strict input validation schemas via Joi / Zod validate all string lengths, regex patterns, and numeric ranges.
3. **File Upload Security**:
   - Player photos and team logos must be validated for MIME type (`image/jpeg`, `image/png`, `image/webp`).
   - Maximum upload size capped at 5MB.
   - Files are stored on Cloudinary / S3 with sanitized filenames; direct executable execution is disabled.
4. **HTTP Security Headers**:
   - `Helmet` configured with strict Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), and `X-Frame-Options: SAMEORIGIN` (exempting configured OBS overlay routes for browser embedding).
