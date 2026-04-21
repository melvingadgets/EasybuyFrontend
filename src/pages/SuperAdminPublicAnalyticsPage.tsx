import { BlurLoadingContainer } from "../components/BlurLoadingContainer";
import { useGetSuperAdminPublicEasyBuyAnalyticsQuery } from "../store/api/backendApi";
import { getRtkErrorMessage } from "../lib/rtkError";

const formatCount = (value: number) => new Intl.NumberFormat("en-US").format(Number(value || 0));

export const SuperAdminPublicAnalyticsPage = () => {
  const analyticsQuery = useGetSuperAdminPublicEasyBuyAnalyticsQuery({
    landingPath: "/apply",
  });

  const analyticsLoading = analyticsQuery.isLoading;
  const analytics = analyticsQuery.data?.data;
  const analyticsErrorMessage = getRtkErrorMessage(
    analyticsQuery.error as any,
    "Failed to load public EasyBuy analytics"
  );

  const analyticsCards = [
    { label: "Last Minute", value: analytics?.counts?.lastMinute },
    { label: "Last Hour", value: analytics?.counts?.lastHour },
    { label: "Last Day", value: analytics?.counts?.lastDay },
    { label: "Last Week", value: analytics?.counts?.lastWeek },
    { label: "Last Month", value: analytics?.counts?.lastMonth },
  ];

  return (
    <BlurLoadingContainer loading={analyticsLoading} minDurationMs={150}>
      <section className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-soft sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">Public EasyBuy Analytics</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Unique users, visits, traffic sources, and referrers for the public EasyBuy page.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tracking target: <span className="font-medium text-foreground">/apply</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => analyticsQuery.refetch()}
              className="rounded-md border border-border bg-background px-3 py-2 text-xs hover:bg-muted"
            >
              Refresh Analytics
            </button>
          </div>

          {analyticsErrorMessage && (
            <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {analyticsErrorMessage}
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {analyticsCards.map((item) => (
            <article key={item.label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">
                {analyticsLoading && !item.value ? "..." : formatCount(item.value?.users || 0)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Users
                <span className="mx-1">|</span>
                {formatCount(item.value?.visits || 0)} visits
              </p>
            </article>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-soft sm:p-6">
            <h2 className="text-sm font-semibold">Top Sources</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              UTM source first, otherwise referrer host, otherwise direct.
            </p>
            <div className="mt-3 space-y-2">
              {(analytics?.topSources || []).map((source) => (
                <div
                  key={source.source}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{source.source || "direct"}</p>
                    <p className="text-xs text-muted-foreground">{formatCount(source.visits)} visits</p>
                  </div>
                  <p className="text-sm font-semibold">{formatCount(source.users)} users</p>
                </div>
              ))}
              {!analyticsLoading && !(analytics?.topSources || []).length && (
                <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">No source data yet.</p>
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-soft sm:p-6">
            <h2 className="text-sm font-semibold">Top Referrers</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              External domains that sent traffic to the public EasyBuy page.
            </p>
            <div className="mt-3 space-y-2">
              {(analytics?.topReferrers || []).map((referrer) => (
                <div
                  key={referrer.referrerHost}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{referrer.referrerHost}</p>
                    <p className="text-xs text-muted-foreground">{formatCount(referrer.visits)} visits</p>
                  </div>
                  <p className="text-sm font-semibold">{formatCount(referrer.users)} users</p>
                </div>
              ))}
              {!analyticsLoading && !(analytics?.topReferrers || []).length && (
                <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">No referrer data yet.</p>
              )}
            </div>
          </article>
        </div>
      </section>
    </BlurLoadingContainer>
  );
};
