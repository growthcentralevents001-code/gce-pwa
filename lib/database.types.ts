export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
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
      audit_events: {
        Row: {
          action: string
          actor_assignment_id: string | null
          actor_user_id: string | null
          after_data: Json | null
          before_data: Json | null
          correlation_id: string | null
          created_at: string
          id: string
          is_manual_override: boolean
          metadata: Json
          occurred_at: string
          reason: string | null
          request_id: string | null
          resource_id: string | null
          resource_type: string
          source: string
          workspace_key: string | null
        }
        Insert: {
          action: string
          actor_assignment_id?: string | null
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          correlation_id?: string | null
          created_at?: string
          id?: string
          is_manual_override?: boolean
          metadata?: Json
          occurred_at?: string
          reason?: string | null
          request_id?: string | null
          resource_id?: string | null
          resource_type: string
          source?: string
          workspace_key?: string | null
        }
        Update: {
          action?: string
          actor_assignment_id?: string | null
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          correlation_id?: string | null
          created_at?: string
          id?: string
          is_manual_override?: boolean
          metadata?: Json
          occurred_at?: string
          reason?: string | null
          request_id?: string | null
          resource_id?: string | null
          resource_type?: string
          source?: string
          workspace_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_actor_assignment_id_fkey"
            columns: ["actor_assignment_id"]
            isOneToOne: false
            referencedRelation: "role_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      background_jobs: {
        Row: {
          attempt_count: number
          available_at: string
          completed_at: string | null
          correlation_id: string | null
          created_at: string
          id: string
          idempotency_key: string
          job_type: string
          last_error: string | null
          lease_owner: string | null
          leased_until: string | null
          max_attempts: number
          payload: Json
          status: Database["public"]["Enums"]["background_job_status"]
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          available_at?: string
          completed_at?: string | null
          correlation_id?: string | null
          created_at?: string
          id?: string
          idempotency_key: string
          job_type: string
          last_error?: string | null
          lease_owner?: string | null
          leased_until?: string | null
          max_attempts?: number
          payload?: Json
          status?: Database["public"]["Enums"]["background_job_status"]
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          available_at?: string
          completed_at?: string | null
          correlation_id?: string | null
          created_at?: string
          id?: string
          idempotency_key?: string
          job_type?: string
          last_error?: string | null
          lease_owner?: string | null
          leased_until?: string | null
          max_attempts?: number
          payload?: Json
          status?: Database["public"]["Enums"]["background_job_status"]
          updated_at?: string
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
      bdm_targets: {
        Row: {
          bdm_id: string | null
          commission_rate: number | null
          compliance_status: string | null
          created_at: string | null
          current_revenue: number | null
          id: string
          month: string | null
          target_revenue: number | null
          updated_at: string | null
          zone: string
        }
        Insert: {
          bdm_id?: string | null
          commission_rate?: number | null
          compliance_status?: string | null
          created_at?: string | null
          current_revenue?: number | null
          id?: string
          month?: string | null
          target_revenue?: number | null
          updated_at?: string | null
          zone: string
        }
        Update: {
          bdm_id?: string | null
          commission_rate?: number | null
          compliance_status?: string | null
          created_at?: string | null
          current_revenue?: number | null
          id?: string
          month?: string | null
          target_revenue?: number | null
          updated_at?: string | null
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "bdm_targets_bdm_id_fkey"
            columns: ["bdm_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          advance_paid: number | null
          booking_date: string | null
          event_date: string
          event_title: string
          final_bill: number | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
          venue: string
        }
        Insert: {
          advance_paid?: number | null
          booking_date?: string | null
          event_date: string
          event_title: string
          final_bill?: number | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          venue: string
        }
        Update: {
          advance_paid?: number | null
          booking_date?: string | null
          event_date?: string
          event_title?: string
          final_bill?: number | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_leads: {
        Row: {
          circle_member_id: string | null
          created_at: string | null
          id: string
          lead_details: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          circle_member_id?: string | null
          created_at?: string | null
          id?: string
          lead_details: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          circle_member_id?: string | null
          created_at?: string | null
          id?: string
          lead_details?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "circle_leads_circle_member_id_fkey"
            columns: ["circle_member_id"]
            isOneToOne: false
            referencedRelation: "circle_members"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_members: {
        Row: {
          company: string | null
          id: string
          joined_at: string | null
          leads_given: number | null
          leads_received: number | null
          meetings_attended: number | null
          profession: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          zone: string | null
        }
        Insert: {
          company?: string | null
          id?: string
          joined_at?: string | null
          leads_given?: number | null
          leads_received?: number | null
          meetings_attended?: number | null
          profession?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          zone?: string | null
        }
        Update: {
          company?: string | null
          id?: string
          joined_at?: string | null
          leads_given?: number | null
          leads_received?: number | null
          meetings_attended?: number | null
          profession?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "circle_members_user_id_fkey"
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
          is_sales_event: boolean | null
          min_purchase: number | null
          offer_type: string | null
          offer_value: number | null
          price: number | null
          product_category: string | null
          redemption_limit: number | null
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
          is_sales_event?: boolean | null
          min_purchase?: number | null
          offer_type?: string | null
          offer_value?: number | null
          price?: number | null
          product_category?: string | null
          redemption_limit?: number | null
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
          is_sales_event?: boolean | null
          min_purchase?: number | null
          offer_type?: string | null
          offer_value?: number | null
          price?: number | null
          product_category?: string | null
          redemption_limit?: number | null
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
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          key: string
          metadata: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          key: string
          metadata?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          key?: string
          metadata?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          business_source: string
          created_at: string
          created_by: string | null
          currency: string
          external_reference: string | null
          id: string
          metadata: Json
          payment_intent_id: string | null
          rule_version: string | null
          transaction_key: string
          vertical: string | null
        }
        Insert: {
          business_source: string
          created_at?: string
          created_by?: string | null
          currency?: string
          external_reference?: string | null
          id?: string
          metadata?: Json
          payment_intent_id?: string | null
          rule_version?: string | null
          transaction_key: string
          vertical?: string | null
        }
        Update: {
          business_source?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          external_reference?: string | null
          id?: string
          metadata?: Json
          payment_intent_id?: string | null
          rule_version?: string | null
          transaction_key?: string
          vertical?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          bdm_id: string | null
          business_name: string
          circle_member_id: string | null
          contact: string
          id: string
          proof: string | null
          source: string | null
          status: string | null
          submitted_date: string | null
          updated_at: string | null
        }
        Insert: {
          bdm_id?: string | null
          business_name: string
          circle_member_id?: string | null
          contact: string
          id?: string
          proof?: string | null
          source?: string | null
          status?: string | null
          submitted_date?: string | null
          updated_at?: string | null
        }
        Update: {
          bdm_id?: string | null
          business_name?: string
          circle_member_id?: string | null
          contact?: string
          id?: string
          proof?: string | null
          source?: string | null
          status?: string | null
          submitted_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_bdm_id_fkey"
            columns: ["bdm_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_circle_member_id_fkey"
            columns: ["circle_member_id"]
            isOneToOne: false
            referencedRelation: "circle_members"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger_accounts: {
        Row: {
          created_at: string
          currency: string
          id: string
          kind: Database["public"]["Enums"]["ledger_account_kind"]
          label: string | null
          metadata: Json
          organisation_id: string | null
          owner_user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          kind: Database["public"]["Enums"]["ledger_account_kind"]
          label?: string | null
          metadata?: Json
          organisation_id?: string | null
          owner_user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          kind?: Database["public"]["Enums"]["ledger_account_kind"]
          label?: string | null
          metadata?: Json
          organisation_id?: string | null
          owner_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ledger_accounts_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_accounts_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger_entries: {
        Row: {
          amount_minor: number
          created_at: string
          currency: string
          direction: string
          entitlement_ref: string | null
          financial_transaction_id: string
          id: string
          ledger_account_id: string
          metadata: Json
          reversal_of_entry_id: string | null
          settlement_ref: string | null
        }
        Insert: {
          amount_minor: number
          created_at?: string
          currency?: string
          direction: string
          entitlement_ref?: string | null
          financial_transaction_id: string
          id?: string
          ledger_account_id: string
          metadata?: Json
          reversal_of_entry_id?: string | null
          settlement_ref?: string | null
        }
        Update: {
          amount_minor?: number
          created_at?: string
          currency?: string
          direction?: string
          entitlement_ref?: string | null
          financial_transaction_id?: string
          id?: string
          ledger_account_id?: string
          metadata?: Json
          reversal_of_entry_id?: string | null
          settlement_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_financial_transaction_id_fkey"
            columns: ["financial_transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_ledger_account_id_fkey"
            columns: ["ledger_account_id"]
            isOneToOne: false
            referencedRelation: "ledger_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_reversal_of_entry_id_fkey"
            columns: ["reversal_of_entry_id"]
            isOneToOne: false
            referencedRelation: "ledger_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      legacy_role_migration_map: {
        Row: {
          canonical_role_key: Database["public"]["Enums"]["gce_role_key"] | null
          created_at: string
          grants_entitlement: boolean
          id: string
          legacy_role: string
          mapping_status: string
          notes: string | null
        }
        Insert: {
          canonical_role_key?:
            | Database["public"]["Enums"]["gce_role_key"]
            | null
          created_at?: string
          grants_entitlement?: boolean
          id?: string
          legacy_role: string
          mapping_status?: string
          notes?: string | null
        }
        Update: {
          canonical_role_key?:
            | Database["public"]["Enums"]["gce_role_key"]
            | null
          created_at?: string
          grants_entitlement?: boolean
          id?: string
          legacy_role?: string
          mapping_status?: string
          notes?: string | null
        }
        Relationships: []
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
      offer_claims: {
        Row: {
          claimed_at: string | null
          id: string
          offer_id: string | null
          order_tracking: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          id?: string
          offer_id?: string | null
          order_tracking?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          id?: string
          offer_id?: string | null
          order_tracking?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_claims_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_claims_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          category: string | null
          claimed: number | null
          code: string
          created_at: string | null
          description: string | null
          discount: string
          expiry: string
          id: string
          max_claims: number | null
          status: string | null
          supplier: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          claimed?: number | null
          code: string
          created_at?: string | null
          description?: string | null
          discount: string
          expiry: string
          id?: string
          max_claims?: number | null
          status?: string | null
          supplier: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          claimed?: number | null
          code?: string
          created_at?: string | null
          description?: string | null
          discount?: string
          expiry?: string
          id?: string
          max_claims?: number | null
          status?: string | null
          supplier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      organisation_memberships: {
        Row: {
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          is_primary: boolean
          membership_role: Database["public"]["Enums"]["org_membership_role"]
          metadata: Json
          organisation_id: string
          status: Database["public"]["Enums"]["org_membership_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_primary?: boolean
          membership_role?: Database["public"]["Enums"]["org_membership_role"]
          metadata?: Json
          organisation_id: string
          status?: Database["public"]["Enums"]["org_membership_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_primary?: boolean
          membership_role?: Database["public"]["Enums"]["org_membership_role"]
          metadata?: Json
          organisation_id?: string
          status?: Database["public"]["Enums"]["org_membership_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisation_memberships_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          country_code: string
          created_at: string
          created_by: string | null
          gstin: string | null
          id: string
          kind: Database["public"]["Enums"]["organisation_kind"]
          legal_name: string
          metadata: Json
          primary_city: string | null
          registration_number: string | null
          status: Database["public"]["Enums"]["organisation_status"]
          trading_name: string | null
          updated_at: string
        }
        Insert: {
          country_code?: string
          created_at?: string
          created_by?: string | null
          gstin?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["organisation_kind"]
          legal_name: string
          metadata?: Json
          primary_city?: string | null
          registration_number?: string | null
          status?: Database["public"]["Enums"]["organisation_status"]
          trading_name?: string | null
          updated_at?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          created_by?: string | null
          gstin?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["organisation_kind"]
          legal_name?: string
          metadata?: Json
          primary_city?: string | null
          registration_number?: string | null
          status?: Database["public"]["Enums"]["organisation_status"]
          trading_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_events: {
        Row: {
          capacity: number | null
          created_at: string | null
          date: string
          id: string
          partner_id: string | null
          price: number | null
          status: string | null
          time: string
          title: string
          updated_at: string | null
          venue: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          date: string
          id?: string
          partner_id?: string | null
          price?: number | null
          status?: string | null
          time: string
          title: string
          updated_at?: string | null
          venue: string
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          date?: string
          id?: string
          partner_id?: string | null
          price?: number | null
          status?: string | null
          time?: string
          title?: string
          updated_at?: string | null
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_events_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          business_name: string
          commission_rate: number | null
          created_at: string | null
          id: string
          status: string | null
          tier: string | null
          total_revenue: number | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          business_name: string
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          tier?: string | null
          total_revenue?: number | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          business_name?: string
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          tier?: string | null
          total_revenue?: number | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_intents: {
        Row: {
          amount_minor: number
          business_purpose: string
          created_at: string
          currency: string
          external_reference: string | null
          feature_gate_key: string | null
          id: string
          idempotency_key: string | null
          metadata: Json
          organisation_id: string | null
          payer_user_id: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          status: Database["public"]["Enums"]["payment_intent_status"]
          updated_at: string
          vertical: string | null
        }
        Insert: {
          amount_minor: number
          business_purpose: string
          created_at?: string
          currency?: string
          external_reference?: string | null
          feature_gate_key?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          organisation_id?: string | null
          payer_user_id?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          status?: Database["public"]["Enums"]["payment_intent_status"]
          updated_at?: string
          vertical?: string | null
        }
        Update: {
          amount_minor?: number
          business_purpose?: string
          created_at?: string
          currency?: string
          external_reference?: string | null
          feature_gate_key?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          organisation_id?: string | null
          payer_user_id?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          status?: Database["public"]["Enums"]["payment_intent_status"]
          updated_at?: string
          vertical?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_intents_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_intents_payer_user_id_fkey"
            columns: ["payer_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_webhook_events: {
        Row: {
          correlation_id: string | null
          error_message: string | null
          id: string
          idempotency_key: string
          payload: Json
          processed_at: string | null
          processing_status: string
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_event_id: string | null
          received_at: string
          signature_valid: boolean | null
        }
        Insert: {
          correlation_id?: string | null
          error_message?: string | null
          id?: string
          idempotency_key: string
          payload: Json
          processed_at?: string | null
          processing_status?: string
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_event_id?: string | null
          received_at?: string
          signature_valid?: boolean | null
        }
        Update: {
          correlation_id?: string | null
          error_message?: string | null
          id?: string
          idempotency_key?: string
          payload?: Json
          processed_at?: string | null
          processing_status?: string
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_event_id?: string | null
          received_at?: string
          signature_valid?: boolean | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_date: string | null
          status: string | null
          transaction_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_date?: string | null
          status?: string | null
          transaction_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_date?: string | null
          status?: string | null
          transaction_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          legal_name: string | null
          locale: string | null
          metadata: Json
          phone: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          legal_name?: string | null
          locale?: string | null
          metadata?: Json
          phone?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          legal_name?: string | null
          locale?: string | null
          metadata?: Json
          phone?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          created_at: string | null
          id: string
          rating: number | null
          review: string | null
          reviewer_id: string | null
          stakeholder_id: string
          stakeholder_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          reviewer_id?: string | null
          stakeholder_id: string
          stakeholder_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          reviewer_id?: string | null
          stakeholder_id?: string
          stakeholder_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      role_assignment_events: {
        Row: {
          actor_user_id: string | null
          assignment_id: string
          created_at: string
          event_type: string
          from_status: Database["public"]["Enums"]["assignment_status"] | null
          id: string
          metadata: Json
          reason: string | null
          to_status: Database["public"]["Enums"]["assignment_status"] | null
        }
        Insert: {
          actor_user_id?: string | null
          assignment_id: string
          created_at?: string
          event_type: string
          from_status?: Database["public"]["Enums"]["assignment_status"] | null
          id?: string
          metadata?: Json
          reason?: string | null
          to_status?: Database["public"]["Enums"]["assignment_status"] | null
        }
        Update: {
          actor_user_id?: string | null
          assignment_id?: string
          created_at?: string
          event_type?: string
          from_status?: Database["public"]["Enums"]["assignment_status"] | null
          id?: string
          metadata?: Json
          reason?: string | null
          to_status?: Database["public"]["Enums"]["assignment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "role_assignment_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_assignment_events_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "role_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      role_assignments: {
        Row: {
          created_at: string
          effective_from: string
          effective_to: string | null
          granted_by: string | null
          id: string
          metadata: Json
          organisation_id: string | null
          revoke_reason: string | null
          revoked_by: string | null
          role_key: Database["public"]["Enums"]["gce_role_key"]
          scope_id: string | null
          scope_type: Database["public"]["Enums"]["assignment_scope_type"]
          status: Database["public"]["Enums"]["assignment_status"]
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          granted_by?: string | null
          id?: string
          metadata?: Json
          organisation_id?: string | null
          revoke_reason?: string | null
          revoked_by?: string | null
          role_key: Database["public"]["Enums"]["gce_role_key"]
          scope_id?: string | null
          scope_type?: Database["public"]["Enums"]["assignment_scope_type"]
          status?: Database["public"]["Enums"]["assignment_status"]
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          granted_by?: string | null
          id?: string
          metadata?: Json
          organisation_id?: string | null
          revoke_reason?: string | null
          revoked_by?: string | null
          role_key?: Database["public"]["Enums"]["gce_role_key"]
          scope_id?: string | null
          scope_type?: Database["public"]["Enums"]["assignment_scope_type"]
          status?: Database["public"]["Enums"]["assignment_status"]
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_assignments_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_assignments_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_assignments_revoked_by_fkey"
            columns: ["revoked_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_assignments_user_id_fkey"
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
          event_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          user_id?: string
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
      settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          action: string
          id: string
          ip_address: string | null
          status: string | null
          timestamp: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          ip_address?: string | null
          status?: string | null
          timestamp?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          ip_address?: string | null
          status?: string | null
          timestamp?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      user_workspace_preferences: {
        Row: {
          default_workspace_key: string | null
          last_workspace_key: string | null
          preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          default_workspace_key?: string | null
          last_workspace_key?: string | null
          preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          default_workspace_key?: string | null
          last_workspace_key?: string | null
          preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_workspace_preferences_default_workspace_key_fkey"
            columns: ["default_workspace_key"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["workspace_key"]
          },
          {
            foreignKeyName: "user_workspace_preferences_last_workspace_key_fkey"
            columns: ["last_workspace_key"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["workspace_key"]
          },
          {
            foreignKeyName: "user_workspace_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      workspaces: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string
          metadata: Json
          role_key: Database["public"]["Enums"]["gce_role_key"] | null
          updated_at: string
          workspace_key: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          metadata?: Json
          role_key?: Database["public"]["Enums"]["gce_role_key"] | null
          updated_at?: string
          workspace_key: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          metadata?: Json
          role_key?: Database["public"]["Enums"]["gce_role_key"] | null
          updated_at?: string
          workspace_key?: string
        }
        Relationships: []
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
      gce_current_user_id: { Args: never; Returns: string }
      gce_has_active_assignment: {
        Args: {
          p_role?: Database["public"]["Enums"]["gce_role_key"]
          p_scope_id?: string
          p_scope_type?: Database["public"]["Enums"]["assignment_scope_type"]
        }
        Returns: boolean
      }
      gce_is_platform_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      assignment_scope_type:
        | "platform"
        | "legal_entity"
        | "vertical"
        | "city"
        | "circle"
        | "unit"
        | "venue"
        | "organisation"
        | "client"
        | "project"
        | "department"
        | "case"
        | "lead"
        | "temporary_ops"
      assignment_status:
        | "pending"
        | "active"
        | "suspended"
        | "expired"
        | "revoked"
      background_job_status:
        | "pending"
        | "leased"
        | "running"
        | "succeeded"
        | "failed"
        | "dead_letter"
      gce_role_key:
        | "platform_user"
        | "circle_member"
        | "connect_bdp"
        | "marketplace_bdp"
        | "enterprise_bdp"
        | "enterprise_client_representative"
        | "venue_representative"
        | "governing_body_member"
        | "circle_finance_coordinator"
        | "sergeant_at_arms"
        | "relationship_manager"
        | "platform_relationship_manager"
        | "platform_admin"
        | "finance_admin"
        | "compliance_admin"
        | "support_admin"
      ledger_account_kind:
        | "customer_wallet"
        | "escrow"
        | "settlement_payable"
        | "commission_payable"
        | "platform_revenue"
        | "tax_payable"
        | "refund_liability"
        | "franchise_recovery"
        | "clearing"
        | "other"
      org_membership_role:
        | "owner"
        | "admin"
        | "representative"
        | "member"
        | "billing_contact"
        | "viewer"
      org_membership_status: "invited" | "active" | "suspended" | "revoked"
      organisation_kind:
        | "platform_legal_entity"
        | "venue_partner"
        | "enterprise_client"
        | "business_professional"
        | "vendor"
        | "other"
      organisation_status: "draft" | "active" | "suspended" | "archived"
      payment_intent_status:
        | "created"
        | "requires_action"
        | "processing"
        | "succeeded"
        | "failed"
        | "cancelled"
        | "refund_pending"
        | "refunded"
        | "partially_refunded"
      payment_provider: "razorpay_candidate" | "manual_admin" | "other"
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

export type Tables<
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

export type TablesInsert<
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

export type TablesUpdate<
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      assignment_scope_type: [
        "platform",
        "legal_entity",
        "vertical",
        "city",
        "circle",
        "unit",
        "venue",
        "organisation",
        "client",
        "project",
        "department",
        "case",
        "lead",
        "temporary_ops",
      ],
      assignment_status: [
        "pending",
        "active",
        "suspended",
        "expired",
        "revoked",
      ],
      background_job_status: [
        "pending",
        "leased",
        "running",
        "succeeded",
        "failed",
        "dead_letter",
      ],
      gce_role_key: [
        "platform_user",
        "circle_member",
        "connect_bdp",
        "marketplace_bdp",
        "enterprise_bdp",
        "enterprise_client_representative",
        "venue_representative",
        "governing_body_member",
        "circle_finance_coordinator",
        "sergeant_at_arms",
        "relationship_manager",
        "platform_relationship_manager",
        "platform_admin",
        "finance_admin",
        "compliance_admin",
        "support_admin",
      ],
      ledger_account_kind: [
        "customer_wallet",
        "escrow",
        "settlement_payable",
        "commission_payable",
        "platform_revenue",
        "tax_payable",
        "refund_liability",
        "franchise_recovery",
        "clearing",
        "other",
      ],
      org_membership_role: [
        "owner",
        "admin",
        "representative",
        "member",
        "billing_contact",
        "viewer",
      ],
      org_membership_status: ["invited", "active", "suspended", "revoked"],
      organisation_kind: [
        "platform_legal_entity",
        "venue_partner",
        "enterprise_client",
        "business_professional",
        "vendor",
        "other",
      ],
      organisation_status: ["draft", "active", "suspended", "archived"],
      payment_intent_status: [
        "created",
        "requires_action",
        "processing",
        "succeeded",
        "failed",
        "cancelled",
        "refund_pending",
        "refunded",
        "partially_refunded",
      ],
      payment_provider: ["razorpay_candidate", "manual_admin", "other"],
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

