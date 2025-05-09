
export type TimePeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all';

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

export const timePeriodToInterval = (period: TimePeriod): string => {
  switch (period) {
    case 'today':
      return '1 day';
    case 'week':
      return '7 days';
    case 'month':
      return '30 days';
    case 'quarter':
      return '90 days';
    case 'year':
      return '365 days';
    case 'all':
    default:
      return '1000 days'; // Effectively "all" data
  }
};

export const timePeriodToDataPoints = (period: TimePeriod): number => {
  switch (period) {
    case 'today':
      return 24; // Hourly for today
    case 'week':
      return 7; // Daily for week
    case 'month':
      return 30; // Daily for month
    case 'quarter':
      return 12; // Weekly for quarter
    case 'year':
      return 12; // Monthly for year
    case 'all':
    default:
      return 12; // Monthly for all time
  }
};

export const formatDateByTimePeriod = (date: Date, period: TimePeriod): string => {
  if (period === 'today') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (period === 'week') {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else if (period === 'month') {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  } else {
    return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
  }
};
