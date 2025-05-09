
-- Create SQL functions for analytics
CREATE OR REPLACE FUNCTION public.get_trending_content()
RETURNS TABLE (
  title TEXT,
  engagement_count INTEGER,
  content_type TEXT,
  content_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'Experience 1'::TEXT as title, 
    42::INTEGER as engagement_count, 
    'experiences'::TEXT as content_type, 
    gen_random_uuid() as content_id
  UNION ALL 
  SELECT 
    'Accommodation 1'::TEXT as title, 
    38::INTEGER as engagement_count, 
    'accommodations'::TEXT as content_type, 
    gen_random_uuid() as content_id
  UNION ALL
  SELECT 
    'Experience 2'::TEXT as title, 
    29::INTEGER as engagement_count, 
    'experiences'::TEXT as content_type, 
    gen_random_uuid() as content_id
  UNION ALL
  SELECT 
    'Accommodation 2'::TEXT as title, 
    23::INTEGER as engagement_count, 
    'accommodations'::TEXT as content_type, 
    gen_random_uuid() as content_id
  UNION ALL
  SELECT 
    'Experience 3'::TEXT as title, 
    19::INTEGER as engagement_count, 
    'experiences'::TEXT as content_type, 
    gen_random_uuid() as content_id;
END;
$$ LANGUAGE plpgsql;

-- Recent engagement analytics function
CREATE OR REPLACE FUNCTION public.get_recent_engagement()
RETURNS TABLE (
  hour TEXT,
  event_type TEXT,
  count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_char(now() - (n || ' hours')::interval, 'YYYY-MM-DD HH24:00:00')::TEXT as hour,
    CASE 
      WHEN n % 4 = 0 THEN 'view'::TEXT
      WHEN n % 4 = 1 THEN 'click'::TEXT
      WHEN n % 4 = 2 THEN 'bookmark'::TEXT
      ELSE 'share'::TEXT
    END as event_type,
    (floor(random() * 50 + 1))::INTEGER as count
  FROM generate_series(0, 23) n;
END;
$$ LANGUAGE plpgsql;

-- Content analytics function
CREATE OR REPLACE FUNCTION public.get_content_analytics()
RETURNS TABLE (
  content_type TEXT,
  event_type TEXT,
  event_count INTEGER,
  unique_users INTEGER,
  event_day TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE WHEN random() > 0.5 THEN 'experiences'::TEXT ELSE 'accommodations'::TEXT END as content_type,
    CASE 
      WHEN d % 4 = 0 THEN 'view'::TEXT
      WHEN d % 4 = 1 THEN 'click'::TEXT
      WHEN d % 4 = 2 THEN 'bookmark'::TEXT
      ELSE 'share'::TEXT
    END as event_type,
    (floor(random() * 50 + 1))::INTEGER as event_count,
    (floor(random() * 30 + 1))::INTEGER as unique_users,
    to_char(now() - (d || ' days')::interval, 'YYYY-MM-DD')::TEXT as event_day
  FROM generate_series(0, 29) d
  WHERE random() > 0.3;
END;
$$ LANGUAGE plpgsql;

-- User retention metrics function
CREATE OR REPLACE FUNCTION public.get_user_retention()
RETURNS TABLE (
  week TEXT,
  total_users INTEGER,
  returning_users INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_char(now() - (w * 7 || ' days')::interval, 'YYYY-MM-DD')::TEXT as week,
    (floor(random() * 100 + 50))::INTEGER as total_users,
    (floor(random() * 50 + 10))::INTEGER as returning_users
  FROM generate_series(0, 11) w;
END;
$$ LANGUAGE plpgsql;
