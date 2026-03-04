import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicOnlyRoute } from "./components/PublicOnlyRoute";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CreateUserPage } from "./pages/CreateUserPage";
import { ItemsPage } from "./pages/ItemsPage";
import { CreateItemPage } from "./pages/CreateItemPage";
import { ReceiptUploadPage } from "./pages/ReceiptUploadPage";
import { AdminReceiptApprovalsPage } from "./pages/AdminReceiptApprovalsPage";
import { SuperAdminPage } from "./pages/SuperAdminPage";
import { SuperAdminDateMaintenancePage } from "./pages/SuperAdminDateMaintenancePage";
import { SuperAdminPricingPage } from "./pages/SuperAdminPricingPage";
import { PublicEasyBuyVerifyPage } from "./pages/PublicEasyBuyVerifyPage";
import { SuperAdminPublicRequestsPage } from "./pages/SuperAdminPublicRequestsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { GlobalLoadingOverlay } from "./components/GlobalLoadingOverlay";
import { useEffect } from "react";

const nextAppUrl = String(import.meta.env.VITE_NEXT_APP_URL || "").trim();

const ApplyRedirectPage = () => {
  useEffect(() => {
    if (!nextAppUrl) return;
    const query = window.location.search || "";
    const target = `${nextAppUrl}${query}`;
    window.location.replace(target);
  }, []);

  if (!nextAppUrl) {
    return (
      <div className="mx-auto max-w-xl p-6">
        <h1 className="text-lg font-semibold">Apply Redirect Not Configured</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set <code>VITE_NEXT_APP_URL</code> in your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <p className="text-sm text-muted-foreground">Redirecting to application form...</p>
    </div>
  );
};

const App = () => {
  return (
    <>
      <GlobalLoadingOverlay minDurationMs={150} />
      <Routes>
        <Route path="/apply" element={<ApplyRedirectPage />} />
        <Route path="/apply/verify" element={<PublicEasyBuyVerifyPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
            <Route path="/items" element={<ItemsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
            <Route path="/receipts" element={<ReceiptUploadPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/create-user" element={<CreateUserPage />} />
            <Route path="/create-item" element={<CreateItemPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
            <Route path="/receipt-approvals" element={<AdminReceiptApprovalsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
            <Route path="/superadmin" element={<SuperAdminPage />} />
            <Route path="/superadmin/pricing" element={<SuperAdminPricingPage />} />
            <Route path="/superadmin/public-requests" element={<SuperAdminPublicRequestsPage />} />
            <Route path="/superadmin/date-maintenance" element={<SuperAdminDateMaintenancePage />} />
          </Route>

          <Route path="/users" element={<Navigate to="/404" replace />} />

          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
