import type { IconType } from "react-icons";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../lib/auth";
import { useEffect, useState } from "react";
import { GlobalLoadingOverlay } from "./GlobalLoadingOverlay";
import { useAppDispatch } from "../store/hooks";
import { backendApi } from "../store/api/backendApi";
import {
  FaBars,
  FaBoxOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaMoon,
  FaPlusSquare,
  FaReceipt,
  FaSignInAlt,
  FaSignOutAlt,
  FaSun,
  FaTachometerAlt,
  FaTimes,
  FaUserCircle,
  FaUserCog,
  FaUserPlus,
  FaUserShield,
} from "react-icons/fa";

type NavItem = {
  to: string;
  label: string;
  icon: IconType;
  guestOnly?: boolean;
  authOnly?: boolean;
  roles?: Array<"Admin" | "User" | "SuperAdmin">;
};

const navItems = [
  { to: "/login", label: "Login", icon: FaSignInAlt, guestOnly: true },
  { to: "/register", label: "Register Admin", icon: FaUserShield, authOnly: true, roles: ["SuperAdmin"] },
  { to: "/dashboard", label: "Dashboard", icon: FaTachometerAlt, authOnly: true },
  { to: "/profile", label: "Profile", icon: FaUserCircle, authOnly: true },
  { to: "/receipts", label: "My Receipts", icon: FaReceipt, authOnly: true, roles: ["User"] },
  { to: "/receipt-approvals", label: "Receipt Approvals", icon: FaCheckCircle, authOnly: true, roles: ["SuperAdmin"] },
  { to: "/superadmin/date-maintenance", label: "Date Maintenance", icon: FaCalendarAlt, authOnly: true, roles: ["SuperAdmin"] },
  { to: "/create-user", label: "Create User", icon: FaUserPlus, authOnly: true, roles: ["Admin"] },
  { to: "/items", label: "EasyBought Items", icon: FaBoxOpen, authOnly: true, roles: ["User"] },
  { to: "/create-item", label: "Create Item", icon: FaPlusSquare, authOnly: true, roles: ["Admin"] },
  { to: "/superadmin", label: "Super Admin", icon: FaUserCog, authOnly: true, roles: ["SuperAdmin"] },
  { to: "/superadmin/pricing", label: "Pricing", icon: FaBoxOpen, authOnly: true, roles: ["SuperAdmin"] },
  { to: "/superadmin/public-requests", label: "Public Requests", icon: FaReceipt, authOnly: true, roles: ["SuperAdmin"] },
] as NavItem[];

export const Layout = () => {
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoggedIn = auth.isLoggedIn();
  const role = auth.getRole();

  useEffect(() => {
    const savedTheme = localStorage.getItem("easybuytracker_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", shouldUseDark);
    setIsDarkMode(shouldUseDark);
  }, []);

  const visibleNavItems = navItems.filter((item) => {
    if (item.guestOnly && isLoggedIn) return false;
    if (item.authOnly && !isLoggedIn) return false;
    if (item.roles && (!role || !item.roles.includes(role))) return false;
    return true;
  });

  const onLogout = () => {
    auth.clearToken();
    dispatch(backendApi.util.resetApiState());
    navigate("/login", { replace: true });
  };

  const toggleTheme = () => {
    const nextIsDark = !isDarkMode;
    setIsDarkMode(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("easybuytracker_theme", nextIsDark ? "dark" : "light");
  };

  const renderThemeSwitch = (className = "") => (
    <button
      type="button"
      role="switch"
      aria-checked={isDarkMode}
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-14 items-center rounded-full border border-border px-1 transition-colors ${
        isDarkMode ? "bg-primary/20" : "bg-muted"
      } ${className}`}
    >
      <span
        className={`pointer-events-none absolute left-2 transition-all ${
          isDarkMode ? "text-[9px] text-amber-300/60" : "text-[11px] text-yellow-400"
        }`}
      >
        <FaSun />
      </span>
      <span
        className={`pointer-events-none absolute right-2 transition-all ${
          isDarkMode ? "text-[11px] text-sky-400" : "text-[9px] text-sky-300/60"
        }`}
      >
        <FaMoon />
      </span>
      <span
        className={`relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-[13px] shadow transition-transform ${
          isDarkMode
            ? "translate-x-6 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.75)]"
            : "translate-x-0 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.75)]"
        }`}
      >
        {isDarkMode ? <FaMoon /> : <FaSun />}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <GlobalLoadingOverlay minDurationMs={150} />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--accent))_0%,_transparent_55%)] dark:hidden" />
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
        />
      )}

      <div className="flex w-full min-w-0 overflow-x-clip">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 transform border-r border-sidebar-border bg-sidebar p-6 text-sidebar-foreground shadow-soft transition-transform duration-300 md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-2 flex justify-end md:hidden">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              className="inline-flex h-8 w-8 items-center justify-center rounded bg-sidebar-accent text-sidebar-accent-foreground"
            >
              <FaTimes size={14} />
            </button>
          </div>
          <Link to="/" className="mb-2 block text-2xl font-semibold tracking-tight text-sidebar-foreground">
            EasybuyTracker
          </Link>
          <div className="mb-4 flex items-center justify-between rounded-lg bg-sidebar-accent/70 px-3 py-2 md:hidden">
            <p className="text-xs uppercase tracking-wide text-sidebar-muted">Theme</p>
            {renderThemeSwitch()}
          </div>
          <nav className="space-y-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`
                }
              >
                <span className="mr-2 inline-flex w-6 items-center justify-center text-sm">
                  <Icon />
                </span>
                {item.label}
              </NavLink>
              );
            })}
          </nav>

          {isLoggedIn && (
            <button
              type="button"
              onClick={onLogout}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90"
            >
              <FaSignOutAlt className="text-xs" />
              Logout
            </button>
          )}
        </aside>

        <div className="relative min-h-screen min-w-0 flex-1 md:ml-72">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:px-8">
            <p className="text-sm text-muted-foreground">EASYBUY TRACKER</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Open navigation menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-sidebar text-sidebar-foreground md:hidden"
              >
                <FaBars size={15} />
              </button>
              {renderThemeSwitch("hidden md:inline-flex")}
            </div>
          </header>
          <main className="min-h-[calc(100dvh-61px)] min-w-0 overflow-x-clip animate-fade-in p-4 md:min-h-[calc(100dvh-65px)] md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
