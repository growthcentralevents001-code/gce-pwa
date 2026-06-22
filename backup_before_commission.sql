


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."user_role" AS ENUM (
    'admin',
    'member',
    'venue',
    'franchisee',
    'enterprise',
    'zbp',
    'affiliate',
    'bdm'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_affiliate_commission"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  venue_owner_id UUID;
  aff_record UUID;
  commission_amount NUMERIC;
  aff_commission_rate INT;
  total_sale NUMERIC;
  event_price NUMERIC;
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    -- Get event's venue owner via venue_id
    SELECT v.user_id, e.price INTO venue_owner_id, event_price
    FROM events e
    JOIN venues v ON e.venue_id = v.id
    WHERE e.id = NEW.event_id;
    
    IF venue_owner_id IS NOT NULL THEN
      SELECT affiliate_id INTO aff_record FROM affiliate_signups WHERE user_id = venue_owner_id;
      IF aff_record IS NOT NULL THEN
        SELECT commission_rate INTO aff_commission_rate FROM marketplace_affiliates WHERE id = aff_record;
        total_sale := NEW.tickets * event_price;
        commission_amount := total_sale * 0.20 * (aff_commission_rate / 100.0);
        
        INSERT INTO affiliate_commission_history (affiliate_id, venue_id, commission_amount, paid)
        VALUES (aff_record, (SELECT venue_id FROM events WHERE id = NEW.event_id), commission_amount, false);
        
        UPDATE marketplace_affiliates
        SET total_commission_earned = total_commission_earned + commission_amount
        WHERE id = aff_record;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."add_affiliate_commission"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_affiliate_venue"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  aff_id UUID;
BEGIN
  SELECT affiliate_id INTO aff_id FROM affiliate_signups WHERE user_id = NEW.user_id;
  IF aff_id IS NOT NULL THEN
    INSERT INTO affiliate_venues (affiliate_id, venue_id) VALUES (aff_id, NEW.id)
    ON CONFLICT (affiliate_id, venue_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."add_affiliate_venue"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_member_role_on_auth_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, approved, approved_at)
  VALUES (NEW.id, 'member', true, NOW())
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."add_member_role_on_auth_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_member_role_on_user_insert"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO user_roles (user_id, role, approved, approved_at)
  VALUES (NEW.id, 'member', true, NOW())
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."add_member_role_on_user_insert"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_user_role"("p_user_id" "uuid", "p_role_name" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, approved, approved_at)
  VALUES (p_user_id, p_role_name, true, NOW())
  ON CONFLICT (user_id, role) DO UPDATE
  SET approved = true, approved_at = NOW();
END;
$$;


ALTER FUNCTION "public"."add_user_role"("p_user_id" "uuid", "p_role_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."auto_approve_venue"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.status := 'Approved';
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."auto_approve_venue"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_venue_for_affiliate"("email" "text") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_id UUID;
  venue_id UUID;
  affiliate_id UUID := '86cd70d9-1d43-4b1b-9481-175401acf17c';
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE auth.users.email = create_venue_for_affiliate.email;
  IF user_id IS NULL THEN
    RETURN json_build_object('error', 'User not found');
  END IF;
  
  INSERT INTO venues (id, name, city, user_id, status)
  VALUES (gen_random_uuid(), 'Auto Venue', 'Mumbai', user_id, 'Active')
  RETURNING id INTO venue_id;
  
  INSERT INTO affiliate_venues (affiliate_id, venue_id)
  VALUES (affiliate_id, venue_id)
  ON CONFLICT DO NOTHING;
  
  RETURN json_build_object('success', true, 'venue_id', venue_id);
END;
$$;


ALTER FUNCTION "public"."create_venue_for_affiliate"("email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_venue_referrer"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF NEW.referrer_type = 'affiliate' AND NEW.referrer_id IS NOT NULL THEN
    -- Directly insert using the stored referrer_id (which should now be the marketplace_affiliates.id)
    INSERT INTO affiliate_venues (affiliate_id, venue_id)
    VALUES (NEW.referrer_id, NEW.id)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_venue_referrer"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_booking_commission"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  event_price NUMERIC;
  total_sale NUMERIC;
  gce_commission NUMERIC;
  zbp_id_var UUID;
  zbp_tier TEXT;
  zbp_share NUMERIC;
  zbp_commission_amount NUMERIC;
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    SELECT price INTO event_price FROM events WHERE id = NEW.event_id;
    total_sale := NEW.tickets * event_price;
    gce_commission := total_sale * 0.20;

    SELECT zbp.id, zbp.tier INTO zbp_id_var, zbp_tier
    FROM events e
    JOIN venues v ON e.venue = v.name
    JOIN zbp_partners zbp ON v.created_by_zbp_id = zbp.id
    WHERE e.id = NEW.event_id;

    IF zbp_id_var IS NOT NULL THEN
      IF zbp_tier = 'Platinum' THEN zbp_share := 0.50;
      ELSIF zbp_tier = 'Gold' THEN zbp_share := 0.40;
      ELSE zbp_share := 0.30;
      END IF;

      zbp_commission_amount := gce_commission * zbp_share;

      INSERT INTO zbp_commission_history (zbp_id, month, total_sales, gce_commission, zbp_commission, net_payout, tier_at_time, paid_at)
      VALUES (zbp_id_var, DATE_TRUNC('month', NOW()), total_sale, gce_commission, zbp_commission_amount, zbp_commission_amount, zbp_tier, NOW());

      UPDATE zbp_partners
      SET total_commission_earned = total_commission_earned + zbp_commission_amount,
          lifetime_commission = lifetime_commission + zbp_commission_amount
      WHERE id = zbp_id_var;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."process_booking_commission"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_affiliate_commission_rate"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.follower_count >= 50000 THEN
    NEW.commission_rate := 30;
  ELSIF NEW.follower_count >= 10000 THEN
    NEW.commission_rate := 20;
  ELSE
    NEW.commission_rate := 15;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_affiliate_commission_rate"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_zbp_active_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN IF TG_OP = 'INSERT' AND NEW.status = 'Active' AND NEW.created_by_zbp_id IS NOT NULL THEN UPDATE zbp_partners SET active_venues_count = active_venues_count + 1 WHERE id = NEW.created_by_zbp_id; RETURN NEW; END IF; IF TG_OP = 'UPDATE' AND OLD.status = 'Active' AND NEW.status != 'Active' AND OLD.created_by_zbp_id IS NOT NULL THEN UPDATE zbp_partners SET active_venues_count = active_venues_count - 1 WHERE id = OLD.created_by_zbp_id; RETURN NEW; END IF; IF TG_OP = 'UPDATE' AND OLD.status != 'Active' AND NEW.status = 'Active' AND NEW.created_by_zbp_id IS NOT NULL THEN UPDATE zbp_partners SET active_venues_count = active_venues_count + 1 WHERE id = NEW.created_by_zbp_id; RETURN NEW; END IF; IF TG_OP = 'DELETE' AND OLD.status = 'Active' AND OLD.created_by_zbp_id IS NOT NULL THEN UPDATE zbp_partners SET active_venues_count = active_venues_count - 1 WHERE id = OLD.created_by_zbp_id; RETURN OLD; END IF; RETURN NULL; END; $$;


ALTER FUNCTION "public"."update_zbp_active_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_zbp_commission_totals"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE zbp_partners 
  SET 
    total_commission_earned = (SELECT COALESCE(SUM(zbp_commission), 0) FROM zbp_commission_history WHERE zbp_id = NEW.zbp_id),
    lifetime_commission = (SELECT COALESCE(SUM(net_payout), 0) FROM zbp_commission_history WHERE zbp_id = NEW.zbp_id)
  WHERE id = NEW.zbp_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_zbp_commission_totals"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."affiliate_applications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "full_name" "text",
    "phone" "text",
    "social_handle" "text",
    "follower_range" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."affiliate_applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."affiliate_commission_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "affiliate_id" "uuid",
    "venue_id" "uuid",
    "commission_amount" integer,
    "paid" boolean DEFAULT false,
    "paid_at" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."affiliate_commission_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."affiliate_payout_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "affiliate_id" "uuid",
    "amount" integer NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "requested_at" timestamp without time zone DEFAULT "now"(),
    "processed_at" timestamp without time zone,
    "notes" "text"
);


ALTER TABLE "public"."affiliate_payout_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."affiliate_signups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "affiliate_id" "uuid",
    "user_id" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."affiliate_signups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."affiliate_venues" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "affiliate_id" "uuid",
    "venue_id" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."affiliate_venues" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."approved_venues" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "city" "text" NOT NULL,
    "address" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."approved_venues" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."auth_users_sync" (
    "user_id" "uuid" NOT NULL,
    "synced" boolean DEFAULT false
);


ALTER TABLE "public"."auth_users_sync" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bdm_commission" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bdm_id" "uuid",
    "amount" integer,
    "month" "date",
    "paid" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."bdm_commission" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bdm_leads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bdm_id" "uuid",
    "venue_name" "text",
    "contact_name" "text",
    "contact_phone" "text",
    "contact_email" "text",
    "status" "text" DEFAULT 'new'::"text",
    "proof_url" "text",
    "notes" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."bdm_leads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bdm_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "zone" "text" NOT NULL,
    "target_revenue" integer DEFAULT 1500000,
    "target_multiplier" integer DEFAULT 15,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "leads_count" integer DEFAULT 0,
    "won_leads" integer DEFAULT 0,
    "events_count" integer DEFAULT 0,
    "commission" integer DEFAULT 0
);


ALTER TABLE "public"."bdm_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "event_id" "uuid",
    "tickets" integer DEFAULT 1,
    "total_amount" integer,
    "status" "text" DEFAULT 'confirmed'::"text",
    "booking_date" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cities" (
    "id" integer NOT NULL,
    "city" "text" NOT NULL,
    "zone" "text" NOT NULL,
    "is_available" boolean DEFAULT true
);


