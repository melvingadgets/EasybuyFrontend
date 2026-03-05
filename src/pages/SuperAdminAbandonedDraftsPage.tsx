import { useMemo, useState } from "react";
import { BlurLoadingContainer } from "../components/BlurLoadingContainer";
import { MobileField } from "../components/superadmin/MobileField";
import { getRtkErrorMessage } from "../lib/rtkError";
import { formatDateTime } from "../lib/superadminFormat";
import { useGetSuperAdminAbandonedPublicEasyBuyDraftsQuery } from "../store/api/backendApi";

export const SuperAdminAbandonedDraftsPage = () => {
  const [search, setSearch] = useState("");
  const [inactivityMinutesInput, setInactivityMinutesInput] = useState("30");

  const inactivityMinutes = Math.max(Number.parseInt(inactivityMinutesInput || "30", 10) || 30, 5);

  const draftsQuery = useGetSuperAdminAbandonedPublicEasyBuyDraftsQuery({
    search: search.trim() || undefined,
    page: 1,
    limit: 100,
    inactivityMinutes,
  });

  const loading = draftsQuery.isLoading;
  const errorMessage = getRtkErrorMessage(
    draftsQuery.error as any,
    "Failed to load abandoned EasyBuy drafts"
  );

  const drafts = useMemo(() => draftsQuery.data?.data || [], [draftsQuery.data?.data]);
  const pagination = draftsQuery.data?.pagination;
  const meta = draftsQuery.data?.meta;

  return (
    <BlurLoadingContainer loading={loading} minDurationMs={150}>
      <section className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-soft sm:p-6">
          <h1 className="text-xl font-semibold">Abandoned EasyBuy Drafts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Leads who started the public form but did not submit.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search name, email, phone, model"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <input
              type="number"
              min={5}
              className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Inactive minutes"
              value={inactivityMinutesInput}
              onChange={(event) => setInactivityMinutesInput(event.target.value)}
            />
            <button
              type="button"
              onClick={() => draftsQuery.refetch()}
              className="rounded-md bg-primary px-4 py-2.5 text-sm text-primary-foreground hover:opacity-90"
            >
              Refresh
            </button>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Abandoned if last update is older than {meta?.inactivityMinutes ?? inactivityMinutes} minutes.
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{errorMessage}</div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-soft sm:p-6">
          <div className="mb-3 text-xs text-muted-foreground">
            {pagination?.total !== undefined ? `Total: ${pagination.total}` : `Showing: ${drafts.length}`}
          </div>

          <div className="space-y-3 md:hidden">
            {drafts.map((draft) => (
              <article key={draft.anonymousId} className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm font-semibold">{draft.fullName || "-"}</p>
                <p className="text-xs text-muted-foreground">{draft.email || "-"}</p>

                <div className="mt-3 grid gap-3">
                  <MobileField label="Phone" value={draft.phone || "-"} />
                  <MobileField
                    label="Device"
                    value={
                      <>
                        <p>{draft.iphoneModel || "-"}</p>
                        <p className="text-xs text-muted-foreground">
                          {draft.capacity || "-"} | {draft.plan || "-"}
                        </p>
                      </>
                    }
                  />
                  <MobileField label="Current Step" value={draft.currentStep || "-"} />
                  <MobileField label="Last Seen" value={formatDateTime(draft.updatedAt)} />
                </div>
              </article>
            ))}
            {drafts.length === 0 && (
              <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">No abandoned drafts found.</p>
            )}
          </div>

          <div className="hidden w-full overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-border rounded-lg border border-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Phone</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Device</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Step</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {drafts.map((draft) => (
                  <tr key={draft.anonymousId}>
                    <td className="px-3 py-2 text-sm">{draft.fullName || "-"}</td>
                    <td className="px-3 py-2 text-sm">{draft.email || "-"}</td>
                    <td className="px-3 py-2 text-sm">{draft.phone || "-"}</td>
                    <td className="px-3 py-2 text-sm">
                      {draft.iphoneModel || "-"}
                      <p className="text-xs text-muted-foreground">
                        {draft.capacity || "-"} | {draft.plan || "-"}
                      </p>
                    </td>
                    <td className="px-3 py-2 text-sm">{draft.currentStep || "-"}</td>
                    <td className="px-3 py-2 text-sm">{formatDateTime(draft.updatedAt)}</td>
                  </tr>
                ))}
                {drafts.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-sm text-muted-foreground" colSpan={6}>
                      No abandoned drafts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </BlurLoadingContainer>
  );
};
