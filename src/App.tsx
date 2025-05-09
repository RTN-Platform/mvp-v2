
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import RoleGuard from "@/components/auth/RoleGuard";

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import MemberProfile from "@/pages/MemberProfile";
import EditProfile from "@/pages/EditProfile";
import Tribe from "@/pages/Tribe";
import ResetPassword from "@/pages/ResetPassword";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "@/pages/NotFound";
import Messages from "@/pages/Messages";
import Notifications from "@/pages/Notifications";
import BecomeHost from "@/pages/BecomeHost";
import CreateUpdate from "@/pages/CreateUpdate";
import Wishlist from "@/pages/Wishlist";
import MyListings from "@/pages/MyListings";
import CreateListing from "@/pages/CreateListing";
import EditListing from "@/pages/EditListing";
import Experiences from "@/pages/Experiences";
import ExperienceDetail from "@/pages/ExperienceDetail";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/member/:id" element={<MemberProfile />} />
            <Route path="/tribe" element={<Tribe />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/create-update" element={<CreateUpdate />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/experiences/:id" element={<ExperienceDetail />} />
            
            {/* Host routes */}
            <Route 
              path="/become-host" 
              element={<BecomeHost />} 
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
            <Route 
              path="/edit-listing/:type/:id" 
              element={
                <RoleGuard allowedRoles={['host', 'admin']}>
                  <EditListing />
                </RoleGuard>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin/*" 
              element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleGuard>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
