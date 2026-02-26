import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { BlurLoadingContainer } from "../components/BlurLoadingContainer";
import { getRtkErrorMessage } from "../lib/rtkError";
import {
  useDeleteSuperAdminUserMutation,
  useGetSuperAdminLoginStatsQuery,
  useGetSuperAdminUsersQuery,
  useGetSuperAdminUsersWithItemsQuery,
} from "../store/api/backendApi";
import type { SuperAdminLoginStats, SuperAdminUser } from "../types/api";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value || 0);

const emptyStats: SuperAdminLoginStats = {
  usersLoggedIn: 0,
  adminsLoggedIn: 0,
  superAdminsLoggedIn: 0,
  totalLoggedIn: 0,
};

export const SuperAdminPage = () => {
  const [itemsSectionRequested, setItemsSectionRequested] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deleteReasonById, setDeleteReasonById] = useState<Record<string, string>>({});
  const [hiddenUserIds, setHiddenUserIds] = useState<Record<string, boolean>>({});
  const usersWithItemsSectionRef = useRef<HTMLDivElement | null>(null);

  const statsQuery = useGetSuperAdminLoginStatsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const usersQuery = useGetSuperAdminUsersQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const usersWithItemsQuery = useGetSuperAdminUsersWithItemsQuery(undefined, {
    skip: !itemsSectionRequested,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [deleteSuperAdminUser] = useDeleteSuperAdminUserMutation();

  useEffect(() => {
    if (itemsSectionRequested || !usersWithItemsSectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setItemsSectionRequested(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01,
        rootMargin: "200px 0px",
      }
    );

    observer.observe(usersWithItemsSectionRef.current);
    return () => observer.disconnect();
  }, [itemsSectionRequested]);

  const stats = useMemo(() => statsQuery.data?.data || emptyStats, [statsQuery.data?.data]);
  const users = useMemo(
    () => (usersQuery.data?.data || []).filter((user) => !hiddenUserIds[user._id]),
    [hiddenUserIds, usersQuery.data?.data]
  );
  const usersWithItems = useMemo(
    () => (usersWithItemsQuery.data?.data || []).filter((user) => !hiddenUserIds[user._id]),
    [hiddenUserIds, usersWithItemsQuery.data?.data]
  );

  const pageLoading = statsQuery.isLoading || usersQuery.isLoading;
  const itemsSectionLoading = itemsSectionRequested && usersWithItemsQuery.isLoading;
  const itemsSectionLoaded = Boolean(usersWithItemsQuery.data?.data);

  const pageError = getRtkErrorMessage(
    (statsQuery.error || usersQuery.error) as any,
    "Failed to load super admin data"
  );
  const itemsSectionError = getRtkErrorMessage(
    usersWithItemsQuery.error as any,
    "Failed to load users with items"
  );

  const refreshAll = async () => {
    await Promise.all([statsQuery.refetch(), usersQuery.refetch()]);
    if (itemsSectionRequested) {
      await usersWithItemsQuery.refetch();
    }
  };

  const deleteTarget = async (user: SuperAdminUser) => {
    if (user.role === "SuperAdmin") {
      toast.error("SuperAdmin accounts cannot be deleted from this screen");
      return;
    }

    const userId = user._id;
    const confirmed = window.confirm(
      `Delete ${user.fullName || user.email || userId} (${user.role})? This action is permanent.`
    );
    if (!confirmed) return;

    setDeletingUserId(userId);
    try {
      const reason = (deleteReasonById[userId] || "").trim();
      const response = await deleteSuperAdminUser({ userId, reason }).unwrap();
      toast.success(response?.message || "User deleted");
      setDeleteReasonById((prev) => ({ ...prev, [userId]: "" }));
      setHiddenUserIds((prev) => ({ ...prev, [userId]: true }));
    } catch (_error) {
      // Error toast already handled by the shared RTK base query wrapper.
    } finally {
      setDeletingUserId(null);
    }
  };

  const totalEasyBoughtItems = useMemo(
    () => usersWithItems.reduce((sum, user) => sum + (user.easyBoughtItems?.length || 0), 0),
    [usersWithItems]
  );

  return (
    <BlurLoadingContainer loading={pageLoading} minDurationMs={150}>
      <section className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">Super Admin Console</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage users/admins, inspect user ownership, and monitor active sessions.
              </p>
            </div>
            <button
              type="button"
              onClick={refreshAll}
              className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              Refresh All
            </button>
          </div>

          {pageError && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <span>{pageError}</span>
              <button
                type="button"
                onClick={refreshAll}
                className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Users Logged In</p>
            <p className="mt-2 text-2xl font-semibold">{stats.usersLoggedIn}</p>
          </article>
          <article className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Admins Logged In</p>
            <p className="mt-2 text-2xl font-semibold">{stats.adminsLoggedIn}</p>
          </article>
          <article className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">SuperAdmins Logged In</p>
            <p className="mt-2 text-2xl font-semibold">{stats.superAdminsLoggedIn}</p>
          </article>
          <article className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Active Sessions</p>
            <p className="mt-2 text-2xl font-semibold">{stats.totalLoggedIn}</p>
          </article>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
          <h2 className="text-lg font-semibold">All Users (With Creator Admin)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Delete any User/Admin and capture an audit reason for traceability.
          </p>
          <div className="mt-4 w-full max-w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-border rounded-lg border border-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Role</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Created By</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Reason</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {users.map((user) => {
                  const isSuperAdmin = user.role === "SuperAdmin";
                  const creatorName = user.createdByAdmin?.fullName || "-";
                  const creatorEmail = user.createdByAdmin?.email || "-";
                  const isDeleting = deletingUserId === user._id;

                  return (
                    <tr key={user._id}>
                      <td className="px-3 py-2 text-sm">{user.fullName || "-"}</td>
                      <td className="px-3 py-2 text-sm">{user.email || "-"}</td>
                      <td className="px-3 py-2 text-sm">
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            user.role === "Admin"
                              ? "bg-primary/15 text-primary"
                              : user.role === "SuperAdmin"
                                ? "bg-success/15 text-success"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        {creatorName}
                        <p className="text-xs text-muted-foreground">{creatorEmail}</p>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <input
                          value={deleteReasonById[user._id] || ""}
                          onChange={(event) =>
                            setDeleteReasonById((prev) => ({
                              ...prev,
                              [user._id]: event.target.value,
                            }))
                          }
                          className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Reason for audit log"
                          disabled={isSuperAdmin || isDeleting}
                        />
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <button
                          type="button"
                          onClick={() => deleteTarget(user)}
                          disabled={isSuperAdmin || isDeleting}
                          className="flex items-center justify-center gap-2 rounded-md bg-destructive px-3 py-1.5 text-xs text-destructive-foreground hover:opacity-90 disabled:opacity-50"
                        >
                          {isSuperAdmin ? (
                            "Protected"
                          ) : isDeleting ? (
                            <>
                              <ClipLoader color="hsl(var(--destructive-foreground))" size={14} speedMultiplier={0.9} />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-sm text-muted-foreground" colSpan={6}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          ref={usersWithItemsSectionRef}
          className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Users and EasyBought Items</h2>
            <span className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              Total EasyBought Items: {itemsSectionLoaded ? totalEasyBoughtItems : "--"}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {!itemsSectionRequested && (
              <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                Scroll to this section to load users and items.
              </p>
            )}

            {itemsSectionRequested && itemsSectionLoading && (
              <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">Loading users and items...</p>
            )}

            {itemsSectionRequested && itemsSectionError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <p>{itemsSectionError}</p>
                <button
                  type="button"
                  onClick={() => usersWithItemsQuery.refetch()}
                  className="mt-3 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90"
                >
                  Retry section
                </button>
              </div>
            )}

            {itemsSectionRequested &&
              !itemsSectionLoading &&
              !itemsSectionError &&
              usersWithItems.map((user) => (
                <article key={user._id} className="rounded-xl border border-border bg-muted p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold">{user.fullName || user.email || user._id}</h3>
                      <p className="text-xs text-muted-foreground">
                        {user.email || "-"} | {user.role}
                      </p>
                    </div>
                    <span className="rounded bg-card px-2 py-1 text-xs text-muted-foreground">
                      Items: {user.easyBoughtItems?.length || 0}
                    </span>
                  </div>

                  {user.easyBoughtItems?.length ? (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {user.easyBoughtItems.map((item) => (
                        <div key={item._id} className="rounded-lg border border-border bg-card p-3">
                          <p className="text-sm font-medium">{item.IphoneModel}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Plan: {item.Plan}</p>
                          <p className="text-xs text-muted-foreground">
                            Phone Price: {formatCurrency(item.PhonePrice || 0)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Down Payment: {formatCurrency(item.downPayment || 0)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Loaned Amount: {formatCurrency(item.loanedAmount || 0)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-muted-foreground">No EasyBought items for this user.</p>
                  )}
                </article>
              ))}

            {itemsSectionRequested &&
              !itemsSectionLoading &&
              !itemsSectionError &&
              usersWithItems.length === 0 && (
                <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                  No user + item data available.
                </p>
              )}
          </div>
        </div>
      </section>
    </BlurLoadingContainer>
  );
};