ALTER TABLE "public"."cities" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cities_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cities_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cities_id_seq" OWNED BY "public"."cities"."id";



CREATE TABLE IF NOT EXISTS "public"."enterprise_applications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "company_name" "text" NOT NULL,
    "contact_person" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "event_type" "text" NOT NULL,
    "budget_range" "text",
    "message" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."enterprise_applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."enterprise_campaigns" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "offer_type" "text",
    "discount_percent" integer,
    "free_units" integer,
    "interests" "text"[],
    "valid_until" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."enterprise_campaigns" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."enterprise_proposals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "request_id" "uuid",
    "proposal_text" "text",
    "amount" numeric,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "admin_notes" "text",
    "final_budget" numeric(10,2),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid"
);


ALTER TABLE "public"."enterprise_proposals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."enterprise_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "event_type" "text",
    "guest_count" integer,
    "budget_range" "text",
    "city" "text",
    "preferred_dates" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."enterprise_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_attendance" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "event_id" "uuid",
    "attended" boolean DEFAULT false,
    "attended_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."event_attendance" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "venue" "text",
    "city" "text",
    "date" "date",
    "time" "text",
    "price" integer,
    "capacity" integer,
    "registered" integer DEFAULT 0,
    "category" "text",
    "status" "text" DEFAULT 'Live'::"text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "vertical" "text" DEFAULT 'Marketplace'::"text",
    "description" "text",
    "user_id" "uuid",
    "image_url" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "venue_id" "uuid",
    "bdm_id" "uuid",
    "genre" "text"
);


