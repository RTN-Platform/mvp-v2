
import React from "react";
import { Outlet } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();

  return (
    <AdminLayout>
      {/* Render child routes here */}
      <Outlet />
    </AdminLayout>
  );
};

export default AdminDashboard;
