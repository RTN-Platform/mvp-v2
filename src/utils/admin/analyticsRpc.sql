
-- These functions should be run in the Supabase SQL Editor to support the analytics dashboard

-- Function to get trending content over a specific time range
CREATE OR REPLACE FUNCTION public.get_trending_content(time_range text DEFAULT '7 days')
RETURNS TABLE(
  content_id text,
  content_type text,
  title text,
  engagement_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.content_id::text,
    e.content_type,
    CASE 
      WHEN e.content_type = 'experiences' THEN (SELECT title FROM public.experiences WHERE id = e.content_id::uuid)
      WHEN e.content_type = 'accommodations' THEN (SELECT title FROM public.accommodations WHERE id = e.content_id::uuid)
      ELSE 'Unknown'
    END AS title,
    COUNT(*)::bigint AS engagement_count
  FROM 
    analytics.content_engagement_events e
  WHERE 
    e.created_at > now() - time_range::interval
  GROUP BY 
    e.content_id, e.content_type
  ORDER BY 
    COUNT(*) DESC
  LIMIT 10;
END;
$$;

-- Function to get recent engagement by hour over a specific time range
CREATE OR REPLACE FUNCTION public.get_recent_engagement(time_range text DEFAULT '24 hours')
RETURNS TABLE(
  hour timestamp with time zone,
  event_type text,
  count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    date_trunc('hour', e.created_at) AS hour,
    e.event_type,
    COUNT(*)::bigint AS count
  FROM 
    analytics.content_engagement_events e
  WHERE 
    e.created_at > now() - time_range::interval
  GROUP BY 
    date_trunc('hour', e.created_at), e.event_type
  ORDER BY 
    date_trunc('hour', e.created_at) DESC;
END;
$$;

-- Function to get content analytics by type over a specific time range
CREATE OR REPLACE FUNCTION public.get_content_analytics(time_range text DEFAULT '30 days')
RETURNS TABLE(
  content_type text,
  event_type text,
  event_count bigint,
  unique_users bigint,
  event_day timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.content_type,
    e.event_type,
    COUNT(*)::bigint AS event_count,
    COUNT(DISTINCT e.user_id)::bigint AS unique_users,
    date_trunc('day', e.created_at) AS event_day
  FROM 
    analytics.content_engagement_events e
  WHERE 
    e.created_at > now() - time_range::interval
  GROUP BY 
    e.content_type, e.event_type, date_trunc('day', e.created_at)
  ORDER BY 
    date_trunc('day', e.created_at) DESC, COUNT(*) DESC;
END;
$$;

-- Function to get user retention metrics
CREATE OR REPLACE FUNCTION public.get_retention_metrics(time_range text DEFAULT '90 days')
RETURNS TABLE(
  week timestamp with time zone,
  total_users bigint,
  returning_users bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    date_trunc('week', pv1.created_at) AS week,
    COUNT(DISTINCT pv1.user_id)::bigint AS total_users,
    COUNT(DISTINCT pv2.user_id)::bigint AS returning_users
  FROM 
    analytics.page_views pv1
  LEFT JOIN 
    analytics.page_views pv2 ON pv1.user_id = pv2.user_id 
    AND pv2.created_at > pv1.created_at + interval '7 days'
    AND pv2.created_at < pv1.created_at + interval '14 days'
  WHERE 
    pv1.created_at > now() - time_range::interval
  GROUP BY 
    date_trunc('week', pv1.created_at)
  ORDER BY 
    date_trunc('week', pv1.created_at) DESC;
END;
$$;