ALTER TABLE "public"."events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."marketplace_affiliates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "name" "text",
    "email" "text",
    "phone" "text",
    "social_handle" "text",
    "follower_count" integer DEFAULT 0,
    "total_venues_onboarded" integer DEFAULT 0,
    "total_commission_earned" integer DEFAULT 0,
    "commission_rate" integer DEFAULT 15,
    "status" "text" DEFAULT 'Pending'::"text",
    "applied_at" timestamp without time zone DEFAULT "now"(),
    "approved_at" timestamp without time zone,
    "admin_notes" "text",
    "referral_code" "text"
);


ALTER TABLE "public"."marketplace_affiliates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payouts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "venue_id" "uuid",
    "amount" integer,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."payouts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."platform_settings" (
    "id" integer DEFAULT 1 NOT NULL,
    "commission" "jsonb",
    "discount" "jsonb",
    "payment" "jsonb",
    "notifications" "jsonb",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."platform_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."referrals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "referrer_id" "uuid",
    "referred_user_id" "uuid",
    "points" integer DEFAULT 0,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."referrals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "event_id" "uuid",
    "rating" integer,
    "comment" "text",
    "helpful" integer DEFAULT 0,
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."saved_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "event_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "notes" "text"
);


ALTER TABLE "public"."saved_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "user_id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "approved" boolean DEFAULT false,
    "approved_at" timestamp with time zone,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_wallets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "balance" integer DEFAULT 0,
    "expiry_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_wallets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "name" "text",
    "phone" "text",
    "city" "text" DEFAULT 'Mumbai'::"text",
    "interests" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp without time zone DEFAULT "now"(),
    "role" "public"."user_role" DEFAULT 'member'::"public"."user_role",
    "avatar_url" "text"
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."venue_plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "monthly_fee" integer NOT NULL,
    "capacity_min" integer,
    "capacity_max" integer,
    "is_active" boolean DEFAULT true
);


ALTER TABLE "public"."venue_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."venue_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "venue_id" "uuid",
    "plan_id" "uuid",
    "status" "text" DEFAULT 'inactive'::"text",
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "razorpay_subscription_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."venue_subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."venues" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "address" "text",
    "city" "text",
    "type" "text",
    "status" "text" DEFAULT 'Pending'::"text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "subscription_status" "text" DEFAULT 'pending'::"text",
    "rating" integer DEFAULT 3,
    "rating_name" "text" DEFAULT 'Silver'::"text",
    "monthly_fee" integer DEFAULT 1000,
    "user_id" "uuid",
    "fee_adjustable" boolean DEFAULT true,
    "capacity" integer,
    "created_by_zbp_id" "uuid",
    "referrer_id" "uuid",
    "referrer_type" "text"
);


