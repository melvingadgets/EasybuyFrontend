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
import { NotFoundPage } from "./pages/NotFoundPage";
import { ForbiddenPage } from "./pages/ForbiddenPage";

const App = () => {
  return (
    <Routes>
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

        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-user" element={<CreateUserPage />} />
          <Route path="/create-item" element={<CreateItemPage />} />
          <Route path="/receipt-approvals" element={<AdminReceiptApprovalsPage />} />
        </Route>

        <Route path="/users" element={<Navigate to="/404" replace />} />

        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
