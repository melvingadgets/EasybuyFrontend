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
import { ApprovedOnlyRoute } from "./components/ApprovedOnlyRoute";
import { ApplyPage } from "./pages/apply/ApplyPage";
import { ApplyDocumentsPage } from "./pages/apply/ApplyDocumentsPage";
import { ApplyStatusPage } from "./pages/apply/ApplyStatusPage";

const App = () => {
  return (
    <>
      <GlobalLoadingOverlay minDurationMs={150} />
      <MelvinBridge />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Apply: anonymous all the way to submitting. The login wall is on the documents step. */}
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/apply/form" element={<ApplyPage />} />
          {/* The old verify page's address: an applicant following a link from an email lands on
              their status, which is where verification progress actually shows now. */}
          <Route path="/apply/verify" element={<Navigate to="/apply/status" replace />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/apply/documents" element={<ApplyDocumentsPage />} />
            <Route path="/apply/status" element={<ApplyStatusPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* The finance screens open once a request is approved; ApprovedOnlyRoute decides. */}
          <Route element={<ProtectedRoute />}>
            <Route element={<ApprovedOnlyRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
                <Route path="/items" element={<ItemsPage />} />
                <Route path="/receipts" element={<ReceiptUploadPage />} />
              </Route>
            </Route>
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
