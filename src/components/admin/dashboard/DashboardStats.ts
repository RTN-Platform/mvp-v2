
export type DashboardStats = {
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
