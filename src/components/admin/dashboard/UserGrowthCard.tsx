
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

type UserGrowthProps = {
  userGrowth: Array<{ date: string; count: number }>;
};

export const UserGrowthCard: React.FC<UserGrowthProps> = ({ userGrowth }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Users className="h-6 w-6 text-nature-700" />
          User Growth
        </CardTitle>
        <CardDescription>New user registrations in the last 7 days</CardDescription>
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
