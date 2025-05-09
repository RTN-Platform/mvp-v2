
// Export all analytics functionality from a single entry point
export type { 
  TrendingContentItem, 
  RecentEngagementItem,
  ContentAnalyticsItem,
  RetentionMetrics
} from "./types";

export { getTrendingContent } from "./trending";
export { getRecentEngagement } from "./engagement";
export { getContentAnalytics } from "./content";
export { getRetentionMetrics } from "./retention";