ALTER TABLE "public"."venues" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wishlist" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "event_id" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."wishlist" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."zbp_applications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "full_name" "text",
    "phone" "text",
    "zone" "text",
    "city" "text",
    "experience" "text",
    "venues_data" "jsonb",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."zbp_applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."zbp_commission_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "zbp_id" "uuid",
    "month" "date" NOT NULL,
    "total_sales" integer,
    "gce_commission" integer,
    "zbp_commission" integer,
    "fee_deducted" integer,
    "net_payout" integer,
    "tier_at_time" "text",
    "paid_at" timestamp without time zone
);


ALTER TABLE "public"."zbp_commission_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."zbp_monthly_revenue" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "zbp_id" "uuid",
    "month" "date" NOT NULL,
    "revenue" integer DEFAULT 0,
    "incentive_applied" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."zbp_monthly_revenue" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."zbp_partners" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "zone" "text" NOT NULL,
    "city" "text" NOT NULL,
    "tier" "text" DEFAULT 'Silver'::"text",
    "active_venues_count" integer DEFAULT 0,
    "total_commission_earned" integer DEFAULT 0,
    "lifetime_commission" integer DEFAULT 0,
    "warning_sent" boolean DEFAULT false,
    "warning_sent_at" timestamp without time zone,
    "status" "text" DEFAULT 'Pending'::"text",
    "applied_at" timestamp without time zone DEFAULT "now"(),
    "approved_at" timestamp without time zone,
    "zone_released_at" timestamp without time zone
);


ALTER TABLE "public"."zbp_partners" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."zbp_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "zone" "text",
    "tier" "text" DEFAULT 'Silver'::"text",
    "total_commission" integer DEFAULT 0,
    "monthly_fee" integer DEFAULT 0,
    "venues_onboarded" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "city" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "referral_code" "text"
);


ALTER TABLE "public"."zbp_profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."cities" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."cities_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."affiliate_applications"
    ADD CONSTRAINT "affiliate_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."affiliate_commission_history"
    ADD CONSTRAINT "affiliate_commission_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."affiliate_payout_requests"
    ADD CONSTRAINT "affiliate_payout_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."affiliate_signups"
    ADD CONSTRAINT "affiliate_signups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."affiliate_signups"
    ADD CONSTRAINT "affiliate_signups_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."affiliate_venues"
    ADD CONSTRAINT "affiliate_venues_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."approved_venues"
    ADD CONSTRAINT "approved_venues_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."auth_users_sync"
    ADD CONSTRAINT "auth_users_sync_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."bdm_commission"
    ADD CONSTRAINT "bdm_commission_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bdm_leads"
    ADD CONSTRAINT "bdm_leads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bdm_profiles"
    ADD CONSTRAINT "bdm_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."enterprise_applications"
    ADD CONSTRAINT "enterprise_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."enterprise_campaigns"
    ADD CONSTRAINT "enterprise_campaigns_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."enterprise_proposals"
    ADD CONSTRAINT "enterprise_proposals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."enterprise_requests"
    ADD CONSTRAINT "enterprise_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_attendance"
    ADD CONSTRAINT "event_attendance_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."marketplace_affiliates"
    ADD CONSTRAINT "marketplace_affiliates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."marketplace_affiliates"
    ADD CONSTRAINT "marketplace_affiliates_referral_code_key" UNIQUE ("referral_code");



ALTER TABLE ONLY "public"."marketplace_affiliates"
    ADD CONSTRAINT "marketplace_affiliates_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."payouts"
    ADD CONSTRAINT "payouts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."platform_settings"
    ADD CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."saved_events"
    ADD CONSTRAINT "saved_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."saved_events"
    ADD CONSTRAINT "saved_events_user_id_event_id_key" UNIQUE ("user_id", "event_id");



ALTER TABLE ONLY "public"."affiliate_venues"
    ADD CONSTRAINT "unique_affiliate_venue" UNIQUE ("affiliate_id", "venue_id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role");



ALTER TABLE ONLY "public"."user_wallets"
    ADD CONSTRAINT "user_wallets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."venue_plans"
    ADD CONSTRAINT "venue_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."venue_subscriptions"
    ADD CONSTRAINT "venue_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."venues"
    ADD CONSTRAINT "venues_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wishlist"
    ADD CONSTRAINT "wishlist_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wishlist"
    ADD CONSTRAINT "wishlist_user_id_event_id_key" UNIQUE ("user_id", "event_id");



