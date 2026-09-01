-- Normalize inconsistent city values across all tables (dev data cleanup).
-- Canonical names match lib/cityUtils.ts display labels (Title Case).

CREATE OR REPLACE FUNCTION public.normalize_city_value(raw text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN raw IS NULL OR btrim(raw) = '' THEN NULL
    WHEN lower(btrim(raw)) IN (
      'amritsar', 'asr', '1001', 'new amritsar',
      'asr1', 'asr12', '12asr', 'abcasr'
    ) THEN 'Amritsar'
    WHEN lower(btrim(raw)) IN ('ludhiana') THEN 'Ludhiana'
    WHEN lower(btrim(raw)) IN ('chandigarh') THEN 'Chandigarh'
    WHEN lower(btrim(raw)) IN ('mumbai', 'bombay', 'bom') THEN 'Mumbai'
    WHEN lower(btrim(raw)) IN ('delhi', 'new delhi') THEN 'Delhi'
    WHEN lower(btrim(raw)) IN ('bangalore', 'bengaluru', 'blr') THEN 'Bangalore'
    WHEN lower(btrim(raw)) IN ('pune') THEN 'Pune'
    WHEN lower(btrim(raw)) IN ('batala') THEN 'Batala'
    WHEN lower(btrim(raw)) IN ('bathinda') THEN 'Bathinda'
    WHEN lower(btrim(raw)) IN ('ambala') THEN 'Ambala'
    WHEN lower(btrim(raw)) IN ('pathankot') THEN 'Pathankot'
    WHEN lower(btrim(raw)) IN ('barnala') THEN 'Barnala'
    WHEN lower(btrim(raw)) IN ('gurdaspur') THEN 'Gurdaspur'
    WHEN lower(btrim(raw)) IN ('goa') THEN 'Goa'
    WHEN lower(btrim(raw)) IN ('jaipur') THEN 'Jaipur'
    WHEN lower(btrim(raw)) IN (
      'unknown', 'europe', 'armenia', 'cpu', 'mouse',
      'dsfgsdzv', 'abc', '1222', 'as', 'jamu'
    ) THEN NULL
    ELSE initcap(lower(btrim(raw)))
  END;
$$;

-- events, venues, users, enterprise_requests, zbp tables
UPDATE public.events
SET city = public.normalize_city_value(city)
WHERE city IS DISTINCT FROM public.normalize_city_value(city);

UPDATE public.venues
SET city = public.normalize_city_value(city)
WHERE city IS DISTINCT FROM public.normalize_city_value(city);

UPDATE public.users
SET city = public.normalize_city_value(city)
WHERE city IS DISTINCT FROM public.normalize_city_value(city);

UPDATE public.enterprise_requests
SET city = public.normalize_city_value(city)
WHERE city IS DISTINCT FROM public.normalize_city_value(city);

UPDATE public.zbp_applications
SET city = public.normalize_city_value(city)
WHERE city IS DISTINCT FROM public.normalize_city_value(city);

UPDATE public.zbp_partners
SET city = public.normalize_city_value(city)
WHERE city IS DISTINCT FROM public.normalize_city_value(city);

UPDATE public.zbp_profiles
SET city = public.normalize_city_value(city)
WHERE city IS DISTINCT FROM public.normalize_city_value(city);

UPDATE public.approved_venues
SET city = public.normalize_city_value(city)
WHERE city IS DISTINCT FROM public.normalize_city_value(city);

-- Trim and deduplicate reference cities table
UPDATE public.cities
SET city = public.normalize_city_value(city)
WHERE city IS DISTINCT FROM public.normalize_city_value(city);

DELETE FROM public.cities c
USING public.cities c2
WHERE c.city = c2.city
  AND c.id > c2.id;

-- Add Punjab-region cities used by events/venues but missing from reference table
INSERT INTO public.cities (city, zone, is_available)
SELECT v.city, v.zone, true
FROM (VALUES
  ('Amritsar', 'North'),
  ('Ludhiana', 'North'),
  ('Batala', 'North'),
  ('Bathinda', 'North'),
  ('Ambala', 'North'),
  ('Pathankot', 'North'),
  ('Barnala', 'North'),
  ('Gurdaspur', 'North')
) AS v(city, zone)
WHERE NOT EXISTS (
  SELECT 1 FROM public.cities c WHERE c.city = v.city
);

DROP FUNCTION public.normalize_city_value(text);
