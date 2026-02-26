import { useMemo } from "react";
import { BlurLoadingContainer } from "../components/BlurLoadingContainer";
import { getRtkErrorMessage } from "../lib/rtkError";
import { useGetCurrentUserQuery } from "../store/api/backendApi";
import type { CurrentUser } from "../types/api";

const getString = (value: unknown) => (typeof value === "string" ? value : "");

export const ProfilePage = () => {
  const currentUserQuery = useGetCurrentUserQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const loading = currentUserQuery.isLoading;
  const error = getRtkErrorMessage(currentUserQuery.error as any, "Failed to load profile");

  const user = useMemo<CurrentUser | null>(() => {
    const profile = (currentUserQuery.data?.data || {}) as Record<string, unknown>;
    const id = getString(profile._id);
    const fullName =
      getString(profile.FullName) || getString(profile.fullName) || getString(profile.userName);
    const email = getString(profile.email);
    const role = getString(profile.role) || "User";

    if (!id && !fullName && !email) {
      return null;
    }

    return {
      _id: id,
      userName: fullName,
      fullName,
      role: role as CurrentUser["role"],
      email: email || undefined,
    };
  }, [currentUserQuery.data?.data]);

  return (
    <BlurLoadingContainer loading={loading} minDurationMs={150}>
      <section className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
          <h1 className="text-xl font-semibold">Current User Profile</h1>

          {error && (
            <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
          )}

          {!loading && !error && !user && (
            <p className="mt-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">No user data returned.</p>
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
      </section>
    </BlurLoadingContainer>
  );
};
