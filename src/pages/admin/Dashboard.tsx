
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/admin/dashboard/DashboardContent";
import { useDashboardData } from "@/components/admin/dashboard/useDashboardData";

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { loading, stats, refreshing, fetchDashboardStats } = useDashboardData();

  return (
    <MainLayout>
      <div className="space-y-6">
        <DashboardHeader 
          refreshing={refreshing} 
          onRefresh={fetchDashboardStats} 
        />
        
        <DashboardContent 
          loading={loading} 
          stats={stats} 
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
