# Auth Service — Google OAuth Instructions

Two repos involved:

- **Auth Service**: `C:\Users\HP\Desktop\EasybuyTracker\auth-service` (Express 5 + TypeScript + Mongoose, ES modules with `.js` extensions in imports)
- **Frontend (EasyBuy)**: `C:\Users\HP\Desktop\client` (React 18 + TypeScript + Vite)

Read every file fully before editing it. Follow each phase in order. Do not skip steps.

---

## Context: Why Google OAuth

The auth service currently supports password-based login only. Adding Google OAuth lets users sign in with one tap — no password to remember. The auth service verifies the Google ID token server-side, then issues its own JWT (same as password login). Consumer apps never talk to Google directly.

**Flow:**
1. Frontend shows Google Sign-In button
2. User approves → Google gives frontend an ID token
3. Frontend sends ID token to `POST /api/v1/auth/google`
4. Auth service verifies token with Google, finds or creates user, issues JWT
5. From here, identical to password login — same JWT, same session, same middleware

---

## Phase 1: Install Google Auth Library (Auth Service)

**In `C:\Users\HP\Desktop\EasybuyTracker\auth-service`**, add the dependency:

```bash
npm install google-auth-library
```

No `@types` package needed — `google-auth-library` ships its own TypeScript types.

---

## Phase 2: Add Environment Variable

**Read then edit `C:\Users\HP\Desktop\EasybuyTracker\auth-service\config\Config.ts`**

Add `googleClientId` to the exported config object. It should be OPTIONAL (not all deployments will use Google OAuth):

```typescript
googleClientId: String(process.env.GOOGLE_CLIENT_ID ?? "").trim(),
```

Do NOT throw an error if it's missing. Google OAuth is an optional feature.

---

## Phase 3: Update User Model

**Read then edit `C:\Users\HP\Desktop\EasybuyTracker\auth-service\Model\UserModel.ts`**

### 3A. Add `authMethods` field

Add this field to the user schema:

```typescript
authMethods: {
  type: [String],
  enum: ["password", "google"],
  default: ["password"],
  validate: {
    validator: (v: string[]) => v.length >= 1,
    message: "User must have at least one auth method",
  },
},
```

### 3B. Add `googleId` field

Add this field for linking to Google account:

```typescript
googleId: {
  type: String,
  sparse: true,
  index: true,
  trim: true,
  default: null,
},
```

### 3C. Make `password` conditionally required

Currently `password` is `required: true`. Users who sign in with Google first may not have a password. Change the password field's `required` from `true` to a conditional:

```typescript
password: {
  type: String,
  required: function (this: any) {
    return !this.googleId;
  },
  select: false,
},
```

This means: password is required ONLY if the user has no googleId (i.e., they registered with email/password). Google-only users can exist without a password.

---

## Phase 4: Add Google OAuth Utility

**Create `C:\Users\HP\Desktop\EasybuyTracker\auth-service\Utils\googleAuth.ts`**

```typescript
import { OAuth2Client } from "google-auth-library";
import { config } from "../config/Config.js";

let _client: OAuth2Client | null = null;

const getClient = (): OAuth2Client => {
  if (!_client) {
    _client = new OAuth2Client(config.googleClientId);
  }
  return _client;
};

export type GoogleUserPayload = {
  googleId: string;
  email: string;
  fullName: string;
  avatar: string;
  emailVerified: boolean;
};

export const verifyGoogleIdToken = async (
  idToken: string
): Promise<GoogleUserPayload | null> => {
  if (!config.googleClientId) {
    return null;
  }

  try {
    const client = getClient();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      return null;
    }

    return {
      googleId: payload.sub,
      email: payload.email.toLowerCase().trim(),
      fullName: payload.name || payload.email.split("@")[0] || "",
      avatar: payload.picture || "",
      emailVerified: payload.email_verified === true,
    };
  } catch {
    return null;
  }
};
```

---

## Phase 5: Add Google Login Controller Function

**Read then edit `C:\Users\HP\Desktop\EasybuyTracker\auth-service\Controller\AuthController.ts`**

### 5A. Add import

At the top of the file, add:

```typescript
import { verifyGoogleIdToken } from "../Utils/googleAuth.js";
```

### 5B. Add the `GoogleLogin` function

Add this exported function alongside the existing `LoginUser`, `RegisterUser`, etc.:

