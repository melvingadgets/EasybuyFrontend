import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../lib/auth";

export const PublicOnlyRoute = () => {
  if (auth.isLoggedIn()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