ALTER TABLE ONLY "public"."zbp_applications"
    ADD CONSTRAINT "zbp_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."zbp_commission_history"
    ADD CONSTRAINT "zbp_commission_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."zbp_monthly_revenue"
    ADD CONSTRAINT "zbp_monthly_revenue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."zbp_partners"
    ADD CONSTRAINT "zbp_partners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."zbp_partners"
    ADD CONSTRAINT "zbp_partners_zone_city_key" UNIQUE ("zone", "city");



ALTER TABLE ONLY "public"."zbp_profiles"
    ADD CONSTRAINT "zbp_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."zbp_profiles"
    ADD CONSTRAINT "zbp_profiles_referral_code_key" UNIQUE ("referral_code");



ALTER TABLE ONLY "public"."zbp_profiles"
    ADD CONSTRAINT "zbp_profiles_user_id_key" UNIQUE ("user_id");



CREATE OR REPLACE TRIGGER "add_member_role_trigger" AFTER INSERT ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."add_member_role_on_user_insert"();



CREATE OR REPLACE TRIGGER "on_user_created" AFTER INSERT ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."add_member_role_on_user_insert"();



CREATE OR REPLACE TRIGGER "on_venue_created" AFTER INSERT OR UPDATE OF "referrer_id", "referrer_type" ON "public"."venues" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_venue_referrer"();



CREATE OR REPLACE TRIGGER "trigger_add_affiliate_venue" AFTER INSERT ON "public"."venues" FOR EACH ROW EXECUTE FUNCTION "public"."add_affiliate_venue"();



CREATE OR REPLACE TRIGGER "trigger_affiliate_commission" AFTER UPDATE ON "public"."bookings" FOR EACH ROW EXECUTE FUNCTION "public"."add_affiliate_commission"();



CREATE OR REPLACE TRIGGER "trigger_auto_approve_venue" BEFORE INSERT ON "public"."venues" FOR EACH ROW EXECUTE FUNCTION "public"."auto_approve_venue"();



CREATE OR REPLACE TRIGGER "trigger_booking_commission" AFTER INSERT OR UPDATE ON "public"."bookings" FOR EACH ROW EXECUTE FUNCTION "public"."process_booking_commission"();



CREATE OR REPLACE TRIGGER "trigger_set_affiliate_rate" BEFORE INSERT OR UPDATE ON "public"."marketplace_affiliates" FOR EACH ROW EXECUTE FUNCTION "public"."set_affiliate_commission_rate"();



CREATE OR REPLACE TRIGGER "trigger_update_zbp_totals" AFTER INSERT OR DELETE OR UPDATE ON "public"."zbp_commission_history" FOR EACH ROW EXECUTE FUNCTION "public"."update_zbp_commission_totals"();



CREATE OR REPLACE TRIGGER "trigger_zbp_active_count" AFTER INSERT OR DELETE OR UPDATE ON "public"."venues" FOR EACH ROW EXECUTE FUNCTION "public"."update_zbp_active_count"();



ALTER TABLE ONLY "public"."affiliate_applications"
    ADD CONSTRAINT "affiliate_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."affiliate_commission_history"
    ADD CONSTRAINT "affiliate_commission_history_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "public"."marketplace_affiliates"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."affiliate_commission_history"
    ADD CONSTRAINT "affiliate_commission_history_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id");



ALTER TABLE ONLY "public"."affiliate_payout_requests"
    ADD CONSTRAINT "affiliate_payout_requests_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "public"."marketplace_affiliates"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."affiliate_signups"
    ADD CONSTRAINT "affiliate_signups_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "public"."marketplace_affiliates"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."affiliate_signups"
    ADD CONSTRAINT "affiliate_signups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."affiliate_venues"
    ADD CONSTRAINT "affiliate_venues_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "public"."marketplace_affiliates"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."affiliate_venues"
    ADD CONSTRAINT "affiliate_venues_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."auth_users_sync"
    ADD CONSTRAINT "auth_users_sync_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bdm_commission"
    ADD CONSTRAINT "bdm_commission_bdm_id_fkey" FOREIGN KEY ("bdm_id") REFERENCES "public"."bdm_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bdm_leads"
    ADD CONSTRAINT "bdm_leads_bdm_id_fkey" FOREIGN KEY ("bdm_id") REFERENCES "public"."bdm_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bdm_profiles"
    ADD CONSTRAINT "bdm_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."enterprise_campaigns"
    ADD CONSTRAINT "enterprise_campaigns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."enterprise_proposals"
    ADD CONSTRAINT "enterprise_proposals_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."enterprise_requests"("id");



