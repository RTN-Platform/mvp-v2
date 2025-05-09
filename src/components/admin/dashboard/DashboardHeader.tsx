
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

type DashboardHeaderProps = {
  refreshing: boolean;
  onRefresh: () => void;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  refreshing,
  onRefresh
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of platform performance and metrics</p>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={refreshing}
        className="flex items-center gap-1"
      >
        {refreshing ? <Spinner size="sm" className="mr-1" /> : <RefreshCcw className="h-4 w-4 mr-1" />}
        {refreshing ? 'Refreshing...' : 'Refresh'}
      </Button>
    </div>
  );
};
