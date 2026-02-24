import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../lib/auth";
import { api } from "../lib/api";
import type { ApiSuccess, CurrentUser } from "../types/api";

type ProtectedRouteProps = {
  allowedRoles?: Array<"Admin" | "User">;
};

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  if (!auth.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const [status, setStatus] = useState<"checking" | "ok" | "unauthorized" | "forbidden">("checking");

  useEffect(() => {
    let mounted = true;

    const checkStatus = async () => {
      try {
        const { data } = await api.get<ApiSuccess<CurrentUser>>("/api/v1/user/getcurrentuser");
        const role = data?.data?.role || auth.getRole();

        if (!mounted) return;
        if (allowedRoles?.length && (!role || !allowedRoles.includes(role))) {
          setStatus("forbidden");
          return;
        }
        setStatus("ok");
      } catch {
        auth.clearToken();
        if (mounted) setStatus("unauthorized");
      }
    };

    checkStatus();
    return () => {
      mounted = false;
    };
  }, [allowedRoles]);

  if (status === "checking") {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        Checking access status...
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};