ALTER TABLE ONLY "public"."enterprise_proposals"
    ADD CONSTRAINT "enterprise_proposals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."enterprise_requests"
    ADD CONSTRAINT "enterprise_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."event_attendance"
    ADD CONSTRAINT "event_attendance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_attendance"
    ADD CONSTRAINT "event_attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_bdm_id_fkey" FOREIGN KEY ("bdm_id") REFERENCES "public"."bdm_profiles"("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "fk_events_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."marketplace_affiliates"
    ADD CONSTRAINT "marketplace_affiliates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payouts"
    ADD CONSTRAINT "payouts_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id");



ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_referred_user_id_fkey" FOREIGN KEY ("referred_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saved_events"
    ADD CONSTRAINT "saved_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saved_events"
    ADD CONSTRAINT "saved_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_wallets"
    ADD CONSTRAINT "user_wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."venue_subscriptions"
    ADD CONSTRAINT "venue_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."venue_plans"("id");



ALTER TABLE ONLY "public"."venue_subscriptions"
    ADD CONSTRAINT "venue_subscriptions_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."venues"
    ADD CONSTRAINT "venues_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."wishlist"
    ADD CONSTRAINT "wishlist_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wishlist"
    ADD CONSTRAINT "wishlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."zbp_applications"
    ADD CONSTRAINT "zbp_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."zbp_commission_history"
    ADD CONSTRAINT "zbp_commission_history_zbp_id_fkey" FOREIGN KEY ("zbp_id") REFERENCES "public"."zbp_partners"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."zbp_monthly_revenue"
    ADD CONSTRAINT "zbp_monthly_revenue_zbp_id_fkey" FOREIGN KEY ("zbp_id") REFERENCES "public"."zbp_partners"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."zbp_partners"
    ADD CONSTRAINT "zbp_partners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."zbp_profiles"
    ADD CONSTRAINT "zbp_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



CREATE POLICY "Admin can manage all roles" ON "public"."user_roles" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admin full access affiliate_venues" ON "public"."affiliate_venues" USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admin full access affiliates" ON "public"."marketplace_affiliates" USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admin full access commission" ON "public"."affiliate_commission_history" USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admin full access to affiliate_payout_requests" ON "public"."affiliate_payout_requests" USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can do anything on enterprise_proposals" ON "public"."enterprise_proposals" USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can do anything on enterprise_requests" ON "public"."enterprise_requests" USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Affiliates can insert their own payout requests" ON "public"."affiliate_payout_requests" FOR INSERT WITH CHECK (("affiliate_id" IN ( SELECT "marketplace_affiliates"."id"
   FROM "public"."marketplace_affiliates"
  WHERE ("marketplace_affiliates"."user_id" = "auth"."uid"()))));



CREATE POLICY "Affiliates can view their own payout requests" ON "public"."affiliate_payout_requests" FOR SELECT USING (("affiliate_id" IN ( SELECT "marketplace_affiliates"."id"
   FROM "public"."marketplace_affiliates"
  WHERE ("marketplace_affiliates"."user_id" = "auth"."uid"()))));



CREATE POLICY "Affiliates update own" ON "public"."marketplace_affiliates" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Affiliates view own" ON "public"."marketplace_affiliates" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Affiliates view own commission" ON "public"."affiliate_commission_history" FOR SELECT USING (("affiliate_id" IN ( SELECT "marketplace_affiliates"."id"
   FROM "public"."marketplace_affiliates"
  WHERE ("marketplace_affiliates"."user_id" = "auth"."uid"()))));



CREATE POLICY "Affiliates view own venues" ON "public"."affiliate_venues" FOR SELECT USING (("affiliate_id" IN ( SELECT "marketplace_affiliates"."id"
   FROM "public"."marketplace_affiliates"
  WHERE ("marketplace_affiliates"."user_id" = "auth"."uid"()))));



CREATE POLICY "Allow authenticated users to insert events" ON "public"."events" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow insert for authenticated users" ON "public"."bookings" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow public read" ON "public"."approved_venues" FOR SELECT USING (true);



CREATE POLICY "Allow public read" ON "public"."events" FOR SELECT USING (true);



CREATE POLICY "Allow public read referral codes" ON "public"."marketplace_affiliates" FOR SELECT USING (true);



CREATE POLICY "Allow public read referral codes" ON "public"."zbp_profiles" FOR SELECT USING (true);



