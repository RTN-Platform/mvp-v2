
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

type PlatformOverviewProps = {
  totalUsers: number;
  newUsersThisMonth: number;
  totalContent: number;
  uptime: number;
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};

export const PlatformOverviewCard: React.FC<PlatformOverviewProps> = ({
  totalUsers,
  newUsersThisMonth,
  totalContent,
  uptime,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-nature-700" />
          Platform Overview
        </CardTitle>
        <CardDescription>Key metrics and platform status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-nature-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-nature-700">{formatNumber(totalUsers)}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="bg-nature-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-nature-700">{formatNumber(newUsersThisMonth)}</div>
            <div className="text-sm text-gray-600">New This Month</div>
          </div>
          <div className="bg-nature-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-nature-700">{formatNumber(totalContent)}</div>
            <div className="text-sm text-gray-600">Total Listings</div>
          </div>
          <div className="bg-nature-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-nature-700">{uptime.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
