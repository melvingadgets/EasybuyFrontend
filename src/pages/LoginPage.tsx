import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../lib/auth";
import ClipLoader from "react-spinners/ClipLoader";
import { FaSignInAlt } from "react-icons/fa";

const AUTH_SERVICE_LOGIN_URL = "https://easybuytrackerbackend.onrender.com/api/v1/user/login-user";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
      const { data } = await axios.post(AUTH_SERVICE_LOGIN_URL, {
        email,
        password,
      });
      const token = data?.data;
      if (typeof token === "string") {
        auth.setToken(token);
      }
      toast.success(data?.message || "Login successful");
      navigate("/dashboard");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.reason ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed";
      toast.error(String(message));
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
