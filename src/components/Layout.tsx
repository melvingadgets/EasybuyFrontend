import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../lib/auth";
import { useEffect, useState } from "react";

type NavItem = {
  to: string;
  label: string;
  icon: string;
  guestOnly?: boolean;
  authOnly?: boolean;
  roles?: Array<"Admin" | "User">;
};

const navItems = [
  { to: "/login", label: "Login", icon: "L", guestOnly: true },
  { to: "/register", label: "Register Admin", icon: "RA", authOnly: true, roles: ["Admin"] },
  { to: "/dashboard", label: "Dashboard", icon: "D", authOnly: true },
  { to: "/profile", label: "Profile", icon: "P", authOnly: true },
  { to: "/receipts", label: "My Receipts", icon: "R", authOnly: true, roles: ["User"] },
  { to: "/receipt-approvals", label: "Receipt Approvals", icon: "AR", authOnly: true, roles: ["Admin"] },
  { to: "/create-user", label: "Create User", icon: "@", authOnly: true, roles: ["Admin"] },
  { to: "/items", label: "EasyBought Items", icon: "I", authOnly: true, roles: ["User"] },
  { to: "/create-item", label: "Create Item", icon: "CI", authOnly: true, roles: ["Admin"] },
] as NavItem[];

export const Layout = () => {
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
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
    navigate("/login");
  };

  const toggleTheme = () => {
    const nextIsDark = !isDarkMode;
    setIsDarkMode(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("easybuytracker_theme", nextIsDark ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--accent))_0%,_transparent_55%)]" />
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
        />
      )}

      <div className="mx-auto flex max-w-7xl">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 transform border-r border-sidebar-border bg-sidebar p-6 text-sidebar-foreground shadow-soft transition-transform duration-300 md:static md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}  
        > 
          <div className="mb-2 flex justify-end md:hidden">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded bg-sidebar-accent px-2 py-1 text-xs text-sidebar-accent-foreground"
            >
              Close
            </button>
          </div>
          <Link to="/" className="mb-2 block text-2xl font-semibold tracking-tight text-white">
            EasybuyTracker
          </Link>
          <p className="mb-2 text-xs text-sidebar-muted"></p>
          {isLoggedIn && (
            <p >
              
            </p>
          )}
          <nav className="space-y-2">
            {visibleNavItems.map((item) => (
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
                <span className="mr-2 inline-block w-6 text-center text-xs">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {isLoggedIn && (
            <button
              type="button"
              onClick={onLogout}
              className="mt-8 w-full rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90"
            >
              Logout
            </button>
          )}
        </aside>

        <div className="relative min-h-screen flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="rounded-md bg-sidebar px-3 py-2 text-sm text-sidebar-foreground md:hidden"
              >
                Menu
              </button>
              <p className="text-sm text-muted-foreground">EASYBUY TRACKER</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground hover:bg-muted"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </header>
          <main className="animate-fade-in p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
