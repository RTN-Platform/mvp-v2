
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/admin/dashboard/DashboardContent";
import { ContentAnalyticsCard } from "@/components/admin/dashboard/ContentAnalyticsCard";
import { useDashboardData } from "@/components/admin/dashboard/useDashboardData";
import { TimePeriod } from "@/components/admin/dashboard/DashboardStats";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminLayout from "@/components/layout/AdminLayout";

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
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handleTimePeriodChange = (value: TimePeriod) => {
    setTimePeriod(value);
    // Dashboard data will automatically refresh via useEffect in useDashboardData
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DashboardHeader 
          refreshing={refreshing} 
          onRefresh={() => fetchDashboardStats(timePeriod)} 
          timePeriod={timePeriod}
          onTimePeriodChange={handleTimePeriodChange}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content-analytics">Content Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-0">
            <DashboardContent 
              loading={loading} 
              stats={stats}
              timePeriod={timePeriod}
            />
          </TabsContent>
          
          <TabsContent value="content-analytics" className="space-y-0">
            {loading ? (
              <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin w-8 h-8 border-4 border-nature-600 border-t-transparent rounded-full"></div>
              </div>
            ) : stats ? (
              <ContentAnalyticsCard 
                analyticsData={stats.contentAnalytics} 
                retentionData={stats.retentionMetrics}
                timePeriod={timePeriod}
              />
            ) : (
              <div className="flex justify-center items-center h-[50vh]">
                <p className="text-gray-500">Failed to load analytics data. Please try refreshing.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