CREATE POLICY "Allow select own bookings" ON "public"."bookings" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "BDM can insert own leads" ON "public"."bdm_leads" FOR INSERT WITH CHECK (("bdm_id" IN ( SELECT "bdm_profiles"."id"
   FROM "public"."bdm_profiles"
  WHERE ("bdm_profiles"."user_id" = "auth"."uid"()))));



CREATE POLICY "BDM can update own leads" ON "public"."bdm_leads" FOR UPDATE USING (("bdm_id" IN ( SELECT "bdm_profiles"."id"
   FROM "public"."bdm_profiles"
  WHERE ("bdm_profiles"."user_id" = "auth"."uid"()))));



CREATE POLICY "BDM can update own profile" ON "public"."bdm_profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "BDM can view own commission" ON "public"."bdm_commission" FOR SELECT USING (("bdm_id" IN ( SELECT "bdm_profiles"."id"
   FROM "public"."bdm_profiles"
  WHERE ("bdm_profiles"."user_id" = "auth"."uid"()))));



CREATE POLICY "BDM can view own leads" ON "public"."bdm_leads" USING (("bdm_id" IN ( SELECT "bdm_profiles"."id"
   FROM "public"."bdm_profiles"
  WHERE ("bdm_profiles"."user_id" = "auth"."uid"()))));



CREATE POLICY "BDM can view own profile" ON "public"."bdm_profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable delete for users own data" ON "public"."saved_events" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable insert for authenticated users" ON "public"."enterprise_applications" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable insert for authenticated users" ON "public"."saved_events" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable read access for all users" ON "public"."events" FOR SELECT USING (true);



CREATE POLICY "Enable select for users own data" ON "public"."saved_events" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Enterprises can update own proposals" ON "public"."enterprise_proposals" FOR UPDATE USING (("auth"."uid"() IN ( SELECT "enterprise_requests"."user_id"
   FROM "public"."enterprise_requests"
  WHERE ("enterprise_requests"."id" = "enterprise_proposals"."request_id"))));



CREATE POLICY "Users can delete own saved" ON "public"."saved_events" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own saved events" ON "public"."saved_events" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own saved_events" ON "public"."saved_events" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own wishlist" ON "public"."saved_events" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own affiliate application" ON "public"."marketplace_affiliates" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own affiliate applications" ON "public"."affiliate_applications" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own campaigns" ON "public"."enterprise_campaigns" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own requests" ON "public"."enterprise_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own roles" ON "public"."user_roles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own saved" ON "public"."saved_events" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own saved events" ON "public"."saved_events" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own saved_events" ON "public"."saved_events" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own wishlist" ON "public"."saved_events" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own venue" ON "public"."venues" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage own roles" ON "public"."user_roles" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own affiliate" ON "public"."marketplace_affiliates" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own affiliate record" ON "public"."marketplace_affiliates" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own profile" ON "public"."bdm_profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own wallet" ON "public"."user_wallets" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own venue" ON "public"."venues" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own affiliate" ON "public"."marketplace_affiliates" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own affiliate applications" ON "public"."affiliate_applications" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own affiliate record" ON "public"."marketplace_affiliates" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own attendance" ON "public"."event_attendance" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own campaigns" ON "public"."enterprise_campaigns" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own profile" ON "public"."bdm_profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own profile" ON "public"."users" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view own proposals" ON "public"."enterprise_proposals" FOR SELECT USING (("request_id" IN ( SELECT "enterprise_requests"."id"
   FROM "public"."enterprise_requests"
  WHERE ("enterprise_requests"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view own referrals" ON "public"."referrals" FOR SELECT USING (("auth"."uid"() = "referrer_id"));



CREATE POLICY "Users can view own requests" ON "public"."enterprise_requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own roles" ON "public"."user_roles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own saved" ON "public"."saved_events" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own saved events" ON "public"."saved_events" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own saved_events" ON "public"."saved_events" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own wallet" ON "public"."user_wallets" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own wishlist" ON "public"."saved_events" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own venue" ON "public"."venues" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Venue can view all events" ON "public"."events" FOR SELECT USING (true);



CREATE POLICY "ZBP can view own commission" ON "public"."zbp_commission_history" FOR SELECT USING (("zbp_id" IN ( SELECT "zbp_partners"."id"
   FROM "public"."zbp_partners"
  WHERE ("zbp_partners"."user_id" = "auth"."uid"()))));



CREATE POLICY "ZBP can view own partner" ON "public"."zbp_partners" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "ZBP can view own revenue" ON "public"."zbp_monthly_revenue" FOR SELECT USING (("zbp_id" IN ( SELECT "zbp_partners"."id"
   FROM "public"."zbp_partners"
  WHERE ("zbp_partners"."user_id" = "auth"."uid"()))));



CREATE POLICY "admin_delete_events" ON "public"."events" FOR DELETE USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "auth"."users"
  WHERE (("users"."email")::"text" = 'admin@gmail.com'::"text"))));



