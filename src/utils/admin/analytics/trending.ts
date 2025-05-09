
import { supabase } from "@/integrations/supabase/client";
import { TrendingContentItem } from "./types";

export async function getTrendingContent(timeRange: string = '7 days'): Promise<TrendingContentItem[] | null> {
  try {
    // Call the RPC function directly instead of using the view
    const { data, error } = await supabase
      .rpc('get_trending_content', { time_range: timeRange });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      // Fallback for empty data
      return generateFallbackTrendingContent();
    }
    
    return data.map(item => ({
      title: item.title || `${item.content_type} ${item.content_id?.substring(0, 6)}`,
      engagement: item.engagement_count,
      type: item.content_type,
      content_id: item.content_id
    }));
  } catch (error) {
    console.warn('Could not fetch trending content:', error);
    return generateFallbackTrendingContent();
  }
}

function generateFallbackTrendingContent(): TrendingContentItem[] {
  return [
    { title: "Experience 1", engagement: 42, type: "experiences" },
    { title: "Accommodation 1", engagement: 38, type: "accommodations" },
    { title: "Experience 2", engagement: 29, type: "experiences" },
    { title: "Accommodation 2", engagement: 23, type: "accommodations" },
    { title: "Experience 3", engagement: 19, type: "experiences" }
  ];
}
