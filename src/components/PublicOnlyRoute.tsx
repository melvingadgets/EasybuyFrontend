import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { auth } from "../lib/auth";
import { safeReturnTo } from "../pages/LoginPage";

export const PublicOnlyRoute = () => {
  const [params] = useSearchParams();

  if (auth.isLoggedIn()) {
    // Someone already signed in who came back through a link (or a second tab) goes on to the page
    // they were trying to reach.
    return <Navigate to={safeReturnTo(params.get("returnTo"))} replace />;
  }

  return <Outlet />;
};
