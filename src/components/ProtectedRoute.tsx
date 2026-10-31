import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "../lib/auth";
import { can, hasMinRole, type Permission, type PlatformRole } from "../lib/access";

type ProtectedRouteProps = {
  /** The permission the screen needs. Preferred: it names the right, not who holds it. */
  perm?: Permission;
  /** A rank floor, for a screen that any staff member may see. */
  minRole?: PlatformRole;
};

/**
 * The signed-in gate for the finance screens.
 *
 * It asks the same questions the API asks (`can` / `hasMinRole` from the vendored
 * `lib/access.ts`), so a button that shows here is a request the backend will accept.
 * The old `allowedRoles` list was an *equality* check, so `["Admin"]` excluded a
 * SuperAdmin and hid Create User / Create Item from the person who owns them.
 *
 * This is a convenience, not a security boundary: the API enforces the same permissions
 * on every request, and a crafted token gets nothing from hiding or showing a page.
 */
export const ProtectedRoute = ({ perm, minRole }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!auth.isLoggedIn()) {
    // Send them back where they were headed once they sign in: an applicant who submitted the
    // form lands straight on the documents step instead of the dashboard.
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  const actor = auth.getClaim();
  const allowed = perm ? can(actor, perm) : minRole ? hasMinRole(actor, minRole) : true;
  if (!allowed) return <Navigate to="/403" replace />;

  return <Outlet />;
};
