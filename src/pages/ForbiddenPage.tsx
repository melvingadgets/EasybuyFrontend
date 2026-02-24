import { Link } from "react-router-dom";

export const ForbiddenPage = () => {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
      <h1 className="text-2xl font-semibold">Access Denied</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You do not have permission to view this page.
      </p>
      <Link to="/dashboard" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90">
        Go to Dashboard
      </Link>
    </section>
  );
};
