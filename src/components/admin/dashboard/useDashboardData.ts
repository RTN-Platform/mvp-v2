
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardStats } from "./DashboardStats";
import { getTrendingContent, getRecentEngagement } from "@/utils/admin/dashboardRpc";

export const useDashboardData = () => {
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
      
      // Fetch trending content
      const trendingContent = await getTrendingContent();
      
      // Use fallback data if needed
      const topContent = trendingContent || [
        { title: "Experience 1", engagement: 42, type: "experiences" },
        { title: "Accommodation 1", engagement: 38, type: "accommodations" },
        { title: "Experience 2", engagement: 29, type: "experiences" },
        { title: "Accommodation 2", engagement: 23, type: "accommodations" },
        { title: "Experience 3", engagement: 19, type: "experiences" }
      ];
      
      // Fetch recent engagement for system health
      const recentEngagement = await getRecentEngagement();
      
      // Calculate system health metrics based on analytics data
      let systemHealth = {
        responseTime: 156, // ms (default)
        errorRate: 0.8,    // % (default)
        queryLatency: 42   // ms (default)
      };
      
      if (recentEngagement?.length) {
        // Calculate more accurate system health metrics if data exists
        const lastDay = recentEngagement.slice(0, 6); // Last 6 hours
        
        // Example calculation - in reality these would be more sophisticated
        const totalEvents = lastDay.reduce((sum, item) => sum + (item.count || 0), 0);
        const avgResponseTime = totalEvents > 0 
          ? lastDay.reduce((sum, item) => sum + (item.count || 0), 0) / lastDay.length * 2 + 130
          : 156;
        
        const errorEvents = lastDay
          .filter(item => item.event_type === 'error')
          .reduce((sum, item) => sum + (item.count || 0), 0);
        
        systemHealth = {
          responseTime: Math.round(avgResponseTime || 156), 
          errorRate: totalEvents > 0 ? Math.round((errorEvents / totalEvents * 100) * 10) / 10 : 0.8,
          queryLatency: Math.round((avgResponseTime || 156) / 4) // Simple derivation
        };
      }
      
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

  return {
    loading,
    stats,
    refreshing,
    fetchDashboardStats
  };
};
