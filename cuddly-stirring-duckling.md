# Auth Microservice — Implementation Plan

## Context

Two apps — **EasyBuyTracker** (phone installment tracker) and **E-CommerceAPI** (Melasi store) — currently have independent auth systems with separate user databases. The goal is to extract a standalone **Auth Service** that owns all identity, authentication, and session management so that:

1. One account works across all apps
2. Any future service plugs in with a thin middleware (~30 lines)
3. No consumer app ever touches users/sessions directly

Both apps use Express + MongoDB + JWT + bcrypt, making extraction straightforward.

---

## Architecture

```
                    ┌──────────────────┐
                    │   Auth Service    │  ← Owns: users, profiles, sessions
                    │   (port 5500)     │  ← DB: auth_db
                    └────────┬─────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
      ┌─────┴──────┐  ┌─────┴──────┐  ┌──────┴──────┐
      │ EasyBuy    │  │ E-Commerce │  │ Future App  │
      │ (port 552) │  │ (port 2222)│  │ (any port)  │
      │ easybuy_db │  │ ecom_db    │  │ own_db      │
      └────────────┘  └────────────┘  └─────────────┘
```

Each consumer app:
- Verifies JWT locally (shared secret, no network call)
- Calls auth API only when it needs user data (profile, admin listings)
- Stores only `userId` references in its own domain DB

---

## What the Auth Service Owns

### Unified User Model

```typescript
{
  email:          String, required, unique, lowercase, trim
  password:       String, required, select: false
  fullName:       String, required, trim
  role:           String, enum: ["user","admin","superadmin"], default: "user"
  emailVerified:  Boolean, default: false
  disabled:       Boolean, default: false
  originApp:      String, enum: ["easybuy","ecommerce","auth-service"]
  legacyIds: {
    easybuy:      String, sparse index  // old _id from easybuy_db
    ecommerce:    String, sparse index  // old _id from ecom_db
  }
}
```

**What is NOT here** (stays in consumer app DB):
- `createdByAdmin`, `createdUsers[]`, `manualNextDueDate` → EasyBuy domain data
- Shopping cart, orders, products → E-Commerce domain data

### Unified Profile Model

```typescript
{
  user:         ObjectId, ref: "user", unique
  firstName:    String
  lastName:     String
  phoneNumber:  String
  dateOfBirth:  Date
  gender:       String
  address:      String
  avatar:       String
}
```

### Unified Session Model

Merges EasyBuy's jti revocation with E-Commerce's device analytics:

```typescript
{
  user:        ObjectId, ref: "user", required, indexed
  jti:         String, required, unique      // JWT ID for revocation
  active:      Boolean, default: true
  app:         String, required              // which app initiated login
  device: {
    userAgent, ip, browser, os
  }
  loginAt:     Date
  logoutAt:    Date
  lastSeenAt:  Date
  expiresAt:   Date, indexed
}
// Compound indexes: { active, expiresAt }, { user, active }, { jti, user, active }
```

### Standardized Roles

**Decision: lowercase** — `"user" | "admin" | "superadmin"`

Both apps migrate. Lowercase is industry standard for JWT claims and avoids casing bugs across services.

### JWT Payload (unified)

```typescript
{
  _id:      string,
  email:    string,
  fullName: string,
  role:     string,      // single role
  jti:      string,      // always present (fixes E-Commerce's missing jti gap)
  app:      string,      // which app issued the session
  iat:      number,
  exp:      number       // 40 minutes
}
```

Signed with a strong shared secret (`AUTH_JWT_SECRET`). All consumer apps get the same secret in their `.env`.

---

## Auth Service API

### Public (no auth)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/auth/register` | Self-registration. Body: `{ email, password, fullName, app }` |
| POST | `/api/v1/auth/login` | Login. Returns JWT + creates session. Body: `{ email, password, app, device? }` |
| GET | `/api/v1/auth/verify-email/:token` | Flips `emailVerified: true` |
| POST | `/api/v1/auth/resend-verification` | Resends verification email |
| POST | `/api/v1/auth/forgot-password` | Sends reset email |
| POST | `/api/v1/auth/reset-password` | Resets password with token |

**Per-app email verification**: Auth service has a config map. EasyBuy sets `emailVerified: true` at registration (no check on login). E-Commerce requires verification before login.

