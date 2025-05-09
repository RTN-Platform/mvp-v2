
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Users, FileText, Settings, RefreshCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  ResponsiveContainer,
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from "recharts";
import { Spinner } from "@/components/ui/spinner";

type DashboardStats = {
  totalUsers: number;
  newUsersThisMonth: number;
  totalContent: number;
  uptime: number;
  userGrowth: Array<{ date: string; count: number }>;
  topContent: Array<{ title: string; engagement: number; type: string }>;
  systemHealth: {
    responseTime: number;
    errorRate: number;
    queryLatency: number;
  };
}

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setRefreshing(true);
      
      // Fetch total users
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) throw usersError;
      
      // Fetch new users this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count: newUsersThisMonth, error: newUsersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());
      
      if (newUsersError) throw newUsersError;
      
      // Fetch total content (experiences + accommodations)
      const { count: experiencesCount, error: experiencesError } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true });
        
      if (experiencesError) throw experiencesError;
      
      const { count: accommodationsCount, error: accommodationsError } = await supabase
        .from('accommodations')
        .select('*', { count: 'exact', head: true });
        
      if (accommodationsError) throw accommodationsError;
      
      const totalContent = (experiencesCount || 0) + (accommodationsCount || 0);
      
      // Simulate uptime calculation (in real app, would fetch from monitoring service)
      const uptime = 99.8;
      
      // Fetch user growth data - last 7 days
      const userGrowth = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString());
          
        if (error) throw error;
        
        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
        userGrowth.push({ date: dayLabel, count: count || 0 });
      }
      
      // Fetch top content by engagement (using audit logs as a proxy for engagement)
      const { data: contentData, error: contentError } = await supabase
        .from('audit_logs')
        .select('entity_id, entity_type, count')
        .eq('action', 'view')
        .or('entity_type.eq.experiences,entity_type.eq.accommodations')
        .group('entity_id, entity_type');
      
      // Transform content data - in a real app you'd join with the actual content tables
      const topContent = contentData?.slice(0, 5).map((item, index) => ({
        title: `${item.entity_type === 'experiences' ? 'Experience' : 'Accommodation'} ${index + 1}`,
        engagement: item.count,
        type: item.entity_type
      })) || [];
      
      // System health metrics - in a real app these would come from monitoring tools
      const systemHealth = {
        responseTime: 156, // ms
        errorRate: 0.8, // %
        queryLatency: 42, // ms
      };
      
      // Update state with all fetched data
      setStats({
        totalUsers: totalUsers || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        totalContent,
        uptime,
        userGrowth,
        topContent,
        systemHealth
      });
      
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      toast.error('Failed to load dashboard statistics');
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchDashboardStats();
  };

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  // Performance chart data
  const performanceData = [
    { name: '12am', responseTime: 145, errorRate: 0.5 },
    { name: '4am', responseTime: 139, errorRate: 0.3 },
    { name: '8am', responseTime: 162, errorRate: 0.7 },
    { name: '12pm', responseTime: 187, errorRate: 1.2 },
    { name: '4pm', responseTime: 176, errorRate: 0.8 },
    { name: '8pm', responseTime: 156, errorRate: 0.6 },
    { name: 'Now', responseTime: 156, errorRate: 0.8 }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of platform performance and metrics</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            {refreshing ? <Spinner size="sm" className="mr-1" /> : <RefreshCcw className="h-4 w-4 mr-1" />}
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <Spinner size="lg" />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="text-2xl font-bold text-nature-700">{formatNumber(stats.totalUsers)}</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                  <div className="bg-nature-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-nature-700">{formatNumber(stats.newUsersThisMonth)}</div>
                    <div className="text-sm text-gray-600">New This Month</div>
                  </div>
                  <div className="bg-nature-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-nature-700">{formatNumber(stats.totalContent)}</div>
                    <div className="text-sm text-gray-600">Total Listings</div>
                  </div>
                  <div className="bg-nature-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-nature-700">{stats.uptime.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                    data={stats.userGrowth}
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-nature-700" />
                  Top Content
                </CardTitle>
                <CardDescription>Most engaged listings</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                {stats.topContent.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.topContent}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="title" 
                        tick={{ fontSize: 12 }}
                        width={100}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="engagement" 
                        fill="#10B981" 
                        name="Engagement" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No content engagement data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

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
          </div>
        ) : (
          <div className="flex justify-center items-center h-[50vh]">
            <p className="text-gray-500">Failed to load dashboard data. Please try refreshing.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
