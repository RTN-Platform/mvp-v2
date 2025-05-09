
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/admin/dashboard/DashboardContent";
import { useDashboardData } from "@/components/admin/dashboard/useDashboardData";
import { TimePeriod } from "@/components/admin/dashboard/DashboardStats";

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { 
    loading, 
    stats, 
    refreshing, 
    fetchDashboardStats, 
    timePeriod, 
    setTimePeriod 
  } = useDashboardData();

  const handleTimePeriodChange = (value: TimePeriod) => {
    setTimePeriod(value);
    // Dashboard data will automatically refresh via useEffect in useDashboardData
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <DashboardHeader 
          refreshing={refreshing} 
          onRefresh={() => fetchDashboardStats(timePeriod)} 
          timePeriod={timePeriod}
          onTimePeriodChange={handleTimePeriodChange}
        />
        
        <DashboardContent 
          loading={loading} 
          stats={stats}
          timePeriod={timePeriod}
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
