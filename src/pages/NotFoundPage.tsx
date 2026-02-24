import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
      <h1 className="text-2xl font-semibold">Page Not Found</h1>
      <p className="mt-2 text-sm text-muted-foreground">The route does not exist.</p>
      <Link to="/" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90">
        Back to Home
      </Link>
    </section>
  );
};
