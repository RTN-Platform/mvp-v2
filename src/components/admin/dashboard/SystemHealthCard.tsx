
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

type PerformanceData = {
  name: string;
  responseTime: number;
  errorRate: number;
};

type SystemHealthProps = {
  systemHealth: {
    responseTime: number;
    errorRate: number;
    queryLatency: number;
  };
};

export const SystemHealthCard: React.FC<SystemHealthProps> = ({ systemHealth }) => {
  // Build performance chart data from system health
  const buildPerformanceData = () => {
    // Create simulated hourly data based on current system health
    const base = systemHealth;
    return [
      { name: '12am', responseTime: Math.round(base.responseTime * 0.93), errorRate: base.errorRate - 0.3 },
      { name: '4am', responseTime: Math.round(base.responseTime * 0.89), errorRate: base.errorRate - 0.5 },
      { name: '8am', responseTime: Math.round(base.responseTime * 1.04), errorRate: base.errorRate - 0.1 },
      { name: '12pm', responseTime: Math.round(base.responseTime * 1.20), errorRate: base.errorRate + 0.4 },
      { name: '4pm', responseTime: Math.round(base.responseTime * 1.13), errorRate: base.errorRate },
      { name: '8pm', responseTime: Math.round(base.responseTime * 1.03), errorRate: base.errorRate - 0.2 },
      { name: 'Now', responseTime: base.responseTime, errorRate: base.errorRate }
    ];
  };

  const performanceData = buildPerformanceData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-nature-700" />
          System Health
        </CardTitle>
        <CardDescription>System performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={performanceData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#10B981" />
            <YAxis yAxisId="right" orientation="right" stroke="#EF4444" />
            <Tooltip />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="responseTime"
              stroke="#10B981"
              fill="#D1FAE5"
              name="Response Time (ms)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="errorRate"
              stroke="#EF4444"
              fill="#FEE2E2"
              name="Error Rate (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
