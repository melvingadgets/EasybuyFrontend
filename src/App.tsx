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
import { SuperAdminPublicAnalyticsPage } from "./pages/SuperAdminPublicAnalyticsPage";
import { SuperAdminPublicRequestsPage } from "./pages/SuperAdminPublicRequestsPage";
import { SuperAdminAbandonedDraftsPage } from "./pages/SuperAdminAbandonedDraftsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { GlobalLoadingOverlay } from "./components/GlobalLoadingOverlay";
import { MelvinBridge } from "./components/MelvinBridge";
import { RedirectToApply } from "./components/RedirectToApply";

const App = () => {
  return (
    <>
      <GlobalLoadingOverlay minDurationMs={150} />
      <MelvinBridge />
      <Routes>
        {/* The public form lives in the Apply app now; old links keep working (RedirectToApply). */}
        <Route path="/apply" element={<RedirectToApply />} />
        <Route path="/apply/verify" element={<RedirectToApply />} />

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
            <Route path="/superadmin/public-analytics" element={<SuperAdminPublicAnalyticsPage />} />
            <Route path="/superadmin/public-requests" element={<SuperAdminPublicRequestsPage />} />
            <Route path="/superadmin/abandoned-drafts" element={<SuperAdminAbandonedDraftsPage />} />
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