CREATE POLICY "admin_update_events" ON "public"."events" FOR UPDATE USING ((("auth"."role"() = 'authenticated'::"text") AND (( SELECT "users"."role"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())) = 'admin'::"public"."user_role")));



CREATE POLICY "admin_view_all_events" ON "public"."events" FOR SELECT USING ((("auth"."role"() = 'authenticated'::"text") AND (( SELECT "users"."role"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())) = 'admin'::"public"."user_role")));



ALTER TABLE "public"."affiliate_applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."affiliate_commission_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."affiliate_payout_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."affiliate_signups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."affiliate_venues" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "all_access" ON "public"."users" USING (true) WITH CHECK (true);



CREATE POLICY "allow_all_delete" ON "public"."events" FOR DELETE USING (true);



CREATE POLICY "allow_all_for_authenticated" ON "public"."users" TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."approved_venues" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."auth_users_sync" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bdm_commission" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bdm_leads" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bdm_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."enterprise_applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."enterprise_campaigns" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."enterprise_proposals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."enterprise_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_attendance" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."marketplace_affiliates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payouts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."platform_settings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "public_view_live_events" ON "public"."events" FOR SELECT USING (("status" = 'live'::"text"));



ALTER TABLE "public"."referrals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."saved_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "saved_events_delete_policy" ON "public"."saved_events" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "saved_events_insert_policy" ON "public"."saved_events" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "saved_events_select_policy" ON "public"."saved_events" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_wallets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "venue_insert_events" ON "public"."events" FOR INSERT WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND (( SELECT "users"."role"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())) = 'venue'::"public"."user_role")));



ALTER TABLE "public"."venue_plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."venue_subscriptions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "venue_update_own_events" ON "public"."events" FOR UPDATE USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."wishlist" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."zbp_commission_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."zbp_monthly_revenue" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."zbp_profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";











































































































































































GRANT ALL ON FUNCTION "public"."add_user_role"("p_user_id" "uuid", "p_role_name" "text") TO "authenticated";
























GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."affiliate_applications" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."affiliate_applications" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."affiliate_applications" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."affiliate_commission_history" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."affiliate_commission_history" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."affiliate_commission_history" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."affiliate_payout_requests" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."affiliate_payout_requests" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."affiliate_payout_requests" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."affiliate_signups" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."affiliate_signups" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."affiliate_signups" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."affiliate_venues" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."affiliate_venues" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."affiliate_venues" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."approved_venues" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."approved_venues" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."approved_venues" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."auth_users_sync" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."auth_users_sync" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."auth_users_sync" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."bdm_commission" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."bdm_commission" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."bdm_commission" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."bdm_leads" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."bdm_leads" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."bdm_leads" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."bdm_profiles" TO "anon";
GRANT ALL ON TABLE "public"."bdm_profiles" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."bdm_profiles" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."bookings" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."bookings" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."bookings" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."cities" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."cities" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."cities" TO "service_role";



GRANT INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enterprise_applications" TO "anon";
GRANT INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enterprise_applications" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enterprise_applications" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enterprise_campaigns" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enterprise_campaigns" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enterprise_campaigns" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enterprise_proposals" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."enterprise_proposals" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enterprise_proposals" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enterprise_requests" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."enterprise_requests" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."enterprise_requests" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."event_attendance" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."event_attendance" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."event_attendance" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."events" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."marketplace_affiliates" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."marketplace_affiliates" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."marketplace_affiliates" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."payouts" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."payouts" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."payouts" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."platform_settings" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."platform_settings" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."platform_settings" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."referrals" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."referrals" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."referrals" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."reviews" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."reviews" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."reviews" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."saved_events" TO "anon";
GRANT ALL ON TABLE "public"."saved_events" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."saved_events" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_wallets" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_wallets" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_wallets" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."venue_plans" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."venue_plans" TO "authenticated";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."venue_plans" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."venue_subscriptions" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."venue_subscriptions" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."venue_subscriptions" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."venues" TO "anon";
GRANT ALL ON TABLE "public"."venues" TO "authenticated";
GRANT ALL ON TABLE "public"."venues" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."wishlist" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."wishlist" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."wishlist" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_applications" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_applications" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_applications" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_commission_history" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_commission_history" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_commission_history" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_monthly_revenue" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_monthly_revenue" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_monthly_revenue" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_partners" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."zbp_partners" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_partners" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_profiles" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_profiles" TO "authenticated";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."zbp_profiles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "service_role";































