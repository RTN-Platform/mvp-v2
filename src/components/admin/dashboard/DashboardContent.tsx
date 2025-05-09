
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { PlatformOverviewCard } from "./PlatformOverviewCard";
import { UserGrowthCard } from "./UserGrowthCard";
import { TopContentCard } from "./TopContentCard";
import { SystemHealthCard } from "./SystemHealthCard";
import { DashboardStats, TimePeriod } from "./DashboardStats";

type DashboardContentProps = {
  loading: boolean;
  stats: DashboardStats | null;
  timePeriod: TimePeriod;
};

export const DashboardContent: React.FC<DashboardContentProps> = ({ 
  loading, 
  stats,
  timePeriod 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-gray-500">Failed to load dashboard data. Please try refreshing.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PlatformOverviewCard 
        totalUsers={stats.totalUsers}
        newUsersThisMonth={stats.newUsersThisMonth}
        totalContent={stats.totalContent}
        uptime={stats.uptime}
      />

      <UserGrowthCard 
        userGrowth={stats.userGrowth}
        timePeriod={timePeriod}  
      />

      <TopContentCard 
        topContent={stats.topContent} 
        timePeriod={timePeriod}
      />

      <SystemHealthCard 
        systemHealth={stats.systemHealth}
        timePeriod={timePeriod}
      />
    </div>
  );
};
