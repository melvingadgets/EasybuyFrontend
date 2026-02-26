import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../lib/auth";

type ProtectedRouteProps = {
  allowedRoles?: Array<"Admin" | "User" | "SuperAdmin">;
};

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  if (!auth.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const role = auth.getRole();
  if (allowedRoles?.length && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};
