import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { auth } from "../lib/auth";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/v1/user/login-user", { email, password });
      const token = data?.data;
      if (typeof token === "string") {
        auth.setToken(token);
      }
      toast.success(data?.message || "Login successful");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            *
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-soft">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
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