### Authenticated (JWT required)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/auth/me` | Current user + profile |
| PATCH | `/api/v1/auth/me/profile` | Update profile fields |
| PATCH | `/api/v1/auth/me/password` | Change password (invalidates other sessions) |
| POST | `/api/v1/auth/logout` | Deactivate session by jti |
| POST | `/api/v1/auth/logout-all` | Deactivate ALL user sessions |
| GET | `/api/v1/auth/sessions` | List user's active sessions |
| DELETE | `/api/v1/auth/sessions/:jti` | Revoke specific session |

### Admin (require admin or superadmin)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/auth/admin/create-user` | Create user with role. Admin can create "user" only. SuperAdmin can create any. |
| GET | `/api/v1/auth/admin/users` | List users with pagination, search, role filter |
| GET | `/api/v1/auth/admin/users/:id` | Get single user |
| PATCH | `/api/v1/auth/admin/users/:id/role` | Change role (superadmin only) |
| PATCH | `/api/v1/auth/admin/users/:id/disable` | Soft-disable + kill all sessions |
| DELETE | `/api/v1/auth/admin/users/:id` | Hard delete (superadmin only) |
| GET | `/api/v1/auth/admin/sessions/stats` | Active sessions count, users logged in |

### Internal (service-to-service, X-Service-Key header)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/auth/internal/validate-session` | Hard session check (optional, for sensitive ops) |
| POST | `/api/v1/auth/internal/bulk-users` | Resolve list of userIds to display names |

---

## Consumer Middleware (what each app drops in)

~30 lines. Verifies JWT locally, no network call:

```typescript
const { verifyToken, requireRole } = createAuthMiddleware(process.env.AUTH_JWT_SECRET);

// Usage in routes:
router.get("/items", verifyToken, requireRole(["admin"]), getItems);
```

- Extracts token from Bearer header OR sessionId cookie
- Verifies signature + expiry locally
- Attaches `req.user = { _id, email, fullName, role, jti, app }`
- No DB call, no HTTP call to auth service
- 40-min token expiry means revoked sessions are invalid within 40 min max

For sensitive operations (password change, admin actions), consumer can optionally call `POST /auth/internal/validate-session` for a hard session check.

---

## How Consumer Apps Get User Info

| Need | Source | Network call? |
|------|--------|--------------|
| User ID, email, name, role | JWT payload (`req.user`) | No |
| Full profile (avatar, phone, address) | `GET /auth/me` | Yes |
| List all users (admin dashboard) | `GET /auth/admin/users` | Yes |
| Resolve multiple userIds to names | `POST /auth/internal/bulk-users` | Yes |

90% of requests just use `req.user` from the JWT. No extra calls.

---

## What Gets Removed from Each Consumer App

### EasyBuyTracker — DELETE:

- `Model/UserModel.ts` → replaced by auth service
- `Model/SessionModel.ts` → replaced by auth service
- `Middleware/verify.ts` → replaced by shared middleware
- `Controller/UserController.ts` → LoginUser, LogoutUser, GetCurrentUser all gone
- Auth routes from `Router/UserRouter.ts` → `/login-user`, `/logout`, `/getcurrentuser` removed

### EasyBuyTracker — MODIFY:

- `Controller/UserController.ts` — CreateUser/CreateAdmin refactored to call auth API first, then store `createdByAdmin`/`createdUsers` in a local `EasyBuyAdminRelation` model
- `Controller/SuperAdminController.ts` — GetAllUsers, GetLoginStats, DeleteUser call auth API then enrich with local domain data
- `Router/UserRouter.ts` — keep domain routes, remove auth routes, swap middleware import
- `config/Config.ts` — add `AUTH_SERVICE_URL`, `AUTH_JWT_SECRET`

### E-CommerceAPI — DELETE:

- `model/userModel.ts` → replaced
- `model/profileModel.ts` → replaced
- `Middleware/Verify.ts` → replaced
- `controller/UserController.ts` → ALL functions replaced
- `router/userRouter.ts` → delete entirely

### E-CommerceAPI — MODIFY:

- `mainApp.ts` — remove user router, add shared middleware
- `config/env.ts` — add `AUTH_SERVICE_URL`, `AUTH_JWT_SECRET`
- All controllers — role checks use lowercase (`"admin"` not `"Admin"`)

---

## What Stays in Each Consumer App's DB

### EasyBuy DB (easybuy_db):

