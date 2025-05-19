
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TimePeriod } from "./DashboardStats";

type DashboardHeaderProps = {
  refreshing: boolean;
  onRefresh: () => void;
  timePeriod: TimePeriod;
  onTimePeriodChange: (value: TimePeriod) => void;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  refreshing,
  onRefresh,
  timePeriod,
  onTimePeriodChange
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Dashboard Overview</h1>
        <p className="text-sm text-gray-600">Platform performance and metrics</p>
      </div>
      <div className="flex items-center gap-3">
        <Select 
          value={timePeriod} 
          onValueChange={(value) => onTimePeriodChange(value as TimePeriod)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time Range</SelectLabel>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        
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
    </div>
  );
};
