
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RoleGuard from "@/components/auth/RoleGuard";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Tribe from "./pages/Tribe";
import Experiences from "./pages/Experiences";
import ExperienceDetail from "./pages/ExperienceDetail";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";
import Favourites from "./pages/Wishlist"; // Component is still called Wishlist but route renamed
import CreateUpdate from "./pages/CreateUpdate";
import BecomeHost from "./pages/BecomeHost";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import UserProfileView from "./pages/admin/UserProfileView";
import AuditLogs from "./pages/admin/AuditLogs";
import MyListings from "./pages/MyListings";
import CreateListing from "./pages/CreateListing";
import ContentManagement from "./pages/admin/ContentManagement";
import MemberProfile from "./pages/MemberProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/experiences/:id" element={<ExperienceDetail />} />
          {/* Member profile route */}
          <Route path="/member/:memberId" element={<MemberProfile />} />
          
          {/* Routes requiring authentication (tribe, host, admin) */}
          <Route 
            path="/profile" 
            element={
              <RoleGuard allowedRoles={['tribe', 'host', 'admin']}>
                <Profile />
              </RoleGuard>
            } 
          />
          <Route 
            path="/edit-profile" 
            element={
              <RoleGuard allowedRoles={['tribe', 'host', 'admin']}>
                <EditProfile />
              </RoleGuard>
            } 
          />
          <Route 
            path="/tribe" 
            element={
              <RoleGuard allowedRoles={['tribe', 'host', 'admin']}>
                <Tribe />
              </RoleGuard>
            } 
          />
          <Route 
            path="/messages" 
            element={
              <RoleGuard allowedRoles={['tribe', 'host', 'admin']}>
                <Messages />
              </RoleGuard>
            } 
          />
          <Route 
            path="/favourites" 
            element={
              <RoleGuard allowedRoles={['tribe', 'host', 'admin']}>
                <Favourites />
              </RoleGuard>
            } 
          />
          <Route 
            path="/create-update" 
            element={
              <RoleGuard allowedRoles={['tribe', 'host', 'admin']}>
                <CreateUpdate />
              </RoleGuard>
            } 
          />
          
          {/* Host-only routes */}
          <Route 
            path="/become-host" 
            element={
              <RoleGuard allowedRoles={['tribe', 'host', 'admin']}>
                <BecomeHost />
              </RoleGuard>
            } 
          />
          <Route 
            path="/my-listings" 
            element={
              <RoleGuard allowedRoles={['host', 'admin']}>
                <MyListings />
              </RoleGuard>
            } 
          />
          <Route 
            path="/create-listing" 
            element={
              <RoleGuard allowedRoles={['host', 'admin']}>
                <CreateListing />
              </RoleGuard>
            } 
          />
          
          {/* Admin-only routes */}
          <Route 
            path="/admin" 
            element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleGuard>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <RoleGuard allowedRoles={['admin']}>
                <Dashboard />
              </RoleGuard>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <RoleGuard allowedRoles={['admin']}>
                <UserManagement />
              </RoleGuard>
            } 
          />
          <Route 
            path="/admin/users/:userId" 
            element={
              <RoleGuard allowedRoles={['admin']}>
                <UserProfileView />
              </RoleGuard>
            } 
          />
          <Route 
            path="/admin/audit-logs" 
            element={
              <RoleGuard allowedRoles={['admin']}>
                <AuditLogs />
              </RoleGuard>
            } 
          />
          <Route 
            path="/admin/content" 
            element={
              <RoleGuard allowedRoles={['admin']}>
                <ContentManagement />
              </RoleGuard>
            } 
          />
          
          {/* Redirect for notifications to messages */}
          <Route path="/notifications" element={<Navigate to="/messages" replace />} />
          
          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
