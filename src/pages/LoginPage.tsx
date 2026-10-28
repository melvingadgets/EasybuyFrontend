import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../lib/auth";
import { authUrl } from "../lib/authBase";
import ClipLoader from "react-spinners/ClipLoader";
import { FaSignInAlt } from "react-icons/fa";
import { isEmbeddedInMelvin } from "../lib/melvinBridge";

// Sign-in goes to the unified auth service (Shortwork/AGENTS.md §1.4: identity belongs to auth).
// It answers with an RS256 access token the EasyBuy backend verifies against auth's JWKS, plus a
// refresh token that renews it. The same response still carries a legacy `data` token; it is
// deliberately ignored — EasyBuy's Apply routes only accept the platform token.

type LoginResponse = {
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: { fullName?: string };
};

/** Only same-site paths: an open redirect would turn the login page into a phishing hop. */
export const safeReturnTo = (value: string | null): string => {
  const path = String(value ?? "").trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return "/dashboard";
  return path;
};

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnTo = safeReturnTo(params.get("returnTo"));

  useEffect(() => {
    // Inside Melvin OS the frame can be shorter than the login card, so the page must stay
    // scrollable or the Login button ends up out of reach.
    if (isEmbeddedInMelvin) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post<LoginResponse>(authUrl("/api/v1/auth/login"), {
        identifier: identifier.trim(),
        password,
        device: { userAgent: navigator.userAgent },
      });
      if (!data?.accessToken) {
        throw new Error("The sign-in service didn't return a session. Try again.");
      }
      auth.setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      toast.success(data?.message || "Login successful");
      navigate(returnTo, { replace: true });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.reason ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed";
      // "invalid credentials" is deliberately vague upstream; say what to do about it.
      toast.error(message === "invalid credentials" ? "Email or password is incorrect" : String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center overflow-hidden">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <FaSignInAlt className="text-base" />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-soft">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email or phone</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              type="text"
              placeholder="john@example.com"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              type="password"
              placeholder="********"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <ClipLoader color="hsl(var(--primary-foreground))" size={16} speedMultiplier={0.9} />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Need an admin account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