```typescript
export const GoogleLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { idToken, app } = req.body;

    if (!idToken || typeof idToken !== "string") {
      return res.status(400).json({ success: 0, message: "idToken is required" });
    }

    const appName = String(app || "").trim().toLowerCase() || "auth-service";

    // 1. Verify the Google ID token
    const googleUser = await verifyGoogleIdToken(idToken);
    if (!googleUser) {
      return res.status(401).json({ success: 0, message: "Invalid or expired Google token" });
    }

    // 2. Check if user exists by googleId OR email
    const UserModel = (await import("../Model/UserModel.js")).default;
    const ProfileModel = (await import("../Model/ProfileModel.js")).default;

    let user = await UserModel.findOne({
      $or: [
        { googleId: googleUser.googleId },
        { email: googleUser.email },
      ],
    });

    if (user && user.disabled) {
      return res.status(403).json({ success: 0, message: "Account is disabled" });
    }

    if (user) {
      // 3A. Existing user — link Google account if not already linked
      const updates: Record<string, unknown> = {};

      if (!user.googleId) {
        updates.googleId = googleUser.googleId;
      }

      if (!user.authMethods?.includes("google")) {
        updates.authMethods = [...(user.authMethods || []), "google"];
      }

      if (!user.emailVerified && googleUser.emailVerified) {
        updates.emailVerified = true;
      }

      if (Object.keys(updates).length > 0) {
        await UserModel.updateOne({ _id: user._id }, { $set: updates });
        user = await UserModel.findById(user._id);
      }
    } else {
      // 3B. New user — create account
      user = await UserModel.create({
        email: googleUser.email,
        fullName: googleUser.fullName,
        googleId: googleUser.googleId,
        role: "user",
        emailVerified: true,
        disabled: false,
        originApp: appName,
        authMethods: ["google"],
      });

      // Create profile
      const nameParts = googleUser.fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await ProfileModel.create({
        user: user._id,
        firstName,
        lastName,
        avatar: googleUser.avatar,
      });
    }

    if (!user) {
      return res.status(500).json({ success: 0, message: "Failed to create or retrieve user" });
    }

    // 4. Update avatar on profile if user doesn't have one
    if (googleUser.avatar) {
      await ProfileModel.updateOne(
        { user: user._id, $or: [{ avatar: "" }, { avatar: { $exists: false } }] },
        { $set: { avatar: googleUser.avatar } }
      );
    }

    // 5. Create session and issue JWT (reuse existing helpers)
    // Import the helpers used by LoginUser
    const { createSessionForUser, findUserWithProfile, toSafeUser, toSafeProfile } = await import("../Utils/authHelpers.js");

    const { token } = await createSessionForUser(user._id.toString(), user.role, user.email, user.fullName, appName, req);

    res.cookie("sessionId", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    const fullUser = await findUserWithProfile(user._id.toString());

    return res.status(200).json({
      success: 1,
      message: "Google login successful",
      data: {
        token,
        user: fullUser?.user ? toSafeUser(fullUser.user) : null,
        profile: fullUser?.profile ? toSafeProfile(fullUser.profile) : null,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Google login failed";
    return res.status(500).json({ success: 0, message });
  }
};
```

IMPORTANT: The function above uses `createSessionForUser`, `findUserWithProfile`, `toSafeUser`, and `toSafeProfile` from `authHelpers.ts`. Read that file first to confirm these helpers exist and match the expected signatures. If the function signatures differ, adapt the `GoogleLogin` function to match the actual helpers.

If `createSessionForUser` does not exist as a standalone helper, look at how `LoginUser` creates sessions and JWT tokens, then replicate that same pattern inside `GoogleLogin`.

---

## Phase 6: Add Route

**Read then edit `C:\Users\HP\Desktop\EasybuyTracker\auth-service\Router\AuthRouter.ts`**

Add the Google login route. Import `GoogleLogin` from the controller and add:

```typescript
router.post("/google", rateLimiter, GoogleLogin);
```

Place it alongside the existing `/login` route. It uses the same rate limiter.

---

## Phase 7: Add Auth Method Type

**Read then edit `C:\Users\HP\Desktop\EasybuyTracker\auth-service\types\auth.ts`**

Add this type if it doesn't already exist:

```typescript
export type AuthMethod = "password" | "google";
```

