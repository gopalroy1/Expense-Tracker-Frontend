import { Route, Routes } from "react-router-dom";
import AccountManager from "../pages/AccountManger";
import { DashboardPage } from "../pages/DashboardPage";
import Home from "../pages/Home";
import { AppLayout } from "../pages/Layout/AppLayout";
import LoginPage from "../pages/login";
import { Networth } from "../pages/netWorthPage/Networth";
import { SignupPage } from "../pages/signup";
import ProtectedRoute from "./ProtectedRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />      {/* Default homepage */}
      <Route path="/home" element={<Home />} />  {/* Also homepage */}

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/test" element={<h1>Test Route ✅</h1>} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="networth" element={<Networth />} />
          <Route path="accountmanagement" element={<AccountManager />} />
        </Route>
      </Route>
    </Routes>
  );
}
