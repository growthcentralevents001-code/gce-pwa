export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      affiliate_applications: {
        Row: {
          created_at: string | null
          follower_range: string | null
          full_name: string | null
          id: string
          phone: string | null
          social_handle: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          follower_range?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          social_handle?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          follower_range?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          social_handle?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      affiliate_commission_history: {
        Row: {
          affiliate_id: string | null
          commission_amount: number | null
          created_at: string | null
          id: string
          paid: boolean | null
          paid_at: string | null
          venue_id: string | null
        }
        Insert: {
          affiliate_id?: string | null
          commission_amount?: number | null
          created_at?: string | null
          id?: string
          paid?: boolean | null
          paid_at?: string | null
          venue_id?: string | null
        }
        Update: {
          affiliate_id?: string | null
          commission_amount?: number | null
          created_at?: string | null
          id?: string
          paid?: boolean | null
          paid_at?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commission_history_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "marketplace_affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_commission_history_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payout_requests: {
        Row: {
          affiliate_id: string | null
          amount: number
          id: string
          notes: string | null
          processed_at: string | null
          requested_at: string | null
          status: string | null
        }
        Insert: {
          affiliate_id?: string | null
          amount: number
          id?: string
          notes?: string | null
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
        }
        Update: {
          affiliate_id?: string | null
          amount?: number
          id?: string
          notes?: string | null
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payout_requests_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "marketplace_affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_signups: {
        Row: {
          affiliate_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          affiliate_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          affiliate_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_signups_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "marketplace_affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_venues: {
        Row: {
          affiliate_id: string | null
          created_at: string | null
          id: string
          venue_id: string | null
        }
        Insert: {
          affiliate_id?: string | null
          created_at?: string | null
          id?: string
          venue_id?: string | null
        }
        Update: {
          affiliate_id?: string | null
          created_at?: string | null
          id?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_venues_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "marketplace_affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_venues_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      approved_venues: {
        Row: {
          address: string | null
          city: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          address?: string | null
          city: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      auth_users_sync: {
        Row: {
          synced: boolean | null
          user_id: string
        }
        Insert: {
          synced?: boolean | null
          user_id: string
        }
        Update: {
          synced?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      bdm_commission: {
        Row: {
          amount: number | null
          bdm_id: string | null
          created_at: string | null
          id: string
          month: string | null
          paid: boolean | null
        }
        Insert: {
          amount?: number | null
          bdm_id?: string | null
          created_at?: string | null
          id?: string
          month?: string | null
          paid?: boolean | null
        }
        Update: {
          amount?: number | null
          bdm_id?: string | null
          created_at?: string | null
          id?: string
          month?: string | null
          paid?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "bdm_commission_bdm_id_fkey"
            columns: ["bdm_id"]
            isOneToOne: false
            referencedRelation: "bdm_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bdm_leads: {
        Row: {
          bdm_id: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          notes: string | null
          proof_url: string | null
          status: string | null
          updated_at: string | null
          venue_name: string | null
        }
        Insert: {
          bdm_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          proof_url?: string | null
          status?: string | null
          updated_at?: string | null
          venue_name?: string | null
        }
        Update: {
          bdm_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          proof_url?: string | null
          status?: string | null
          updated_at?: string | null
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bdm_leads_bdm_id_fkey"
            columns: ["bdm_id"]
            isOneToOne: false
            referencedRelation: "bdm_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bdm_profiles: {
        Row: {
          commission: number | null
          created_at: string | null
          events_count: number | null
          id: string
          leads_count: number | null
          target_multiplier: number | null
          target_revenue: number | null
          user_id: string | null
          won_leads: number | null
          zone: string
        }
        Insert: {
          commission?: number | null
          created_at?: string | null
          events_count?: number | null
          id?: string
          leads_count?: number | null
          target_multiplier?: number | null
          target_revenue?: number | null
          user_id?: string | null
          won_leads?: number | null
          zone: string
        }
        Update: {
          commission?: number | null
          created_at?: string | null
          events_count?: number | null
          id?: string
          leads_count?: number | null
          target_multiplier?: number | null
          target_revenue?: number | null
          user_id?: string | null
          won_leads?: number | null
          zone?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string | null
          event_id: string | null
          id: string
          status: string | null
          tickets: number | null
          total_amount: number | null
          user_id: string | null
        }
        Insert: {
          booking_date?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          tickets?: number | null
          total_amount?: number | null
          user_id?: string | null
        }
        Update: {
          booking_date?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          tickets?: number | null
          total_amount?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          city: string
          id: number
          is_available: boolean | null
          zone: string
        }
        Insert: {
          city: string
          id?: number
          is_available?: boolean | null
          zone: string
        }
        Update: {
          city?: string
          id?: number
          is_available?: boolean | null
          zone?: string
        }
        Relationships: []
      }
      commission_logs: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          event_id: string | null
          gce_commission: number | null
          id: string
          paid_at: string | null
          referrer_id: string | null
          referrer_share: number | null
          referrer_type: string | null
          status: string | null
          total_booking_amount: number | null
          venue_id: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          event_id?: string | null
          gce_commission?: number | null
          id?: string
          paid_at?: string | null
          referrer_id?: string | null
          referrer_share?: number | null
          referrer_type?: string | null
          status?: string | null
          total_booking_amount?: number | null
          venue_id?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          event_id?: string | null
          gce_commission?: number | null
          id?: string
          paid_at?: string | null
          referrer_id?: string | null
          referrer_share?: number | null
          referrer_type?: string | null
          status?: string | null
          total_booking_amount?: number | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_logs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_logs_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_applications: {
        Row: {
          budget_range: string | null
          company_name: string
          contact_person: string
          created_at: string | null
          email: string
          event_type: string
          id: string
          message: string | null
          phone: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          budget_range?: string | null
          company_name: string
          contact_person: string
          created_at?: string | null
          email: string
          event_type: string
          id?: string
          message?: string | null
          phone?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          budget_range?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string | null
          email?: string
          event_type?: string
          id?: string
          message?: string | null
          phone?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      enterprise_campaigns: {
        Row: {
          created_at: string | null
          discount_percent: number | null
          free_units: number | null
          id: string
          interests: string[] | null
          offer_type: string | null
          user_id: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          discount_percent?: number | null
          free_units?: number | null
          id?: string
          interests?: string[] | null
          offer_type?: string | null
          user_id?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          discount_percent?: number | null
          free_units?: number | null
          id?: string
          interests?: string[] | null
          offer_type?: string | null
          user_id?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      enterprise_proposals: {
        Row: {
          admin_notes: string | null
          amount: number | null
          created_at: string | null
          final_budget: number | null
          id: string
          proposal_text: string | null
          request_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount?: number | null
          created_at?: string | null
          final_budget?: number | null
          id?: string
          proposal_text?: string | null
          request_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number | null
          created_at?: string | null
          final_budget?: number | null
          id?: string
          proposal_text?: string | null
          request_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_proposals_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "enterprise_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_requests: {
        Row: {
          budget_range: string | null
          city: string | null
          created_at: string | null
          event_type: string | null
          guest_count: number | null
          id: string
          preferred_dates: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          budget_range?: string | null
          city?: string | null
          created_at?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          preferred_dates?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          budget_range?: string | null
          city?: string | null
          created_at?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          preferred_dates?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      event_attendance: {
        Row: {
          attended: boolean | null
          attended_at: string | null
          created_at: string | null
          event_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          attended?: boolean | null
          attended_at?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          attended?: boolean | null
          attended_at?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          bdm_id: string | null
          capacity: number | null
          category: string | null
          city: string | null
          created_at: string | null
          date: string | null
          description: string | null
          genre: string | null
          id: string
          image_url: string | null
          price: number | null
          registered: number | null
          status: string | null
          time: string | null
          title: string
          updated_at: string | null
          user_id: string | null
          venue: string | null
          venue_id: string | null
          vertical: string | null
        }
        Insert: {
          bdm_id?: string | null
          capacity?: number | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: string
          image_url?: string | null
          price?: number | null
          registered?: number | null
          status?: string | null
          time?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          venue?: string | null
          venue_id?: string | null
          vertical?: string | null
        }
        Update: {
          bdm_id?: string | null
          capacity?: number | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: string
          image_url?: string | null
          price?: number | null
          registered?: number | null
          status?: string | null
          time?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          venue?: string | null
          venue_id?: string | null
          vertical?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_bdm_id_fkey"
            columns: ["bdm_id"]
            isOneToOne: false
            referencedRelation: "bdm_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_affiliates: {
        Row: {
          admin_notes: string | null
          applied_at: string | null
          approved_at: string | null
          commission_rate: number | null
          email: string | null
          follower_count: number | null
          id: string
          name: string | null
          phone: string | null
          referral_code: string | null
          social_handle: string | null
          status: string | null
          total_commission_earned: number | null
          total_venues_onboarded: number | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          applied_at?: string | null
          approved_at?: string | null
          commission_rate?: number | null
          email?: string | null
          follower_count?: number | null
          id?: string
          name?: string | null
          phone?: string | null
          referral_code?: string | null
          social_handle?: string | null
          status?: string | null
          total_commission_earned?: number | null
          total_venues_onboarded?: number | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          applied_at?: string | null
          approved_at?: string | null
          commission_rate?: number | null
          email?: string | null
          follower_count?: number | null
          id?: string
          name?: string | null
          phone?: string | null
          referral_code?: string | null
          social_handle?: string | null
          status?: string | null
          total_commission_earned?: number | null
          total_venues_onboarded?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          status: string | null
          venue_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          venue_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          commission: Json | null
          discount: Json | null
          id: number
          notifications: Json | null
          payment: Json | null
          updated_at: string | null
        }
        Insert: {
          commission?: Json | null
          discount?: Json | null
          id?: number
          notifications?: Json | null
          payment?: Json | null
          updated_at?: string | null
        }
        Update: {
          commission?: Json | null
          discount?: Json | null
          id?: number
          notifications?: Json | null
          payment?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          points: number | null
          referred_user_id: string | null
          referrer_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          points?: number | null
          referred_user_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          points?: number | null
          referred_user_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          event_id: string | null
          helpful: number | null
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          event_id?: string | null
          helpful?: number | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          event_id?: string | null
          helpful?: number | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_events: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          notes: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          approved: boolean | null
          approved_at: string | null
          created_at: string | null
          notes: string | null
          role: string
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          approved_at?: string | null
          created_at?: string | null
          notes?: string | null
          role: string
          user_id: string
        }
        Update: {
          approved?: boolean | null
          approved_at?: string | null
          created_at?: string | null
          notes?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          expiry_date: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string | null
          email: string
          id: string
          interests: string[] | null
          name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          id?: string
          interests?: string[] | null
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          id?: string
          interests?: string[] | null
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      venue_plans: {
        Row: {
          capacity_max: number | null
          capacity_min: number | null
          id: string
          is_active: boolean | null
          monthly_fee: number
          name: string
        }
        Insert: {
          capacity_max?: number | null
          capacity_min?: number | null
          id?: string
          is_active?: boolean | null
          monthly_fee: number
          name: string
        }
        Update: {
          capacity_max?: number | null
          capacity_min?: number | null
          id?: string
          is_active?: boolean | null
          monthly_fee?: number
          name?: string
        }
        Relationships: []
      }
      venue_subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          plan_id: string | null
          razorpay_subscription_id: string | null
          start_date: string | null
          status: string | null
          venue_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_id?: string | null
          razorpay_subscription_id?: string | null
          start_date?: string | null
          status?: string | null
          venue_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_id?: string | null
          razorpay_subscription_id?: string | null
          start_date?: string | null
          status?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venue_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "venue_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_subscriptions_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string | null
          capacity: number | null
          city: string | null
          created_at: string | null
          created_by_zbp_id: string | null
          fee_adjustable: boolean | null
          id: string
          monthly_fee: number | null
          name: string
          rating: number | null
          rating_name: string | null
          referral_code: string | null
          referrer_id: string | null
          referrer_type: string | null
          status: string | null
          subscription_status: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          created_by_zbp_id?: string | null
          fee_adjustable?: boolean | null
          id?: string
          monthly_fee?: number | null
          name: string
          rating?: number | null
          rating_name?: string | null
          referral_code?: string | null
          referrer_id?: string | null
          referrer_type?: string | null
          status?: string | null
          subscription_status?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          created_by_zbp_id?: string | null
          fee_adjustable?: boolean | null
          id?: string
          monthly_fee?: number | null
          name?: string
          rating?: number | null
          rating_name?: string | null
          referral_code?: string | null
          referrer_id?: string | null
          referrer_type?: string | null
          status?: string | null
          subscription_status?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      zbp_applications: {
        Row: {
          city: string | null
          created_at: string | null
          experience: string | null
          full_name: string | null
          id: string
          phone: string | null
          status: string | null
          user_id: string | null
          venues_data: Json | null
          zone: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          experience?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          user_id?: string | null
          venues_data?: Json | null
          zone?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          experience?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          user_id?: string | null
          venues_data?: Json | null
          zone?: string | null
        }
        Relationships: []
      }
      zbp_commission_history: {
        Row: {
          fee_deducted: number | null
          gce_commission: number | null
          id: string
          month: string
          net_payout: number | null
          paid_at: string | null
          tier_at_time: string | null
          total_sales: number | null
          zbp_commission: number | null
          zbp_id: string | null
        }
        Insert: {
          fee_deducted?: number | null
          gce_commission?: number | null
          id?: string
          month: string
          net_payout?: number | null
          paid_at?: string | null
          tier_at_time?: string | null
          total_sales?: number | null
          zbp_commission?: number | null
          zbp_id?: string | null
        }
        Update: {
          fee_deducted?: number | null
          gce_commission?: number | null
          id?: string
          month?: string
          net_payout?: number | null
          paid_at?: string | null
          tier_at_time?: string | null
          total_sales?: number | null
          zbp_commission?: number | null
          zbp_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "zbp_commission_history_zbp_id_fkey"
            columns: ["zbp_id"]
            isOneToOne: false
            referencedRelation: "zbp_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      zbp_monthly_revenue: {
        Row: {
          created_at: string | null
          id: string
          incentive_applied: boolean | null
          month: string
          revenue: number | null
          zbp_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          incentive_applied?: boolean | null
          month: string
          revenue?: number | null
          zbp_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          incentive_applied?: boolean | null
          month?: string
          revenue?: number | null
          zbp_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "zbp_monthly_revenue_zbp_id_fkey"
            columns: ["zbp_id"]
            isOneToOne: false
            referencedRelation: "zbp_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      zbp_partners: {
        Row: {
          active_venues_count: number | null
          applied_at: string | null
          approved_at: string | null
          city: string
          id: string
          lifetime_commission: number | null
          status: string | null
          tier: string | null
          total_commission_earned: number | null
          user_id: string | null
          warning_sent: boolean | null
          warning_sent_at: string | null
          zone: string
          zone_released_at: string | null
        }
        Insert: {
          active_venues_count?: number | null
          applied_at?: string | null
          approved_at?: string | null
          city: string
          id?: string
          lifetime_commission?: number | null
          status?: string | null
          tier?: string | null
          total_commission_earned?: number | null
          user_id?: string | null
          warning_sent?: boolean | null
          warning_sent_at?: string | null
          zone: string
          zone_released_at?: string | null
        }
        Update: {
          active_venues_count?: number | null
          applied_at?: string | null
          approved_at?: string | null
          city?: string
          id?: string
          lifetime_commission?: number | null
          status?: string | null
          tier?: string | null
          total_commission_earned?: number | null
          user_id?: string | null
          warning_sent?: boolean | null
          warning_sent_at?: string | null
          zone?: string
          zone_released_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "zbp_partners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      zbp_profiles: {
        Row: {
          city: string | null
          commission_rate: number | null
          created_at: string | null
          id: string
          monthly_fee: number | null
          referral_code: string | null
          status: string | null
          tier: string | null
          total_commission: number | null
          updated_at: string | null
          user_id: string | null
          venues_onboarded: number | null
          zone: string | null
        }
        Insert: {
          city?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          monthly_fee?: number | null
          referral_code?: string | null
          status?: string | null
          tier?: string | null
          total_commission?: number | null
          updated_at?: string | null
          user_id?: string | null
          venues_onboarded?: number | null
          zone?: string | null
        }
        Update: {
          city?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          monthly_fee?: number | null
          referral_code?: string | null
          status?: string | null
          tier?: string | null
          total_commission?: number | null
          updated_at?: string | null
          user_id?: string | null
          venues_onboarded?: number | null
          zone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_role: {
        Args: { p_role_name: string; p_user_id: string }
        Returns: undefined
      }
      create_venue_for_affiliate: { Args: { email: string }; Returns: Json }
    }
    Enums: {
      user_role:
        | "admin"
        | "member"
        | "venue"
        | "franchisee"
        | "enterprise"
        | "zbp"
        | "affiliate"
        | "bdm"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: [
        "admin",
        "member",
        "venue",
        "franchisee",
        "enterprise",
        "zbp",
        "affiliate",
        "bdm",
      ],
    },
  },
} as const
