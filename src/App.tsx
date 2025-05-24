
import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import AdminLayout from "@/components/layout/AdminLayout";
import StorageInit from "@/components/App/StorageInit";
import { Toaster } from "@/components/ui/toaster";

// Import all pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/Profile";
import EditProfile from "@/pages/EditProfile";
import MemberProfile from "@/pages/MemberProfile";
import Tribe from "@/pages/Tribe";
import Messages from "@/pages/Messages";
import Wishlist from "@/pages/Wishlist";
import Notifications from "@/pages/Notifications";
import Experiences from "@/pages/Experiences";
import ExperienceDetail from "@/pages/ExperienceDetail";
import AccommodationDetail from "@/pages/AccommodationDetail";
import BecomeHost from "@/pages/BecomeHost";
import CreateListing from "@/pages/CreateListing";
import EditListing from "@/pages/EditListing";
import MyListings from "@/pages/MyListings";
import CreateUpdate from "@/pages/CreateUpdate";
import NotFound from "@/pages/NotFound";

// Import admin pages
import Dashboard from "@/pages/admin/Dashboard";
import UserManagement from "@/pages/admin/UserManagement";
import UserProfileView from "@/pages/admin/UserProfileView";
import ContentManagement from "@/pages/admin/ContentManagement";
import AuditLogs from "@/pages/admin/AuditLogs";
import Messaging from "@/pages/admin/Messaging";

function App() {
  return (
    <>
      <StorageInit />
      <Routes>
        {/* Main app routes with MainLayout */}
        <Route path="/" element={<MainLayout><Index /></MainLayout>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<MainLayout requireAuth><Profile /></MainLayout>} />
        <Route path="/edit-profile" element={<MainLayout requireAuth><EditProfile /></MainLayout>} />
        <Route path="/member/:id" element={<MainLayout><MemberProfile /></MainLayout>} />
        <Route path="/tribe" element={<MainLayout requireAuth><Tribe /></MainLayout>} />
        <Route path="/messages" element={<MainLayout requireAuth><Messages /></MainLayout>} />
        <Route path="/wishlist" element={<MainLayout requireAuth><Wishlist /></MainLayout>} />
        <Route path="/notifications" element={<MainLayout requireAuth><Notifications /></MainLayout>} />
        <Route path="/experiences" element={<MainLayout><Experiences /></MainLayout>} />
        <Route path="/experience/:id" element={<MainLayout><ExperienceDetail /></MainLayout>} />
        <Route path="/accommodation/:id" element={<MainLayout><AccommodationDetail /></MainLayout>} />
        <Route path="/become-host" element={<MainLayout requireAuth><BecomeHost /></MainLayout>} />
        <Route path="/create-listing" element={<MainLayout requireAuth allowedRoles={["host", "admin"]}><CreateListing /></MainLayout>} />
        <Route path="/edit-listing/:id" element={<MainLayout requireAuth allowedRoles={["host", "admin"]}><EditListing /></MainLayout>} />
        <Route path="/my-listings" element={<MainLayout requireAuth allowedRoles={["host", "admin"]}><MyListings /></MainLayout>} />
        <Route path="/create-update" element={<MainLayout requireAuth><CreateUpdate /></MainLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <RoleGuard allowedRoles={["admin"]}>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/users/:id" element={<UserProfileView />} />
                <Route path="/content" element={<ContentManagement />} />
                <Route path="/audit-logs" element={<AuditLogs />} />
                <Route path="/messaging" element={<Messaging />} />
              </Routes>
            </AdminLayout>
          </RoleGuard>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
