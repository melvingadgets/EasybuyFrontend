import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "../lib/auth";

type ProtectedRouteProps = {
  allowedRoles?: Array<"Admin" | "User" | "SuperAdmin">;
};

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!auth.isLoggedIn()) {
    // Send them back where they were headed once they sign in: an applicant who submitted the
    // form lands straight on the documents step instead of the dashboard.
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  const role = auth.getRole();
  if (allowedRoles?.length && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};
