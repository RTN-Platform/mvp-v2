
// This file re-exports all dashboard analytics functionality
// from individual modules for backward compatibility
import { getTrendingContent } from "./analytics/trending";
import { getRecentEngagement } from "./analytics/engagement";
import { getContentAnalytics } from "./analytics/content";
import { getRetentionMetrics } from "./analytics/retention";

export type { 
  TrendingContentItem, 
  RecentEngagementItem,
  ContentAnalyticsItem,
  RetentionMetrics
} from "./analytics/types";

export {
  getTrendingContent,
  getRecentEngagement,
  getContentAnalytics,
  getRetentionMetrics
};