| Collection | Notes |
|------------|-------|
| `easyboughtitems` | `UserId` now references auth service user._id |
| `payments` | `user` references auth user._id |
| `receipts` | `user` references auth user._id |
| `easybuy_admin_relations` (NEW) | `{ userId, createdByAdmin, createdUsers[], manualNextDueDate }` — domain-specific fields removed from UserModel |
| `publiceasybuyrequest` | Unchanged |
| `easybuypricing` | Unchanged |
| `auditlogs` | actor/target reference auth user._ids |

### E-Commerce DB (ecom_db):

| Collection | Notes |
|------------|-------|
| `products` | Unchanged |
| `categories` | `User` references auth user._id |
| `orders` | Unchanged |
| `carts` | Unchanged |

---

## Migration Strategy (Zero Password Resets)

Both apps use bcrypt — password hashes are directly portable.

### Step 1: Deploy auth service (login endpoints disabled)

### Step 2: Run migration script

```
node migrate-users.ts
```

1. Read all users from easybuy_db
2. For each: create auth user with `{ email, password (copy hash), fullName, role: lowercase(role), emailVerified: true, originApp: "easybuy", legacyIds.easybuy: oldId }`
3. Read all users from ecom_db
4. For each: check if email exists in auth_db
   - **If exists** (same person uses both apps): merge — add `legacyIds.ecommerce`, keep existing password hash
   - **If not**: create new auth user with `{ emailVerified: user.verify, originApp: "ecommerce", legacyIds.ecommerce: oldId }`
5. Output mapping file: `{ easybuy: { oldId: newId }, ecommerce: { oldId: newId } }`

### Step 3: Update consumer app DBs

Using the mapping file, replace old userId references with new auth service userIds in all collections.

### Step 4: Migrate active sessions from EasyBuy

### Step 5: Brief maintenance window (~5 min)
1. Consumer apps → maintenance mode
2. Run incremental migration for any new users since Step 2
3. Deploy updated consumer apps with shared middleware
4. Enable auth service login endpoints
5. Everything back up

**Re-login required**: Users with active sessions will need to log in again after cutover. The 40-min token expiry means most sessions expire naturally anyway.

---

## Auth Service File Structure

```
auth-service/
  Server.ts
  MainApp.ts
  Database/Database.ts
  config/
    Config.ts           — PORT, DATABASE_URL, AUTH_JWT_SECRET, MAIL_*
    AppConfig.ts        — per-app settings (email verification, frontend URLs)
  Model/
    UserModel.ts
    ProfileModel.ts
    SessionModel.ts
  Middleware/
    verifyToken.ts
    requireRole.ts
    rateLimiter.ts      — 10 auth requests per 15 min per IP
    serviceKeyAuth.ts   — validates X-Service-Key for internal endpoints
  Controller/
    AuthController.ts   — register, login, logout, verify-email, password
    ProfileController.ts
    AdminController.ts  — user management, session stats
    InternalController.ts — validate-session, bulk-users
  Router/
    AuthRouter.ts
    ProfileRouter.ts
    AdminRouter.ts
    InternalRouter.ts
  Utils/
    Mailer.ts           — copied from EasyBuy's abstracted mailer
  migrations/
    migrate-users.ts
    migrate-sessions.ts
    update-consumer-refs.ts
```

---

## Implementation Phases

### Phase 1: Build auth service (Days 1-2)
Scaffold, models, controllers, routes, mailer. Test all endpoints.

### Phase 2: Write migration scripts (Day 3)
User migration, session migration, reference updates. Test on copy of prod data.

### Phase 3: Refactor EasyBuyTracker (Day 4)
Replace auth code with shared middleware + auth API calls. Keep domain data.

### Phase 4: Refactor E-CommerceAPI (Day 5)
Replace auth code with shared middleware. Much simpler — fewer domain-specific concerns.

### Phase 5: Execute migration + deploy (Day 6)
Deploy auth service → run migration → brief maintenance window → deploy updated apps → verify.

---

## Verification

After each phase, run `npx tsc --noEmit` on the affected project.

After full deployment:
1. Register a new account via E-Commerce → verify email → login → token works on EasyBuy
2. Login via EasyBuy → token works on E-Commerce
3. SuperAdmin creates Admin via EasyBuy → new user can login on both apps
4. Logout on one app → session revoked → re-login required
5. Check that EasyBuy domain data (items, receipts, pricing) is intact
6. Check that E-Commerce domain data (products, orders) is intact
