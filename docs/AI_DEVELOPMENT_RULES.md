# Cricket Auction Management Platform - AI Development Rules & Coding Standards

This document establishes the mandatory architectural principles, coding conventions, and strict operational guidelines for all AI agents and human developers contributing to this codebase.

---

## 1. Golden Architectural Principles

### Rule 1: JavaScript & JSX Exclusively
- **NO TypeScript or TSX under any circumstances.**
- All frontend source files must use `.jsx` or `.js`.
- All backend source files must use `.js`.
- Use JSDoc annotations where complex type documentation is necessary.

### Rule 2: Absolute Separation of Concerns
- Frontend and backend must reside in distinct root directories (`/client` and `/server`).
- The frontend must never contain direct database logic, secret keys, or server environment variables.
- The backend communicates with clients exclusively via JSON REST APIs and Socket.IO events.

### Rule 3: Thin Controllers, Rich Services
- **Controllers** are strictly responsible for parsing HTTP request parameters, calling the relevant service method, and formatting the standard JSON response.
- **Services** encapsulate all domain calculations, database queries, Redis caching, and event dispatches. Controllers must never query Mongoose models directly.

### Rule 4: No Mock Data in Place of Real Functionality
- **Never use mock data as a substitute for real backend functionality.**
- Do not create fake successful API responses (`{ success: true, data: "fake" }`) when backend endpoints or database operations are missing.
- When an API endpoint is created, write the real service, database query, validation, and error handling.

### Rule 5: Non-Destructive Refactoring & Stability
- Do not silently remove existing functionality.
- Do not change working modules without first inspecting their callers and downstream dependencies.
- Preserve all existing comments, docstrings, and business logic validations.

### Rule 6: Absolute Credential Safety
- Never hardcode production credentials, API secrets, or private keys into source code or test files.
- All secrets must be loaded via `process.env` backed by `.env` files.
- Provide a clear, sanitized `.env.example` in both `/server` and `/client`.

---

## 2. Frontend Development Standards (React + Vite + Tailwind CSS)

### 2.1 File & Component Conventions
- Use functional React components with standard PascalCase filenames (e.g., `CurrentLotCard.jsx`, `PurseProgressBar.jsx`).
- Place helper functions in `/src/utils` and custom stateful logic in custom hooks `/src/hooks`.
- Use Tailwind CSS utility classes directly. Avoid inline `style={{ ... }}` objects except for dynamic CSS variables (such as dynamic team primary/secondary hex colors).

### 2.2 Defensive UI Rendering
- Always account for loading, empty, and error states.
- Never assume an object property exists without optional chaining or default fallbacks (e.g., `player?.cricketProfile?.battingStyle || 'N/A'`).
- Display user-friendly error banners when API calls fail; never let exceptions crash the entire application window.

### 2.3 Socket.IO Client Lifecycle
- Socket connections must be managed within a dedicated React Context (`SocketContext`) or custom hook (`useAuctionSocket`).
- Always clean up listeners in `useEffect` return functions to prevent duplicate event listeners on re-renders:
  ```javascript
  useEffect(() => {
    socket.on('auction:bid_update', handleBidUpdate);
    return () => {
      socket.off('auction:bid_update', handleBidUpdate);
    };
  }, [tournamentId]);
  ```

---

## 3. Backend Development Standards (Node.js + Express + Mongoose)

### 3.1 Error Handling Pattern
- Use a custom `ApiError` class extending `Error` with HTTP status codes.
- Wrap all async controller functions with an `asyncHandler` wrapper to eliminate redundant `try/catch` boilerplate.
- Central error-handling middleware catches all unhandled rejections and outputs standardized error responses.

### 3.2 Service Layer Pattern
```javascript
// Good: Service encapsulates the transaction and business rules
export const placeBid = async ({ tournamentId, teamId, userId, amount }) => {
  // 1. Acquire Redis lock
  // 2. Validate session and active player
  // 3. Check team purse balance and minimum required reserve
  // 4. Atomically record bid and update session
  // 5. Release lock
  // 6. Return new auction state
};

// Bad: Controller performing database updates directly
export const handleBid = async (req, res) => {
  const team = await Team.findById(req.body.teamId); // VIOLATION: Model called from controller
  team.remainingPurse -= req.body.amount;
  await team.save();
  res.json({ success: true });
};
```

### 3.3 Multi-Tenant Enforcement
- Every Mongoose query in a tenant-facing service must include `{ organisationId }`.
- Never trust `req.body.organisationId`. Always resolve the organisation from the authenticated session (`req.user.organisationId`).

---

## 4. Socket.IO Event Naming Conventions

All real-time events must adhere to a standardized, colon-separated namespace structure:

| Event Name | Direction | Payload Description |
|---|---|---|
| `auction:join` | Client -> Server | `{ tournamentId }` (Joins tournament room) |
| `auction:leave` | Client -> Server | `{ tournamentId }` (Leaves room) |
| `auction:place_bid` | Client -> Server | `{ tournamentId, teamId, amount }` |
| `auction:gavel_call` | Client -> Server | `{ tournamentId, stage: 'ONCE' | 'TWICE' | 'SOLD' | 'UNSOLD' }` |
| `auction:state_update` | Server -> Room | Full synchronized lot state (player, current bid, team, timer) |
| `auction:bid_accepted` | Server -> Room | Details of newly accepted bid |
| `auction:bid_rejected` | Server -> Sender | Error reason (e.g., "Insufficient purse balance", "Outbid") |
| `auction:timer_tick` | Server -> Room | `{ remainingSeconds: number }` |
| `auction:player_sold` | Server -> Room | `{ playerId, teamId, amount, teamRemainingPurse }` |
| `auction:player_unsold` | Server -> Room | `{ playerId }` |
| `auction:error` | Server -> Sender | Standardized error payload |

---

## 5. WhatsApp & Notification Safeguards

1. **Verify Opt-In Before Queueing**:
   - The WhatsApp worker must verify `player.whatsappConsentGiven === true` immediately before executing any Meta Cloud API call.
2. **Handle Inbound Opt-Outs Instantly**:
   - Webhook listeners for incoming customer messages must parse for STOP keywords and revoke consent immediately in the database.
3. **Template Parameter Validation**:
   - Ensure all template placeholder variables are sanitized strings. Never pass `null` or `undefined` into Meta template components as this causes immediate API 400 rejection.
