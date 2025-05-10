
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import Messages from "./pages/Messages";
import Wishlist from "./pages/Wishlist";
import Notifications from "./pages/Notifications";
import BecomeHost from "./pages/BecomeHost";
import Tribe from "./pages/Tribe";
import MemberProfile from "./pages/MemberProfile";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
import AccommodationDetail from "./pages/AccommodationDetail";
import ExperienceDetail from "./pages/ExperienceDetail";
import Experiences from "./pages/Experiences";
import CreateUpdate from "./pages/CreateUpdate";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import AuditLogs from "./pages/admin/AuditLogs";
import UserProfileView from "./pages/admin/UserProfileView";
import Messaging from "./pages/admin/Messaging";

// Components
import { Toaster } from "./components/ui/toaster";
import RoleGuard from "./components/auth/RoleGuard";
import StorageInit from "./components/App/StorageInit";

function App() {
  return (
    <>
      <StorageInit />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/become-host" element={<BecomeHost />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/tribe" element={<Tribe />} />
        <Route path="/member/:id" element={<MemberProfile />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/edit-listing/:type/:id" element={<EditListing />} />
        <Route path="/accommodations/:id" element={<AccommodationDetail />} />
        <Route path="/experiences/:id" element={<ExperienceDetail />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/create-update" element={<CreateUpdate />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/:id" element={<UserProfileView />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="messaging" element={<Messaging />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
