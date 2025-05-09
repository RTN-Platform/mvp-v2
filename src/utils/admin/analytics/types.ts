
export type TrendingContentItem = {
  title: string;
  engagement: number;
  type: string;
  content_id?: string;
};

export type RecentEngagementItem = {
  hour: string;
  event_type: string;
  count: number;
};

export type ContentAnalyticsItem = {
  content_type: string;
  event_type: string;
  event_count: number;
  unique_users: number;
  event_day: string;
};

export type RetentionMetrics = {
  week: string;
  total_users: number;
  returning_users: number;
  retention_rate: number;
};
