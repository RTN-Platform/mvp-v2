
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { TimePeriod } from "./DashboardStats";

type UserGrowthProps = {
  userGrowth: Array<{ date: string; count: number }>;
  timePeriod: TimePeriod;
};

export const UserGrowthCard: React.FC<UserGrowthProps> = ({ userGrowth, timePeriod }) => {
  const getTimeDescription = () => {
    switch (timePeriod) {
      case 'today': return 'today (hourly)';
      case 'week': return 'in the last 7 days';
      case 'month': return 'in the last 30 days';
      case 'quarter': return 'in the last 90 days';
      case 'year': return 'in the last year';
      case 'all': return 'all time';
      default: return 'recent';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Users className="h-6 w-6 text-nature-700" />
          User Growth
        </CardTitle>
        <CardDescription>New user registrations {getTimeDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={userGrowth}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#10B981" 
              fill="#D1FAE5" 
              name="New Users" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
