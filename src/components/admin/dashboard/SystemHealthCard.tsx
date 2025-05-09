
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TimePeriod } from "./DashboardStats";

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
  timePeriod: TimePeriod;
};

export const SystemHealthCard: React.FC<SystemHealthProps> = ({ systemHealth, timePeriod }) => {
  // Build performance chart data from system health
  const buildPerformanceData = () => {
    // Create simulated hourly data based on current system health
    const base = systemHealth;
    
    // Adjust number of data points based on time period
    const dataPoints = timePeriod === 'today' ? 24 : 
                      timePeriod === 'week' ? 7 : 
                      timePeriod === 'month' ? 10 : 6;
    
    const result: PerformanceData[] = [];
    
    if (timePeriod === 'today') {
      // Hourly data points for today
      for (let i = 0; i < dataPoints; i++) {
        const hour = i === dataPoints - 1 ? 'Now' : `${i * (24 / dataPoints)}:00`;
        const varianceFactor = 0.9 + Math.random() * 0.3; // Random variance between 0.9 and 1.2
        result.push({
          name: hour,
          responseTime: Math.round(base.responseTime * varianceFactor),
          errorRate: Math.max(0, base.errorRate + (Math.random() - 0.5))
        });
      }
    } else {
      // Data points for other time periods
      const labels = timePeriod === 'week' ? 
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
        timePeriod === 'month' ? 
          ['Week 1', 'Week 2', 'Week 3', 'Week 4'] : 
          ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
          
      for (let i = 0; i < Math.min(dataPoints, labels.length); i++) {
        const varianceFactor = 0.9 + Math.random() * 0.3;
        result.push({
          name: labels[i],
          responseTime: Math.round(base.responseTime * varianceFactor),
          errorRate: Math.max(0, base.errorRate + (Math.random() - 0.5))
        });
      }
      
      // Add the current values
      result.push({
        name: 'Now',
        responseTime: base.responseTime,
        errorRate: base.errorRate
      });
    }
    
    return result;
  };

  const performanceData = buildPerformanceData();
  
  const getTimeDescription = () => {
    switch (timePeriod) {
      case 'today': return 'today (hourly)';
      case 'week': return 'this week';
      case 'month': return 'this month';
      case 'quarter': return 'this quarter';
      case 'year': return 'this year';
      case 'all': return 'all time';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-nature-700" />
          System Health
        </CardTitle>
        <CardDescription>System performance metrics {getTimeDescription()}</CardDescription>
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
