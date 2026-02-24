import { FormEvent, useState } from "react";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    Password: ""
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/v1/user/createadmin", form);
      toast.success(data?.message || "Registration successful");
      setForm({ firstName: "", lastName: "", email: "", Password: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            +
          </div>
          <h1 className="text-2xl font-bold">Create Admin Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Endpoint: POST /api/v1/user/createadmin</p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-soft">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">First name</label>
              <input
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="John"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last name</label>
              <input
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                type={showPw ? "text" : "password"}
                placeholder="********"
                value={form.Password}
                onChange={(e) => setForm({ ...form, Password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