Update `AuthApp` if needed to include the Google-related types.

---

## Phase 8: Frontend — Install Google OAuth Package

**In `C:\Users\HP\Desktop\client`**, install:

```bash
npm install @react-oauth/google
```

---

## Phase 9: Frontend — Add Google OAuth Provider

**Read then edit the app's root component.** This is likely `C:\Users\HP\Desktop\client\src\main.tsx` or `C:\Users\HP\Desktop\client\src\App.tsx`.

Find where the app is wrapped with providers (React Router, Redux, etc.) and add `GoogleOAuthProvider` as an outer wrapper:

```tsx
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
```

Then wrap the app:

```tsx
<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
  {/* existing app tree */}
</GoogleOAuthProvider>
```

If the client ID is empty, the Google Sign-In button will simply not render (graceful degradation).

---

## Phase 10: Frontend — Add Google Sign-In Button to Login Page

**Read `C:\Users\HP\Desktop\client\src\pages\LoginPage.tsx` (or whatever the login page is called) fully before making changes.**

### 10A. Add import

```tsx
import { GoogleLogin } from "@react-oauth/google";
```

### 10B. Add Google login handler

Add a function that sends the Google ID token to the auth service:

```typescript
const handleGoogleLogin = async (credentialResponse: { credential?: string }) => {
  const idToken = credentialResponse.credential;
  if (!idToken) {
    toast.error("Google sign-in failed");
    return;
  }

  try {
    const response = await api.post("/api/v1/auth/google", {
      idToken,
      app: "easybuy",
    });

    const token = response.data?.data?.token;
    if (token) {
      // Store token the same way the existing login stores it
      // Look at the existing login success handler and replicate it
      localStorage.setItem("token", token);
      // Navigate to dashboard or wherever the existing login navigates
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Google sign-in failed");
  }
};
```

IMPORTANT: Read the existing password login handler in the same file. The Google login handler must store the token and navigate the same way. Do NOT create a different flow — replicate the existing success path exactly.

### 10C. Add the button to the form

Add the Google Sign-In button below or above the existing login form. A common pattern is a divider:

```tsx
{import.meta.env.VITE_GOOGLE_CLIENT_ID && (
  <>
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-card px-2 text-muted-foreground">or</span>
      </div>
    </div>
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => toast.error("Google sign-in failed")}
        theme="outline"
        size="large"
        width="100%"
      />
    </div>
  </>
)}
```

The `{import.meta.env.VITE_GOOGLE_CLIENT_ID && (...)}` guard ensures the button only renders if the Google Client ID is configured. If it's not set, the login page looks exactly like before.

---

## Phase 11: Frontend — Add Environment Variable

**Create or edit `C:\Users\HP\Desktop\client\.env`** (or `.env.local`):

```
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

This is a placeholder. The actual value comes from Google Cloud Console (manual setup, not part of this implementation).

---

## Phase 12: Verify

### Auth Service verification

From `C:\Users\HP\Desktop\EasybuyTracker\auth-service`, run:

```bash
npx tsc --noEmit
```

Fix ALL TypeScript errors.

### Frontend verification

From `C:\Users\HP\Desktop\client`, run:

```bash
npx tsc --noEmit
```

Fix ALL TypeScript errors.

---

## DO NOT change

- Existing password login flow (LoginUser function stays unchanged)
- Existing registration flow (RegisterUser stays unchanged)
- Session model schema (no changes needed — sessions created by Google login are identical to password login sessions)
- JWT payload structure (same fields: _id, email, fullName, role, jti, app)
- Consumer middleware (unchanged — it verifies JWT, doesn't know or care about Google)
- Any other controllers, routes, or middleware not mentioned above
- Admin endpoints (admin user creation stays password-only)
- Internal service-to-service endpoints

## Summary of what Google OAuth changes

| What | Before | After |
|---|---|---|
| Login methods | Password only | Password OR Google |
| User model | password required | password required only if no googleId |
| New fields on User | — | `authMethods: ["password"\|"google"]`, `googleId: string` |
| New endpoint | — | `POST /api/v1/auth/google` |
| New dependency (backend) | — | `google-auth-library` |
| New dependency (frontend) | — | `@react-oauth/google` |
| JWT payload | unchanged | unchanged |
| Session model | unchanged | unchanged |
| Frontend login page | password form only | password form + Google Sign-In button |
