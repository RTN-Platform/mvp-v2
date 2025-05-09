
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { FileText, Users, Activity } from "lucide-react";
import { TimePeriod } from "./DashboardStats";
import { ContentAnalyticsItem, RetentionMetrics } from "@/utils/admin/dashboardRpc";

type ContentAnalyticsProps = {
  analyticsData: ContentAnalyticsItem[] | null;
  retentionData: RetentionMetrics[] | null;
  timePeriod: TimePeriod;
};

export const ContentAnalyticsCard: React.FC<ContentAnalyticsProps> = ({ 
  analyticsData, 
  retentionData,
  timePeriod 
}) => {
  const [activeTab, setActiveTab] = useState<string>("engagement");
  
  // Process the analytics data for the engagement chart
  const prepareEngagementData = () => {
    if (!analyticsData || analyticsData.length === 0) return [];

    // Group by day and event type
    const groupedByDay: Record<string, Record<string, number>> = {};
    
    analyticsData.forEach(item => {
      const day = new Date(item.event_day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      
      if (!groupedByDay[day]) {
        groupedByDay[day] = {};
      }
      
      if (!groupedByDay[day][item.event_type]) {
        groupedByDay[day][item.event_type] = 0;
      }
      
      groupedByDay[day][item.event_type] += item.event_count;
    });
    
    // Convert to array format for chart
    return Object.entries(groupedByDay).map(([date, events]) => ({
      date,
      ...events
    })).slice(0, 7); // Last 7 days
  };
  
  // Process the analytics data for the content type chart
  const prepareContentTypeData = () => {
    if (!analyticsData || analyticsData.length === 0) return [];
    
    const typeMap: Record<string, number> = {};
    
    analyticsData.forEach(item => {
      if (!typeMap[item.content_type]) {
        typeMap[item.content_type] = 0;
      }
      typeMap[item.content_type] += item.event_count;
    });
    
    return Object.entries(typeMap).map(([type, count]) => ({
      type: type === "experiences" ? "Experiences" : "Accommodations",
      count
    }));
  };

  // Prepare the engagement chart data
  const engagementData = prepareEngagementData();
  
  // Prepare the content type distribution data
  const contentTypeData = prepareContentTypeData();
  
  const getTimeDescription = () => {
    switch (timePeriod) {
      case 'today': return 'today';
      case 'week': return 'this week';
      case 'month': return 'this month';
      case 'quarter': return 'this quarter';
      case 'year': return 'this year';
      case 'all': return 'all time';
      default: return '';
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-nature-700" />
          Content Analytics
        </CardTitle>
        <CardDescription>Detailed engagement metrics for content {getTimeDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="distribution">Content Type</TabsTrigger>
            <TabsTrigger value="retention">User Retention</TabsTrigger>
          </TabsList>
          
          <TabsContent value="engagement" className="space-y-4">
            <div className="h-80">
              {engagementData.length > 0 ? (
                <ChartContainer
                  config={{
                    view: { label: "View" },
                    click: { label: "Click" },
                    bookmark: { label: "Bookmark" },
                    share: { label: "Share" }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={engagementData}
                      stackOffset="expand"
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="view" stackId="a" fill="#10B981" name="View" />
                      <Bar dataKey="click" stackId="a" fill="#3B82F6" name="Click" />
                      <Bar dataKey="bookmark" stackId="a" fill="#8B5CF6" name="Bookmark" />
                      <Bar dataKey="share" stackId="a" fill="#F59E0B" name="Share" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No engagement data available</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-xl font-bold text-green-700">
                  {analyticsData?.filter(i => i.event_type === 'view').reduce((sum, item) => sum + item.event_count, 0) || 0}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Activity className="h-4 w-4" /> Total Views
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-xl font-bold text-blue-700">
                  {analyticsData?.filter(i => i.event_type === 'click').reduce((sum, item) => sum + item.event_count, 0) || 0}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Activity className="h-4 w-4" /> Total Clicks
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-xl font-bold text-purple-700">
                  {analyticsData?.filter(i => i.event_type === 'bookmark').reduce((sum, item) => sum + item.event_count, 0) || 0}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Activity className="h-4 w-4" /> Total Bookmarks
                </div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-xl font-bold text-amber-700">
                  {analyticsData?.filter(i => i.event_type === 'share').reduce((sum, item) => sum + item.event_count, 0) || 0}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Activity className="h-4 w-4" /> Total Shares
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution" className="space-y-4">
            <div className="h-80">
              {contentTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={contentTypeData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10B981" name="Engagement Count" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No content type data available</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-nature-50 p-4 rounded-lg">
                <div className="text-xl font-bold text-nature-700">
                  {analyticsData?.filter(i => i.content_type === 'experiences').reduce((sum, item) => sum + item.event_count, 0) || 0}
                </div>
                <div className="text-sm text-gray-600">Total Experiences Engagement</div>
              </div>
              <div className="bg-nature-50 p-4 rounded-lg">
                <div className="text-xl font-bold text-nature-700">
                  {analyticsData?.filter(i => i.content_type === 'accommodations').reduce((sum, item) => sum + item.event_count, 0) || 0}
                </div>
                <div className="text-sm text-gray-600">Total Accommodations Engagement</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="retention" className="space-y-4">
            <div className="h-80">
              {retentionData && retentionData.length > 0 ? (
                <ChartContainer
                  config={{
                    total_users: { label: "Total Users" },
                    returning_users: { label: "Returning Users" },
                    retention_rate: { label: "Retention Rate" }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={retentionData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="total_users" stroke="#3B82F6" name="Total Users" />
                      <Line yAxisId="left" type="monotone" dataKey="returning_users" stroke="#10B981" name="Returning Users" />
                      <Line yAxisId="right" type="monotone" dataKey="retention_rate" stroke="#F59E0B" name="Retention Rate %" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No retention data available</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-xl font-bold text-blue-700">
                  {retentionData?.reduce((sum, item) => sum + item.total_users, 0) || 0}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Users className="h-4 w-4" /> Total Users
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-xl font-bold text-green-700">
                  {retentionData?.reduce((sum, item) => sum + item.returning_users, 0) || 0}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Users className="h-4 w-4" /> Returning Users
                </div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-xl font-bold text-amber-700">
                  {retentionData && retentionData.length > 0 
                    ? Math.round(retentionData.reduce((sum, item) => sum + item.retention_rate, 0) / retentionData.length) 
                    : 0}%
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Activity className="h-4 w-4" /> Avg. Retention Rate
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
