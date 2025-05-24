
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <>
      <StorageInit />
      <Routes>
        {/* Main app routes with MainLayout */}
        <Route path="/" element={<MainLayout><Index /></MainLayout>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/edit-profile" element={<MainLayout><EditProfile /></MainLayout>} />
        <Route path="/messages" element={<MainLayout><Messages /></MainLayout>} />
        <Route path="/wishlist" element={<MainLayout><Wishlist /></MainLayout>} />
        <Route path="/favorites" element={<MainLayout><Wishlist /></MainLayout>} />
        <Route path="/favourites" element={<MainLayout><Wishlist /></MainLayout>} />
        <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
        <Route path="/become-host" element={<MainLayout><BecomeHost /></MainLayout>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/tribe" element={<MainLayout><Tribe /></MainLayout>} />
        <Route path="/member/:id" element={<MainLayout><MemberProfile /></MainLayout>} />
        <Route path="/create-listing" element={<MainLayout><CreateListing /></MainLayout>} />
        <Route path="/my-listings" element={<MainLayout><MyListings /></MainLayout>} />
        <Route path="/edit-listing/:type/:id" element={<MainLayout><EditListing /></MainLayout>} />
        <Route path="/accommodations/:id" element={<MainLayout><AccommodationDetail /></MainLayout>} />
        <Route path="/experiences/:id" element={<MainLayout><ExperienceDetail /></MainLayout>} />
        <Route path="/experiences" element={<MainLayout><Experiences /></MainLayout>} />
        <Route path="/create-update" element={<MainLayout><CreateUpdate /></MainLayout>} />

        {/* Admin Routes - WITHOUT MainLayout wrapper */}
        <Route 
          path="/admin" 
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <Dashboard />
            </RoleGuard>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <Dashboard />
            </RoleGuard>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <UserManagement />
            </RoleGuard>
          } 
        />
        <Route 
          path="/admin/users/:id" 
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <UserProfileView />
            </RoleGuard>
          } 
        />
        <Route 
          path="/admin/content" 
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <ContentManagement />
            </RoleGuard>
          } 
        />
        <Route 
          path="/admin/audit-logs" 
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <AuditLogs />
            </RoleGuard>
          } 
        />
        <Route 
          path="/admin/messaging" 
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <Messaging />
            </RoleGuard>
          } 
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
