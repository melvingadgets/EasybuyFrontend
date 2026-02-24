import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { ApiSuccess, CurrentUser } from "../types/api";
import toast from "react-hot-toast";
import { auth } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { BlurLoadingContainer } from "../components/BlurLoadingContainer";

export const ProfilePage = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiSuccess<CurrentUser>>("/api/v1/user/profile");
      const profile = (data.data || {}) as any;
      setUser({
        _id: profile._id || "",
        userName: profile.FullName || profile.fullName || profile.userName || "",
        fullName: profile.FullName || profile.fullName || profile.userName || "",
        role: profile.role || "User",
        email: profile.email,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const logoutLocal = () => {
    auth.clearToken();
    toast.success("Logged out locally");
    navigate("/login");
  };

  return (
    <BlurLoadingContainer loading={loading} minDurationMs={1300}>
      <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <h1 className="text-xl font-semibold">Current User Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          
        </p>
        {!loading && !user && (
          <p className="mt-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            No user data returned.
          </p>
        )}
        {user && (
          <dl className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-muted p-3">
              <dt className="text-xs uppercase text-muted-foreground">Username</dt>
              <dd className="text-sm font-medium">{(user.fullName || user.userName || "N/A").toUpperCase()}</dd>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <dt className="text-xs uppercase text-muted-foreground">Email</dt>
              <dd className="text-sm font-medium">{user.email || "Not provided by API"}</dd>
            </div>
          </dl>
        )}
      </div>

      {/* <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <h2 className="text-lg font-semibold">Session Actions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your backend currently exposes login and local token handling. Server-side logout/profile update/delete
          routes are not present in <code>Router/UserRouter.ts</code>.
        </p>
        <button
          onClick={logoutLocal}
          className="mt-4 rounded-lg bg-destructive px-4 py-2 text-destructive-foreground hover:opacity-90"
        >
          Logout (Local Token)
        </button>
      </div> */}
      </section>
    </BlurLoadingContainer>
  );
};
