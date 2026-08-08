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
      business_specialisations: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          label: string
          metadata: Json
          power_sector: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          metadata?: Json
          power_sector?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          metadata?: Json
          power_sector?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      circle_allocation_proposals: {
        Row: {
          assisted_by_bdp_user_id: string | null
          circle_id: string
          confirmed_by: string | null
          created_at: string
          due_business_days: number
          id: string
          membership_id: string
          metadata: Json
          proposed_by: string | null
          reason: string | null
          seat_id: string | null
          specialisation_id: string | null
          status: Database["public"]["Enums"]["allocation_proposal_status"]
          updated_at: string
        }
        Insert: {
          assisted_by_bdp_user_id?: string | null
          circle_id: string
          confirmed_by?: string | null
          created_at?: string
          due_business_days?: number
          id?: string
          membership_id: string
          metadata?: Json
          proposed_by?: string | null
          reason?: string | null
          seat_id?: string | null
          specialisation_id?: string | null
          status?: Database["public"]["Enums"]["allocation_proposal_status"]
          updated_at?: string
        }
        Update: {
          assisted_by_bdp_user_id?: string | null
          circle_id?: string
          confirmed_by?: string | null
          created_at?: string
          due_business_days?: number
          id?: string
          membership_id?: string
          metadata?: Json
          proposed_by?: string | null
          reason?: string | null
          seat_id?: string | null
          specialisation_id?: string | null
          status?: Database["public"]["Enums"]["allocation_proposal_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_allocation_proposals_assisted_by_bdp_user_id_fkey"
            columns: ["assisted_by_bdp_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_allocation_proposals_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "connect_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_allocation_proposals_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_allocation_proposals_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "connect_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_allocation_proposals_proposed_by_fkey"
            columns: ["proposed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_allocation_proposals_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "connect_circle_seats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_allocation_proposals_specialisation_id_fkey"
            columns: ["specialisation_id"]
            isOneToOne: false
            referencedRelation: "business_specialisations"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_governance_appointments: {
        Row: {
          appointed_by: string | null
          circle_id: string
          created_at: string
          ends_at: string
          id: string
          metadata: Json
          reason: string | null
          role_assignment_id: string | null
          role_key: Database["public"]["Enums"]["gce_role_key"]
          starts_at: string
          status: string
          term_months: number
          updated_at: string
          user_id: string
        }
        Insert: {
          appointed_by?: string | null
          circle_id: string
          created_at?: string
          ends_at: string
          id?: string
          metadata?: Json
          reason?: string | null
          role_assignment_id?: string | null
          role_key: Database["public"]["Enums"]["gce_role_key"]
          starts_at?: string
          status?: string
          term_months?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          appointed_by?: string | null
          circle_id?: string
          created_at?: string
          ends_at?: string
          id?: string
          metadata?: Json
          reason?: string | null
          role_assignment_id?: string | null
          role_key?: Database["public"]["Enums"]["gce_role_key"]
          starts_at?: string
          status?: string
          term_months?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_governance_appointments_appointed_by_fkey"
            columns: ["appointed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_governance_appointments_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "connect_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_governance_appointments_role_assignment_id_fkey"
            columns: ["role_assignment_id"]
            isOneToOne: false
            referencedRelation: "role_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_governance_appointments_user_id_fkey"
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
      circle_transfers: {
        Row: {
          admin_fee_minor: number
          completed_at: string | null
          created_at: string
          fee_waived: boolean
          id: string
          membership_id: string
          metadata: Json
          preserve_bdp_attribution: boolean
          reason: string | null
          requested_by: string | null
          reviewed_by: string | null
          source_circle_id: string
          source_seat_id: string | null
          status: Database["public"]["Enums"]["circle_transfer_status"]
          target_circle_id: string
          target_seat_id: string | null
          updated_at: string
        }
        Insert: {
          admin_fee_minor?: number
          completed_at?: string | null
          created_at?: string
          fee_waived?: boolean
          id?: string
          membership_id: string
          metadata?: Json
          preserve_bdp_attribution?: boolean
          reason?: string | null
          requested_by?: string | null
          reviewed_by?: string | null
          source_circle_id: string
          source_seat_id?: string | null
          status?: Database["public"]["Enums"]["circle_transfer_status"]
          target_circle_id: string
          target_seat_id?: string | null
          updated_at?: string
        }
        Update: {
          admin_fee_minor?: number
          completed_at?: string | null
          created_at?: string
          fee_waived?: boolean
          id?: string
          membership_id?: string
          metadata?: Json
          preserve_bdp_attribution?: boolean
          reason?: string | null
          requested_by?: string | null
          reviewed_by?: string | null
          source_circle_id?: string
          source_seat_id?: string | null
          status?: Database["public"]["Enums"]["circle_transfer_status"]
          target_circle_id?: string
          target_seat_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_transfers_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "connect_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_transfers_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_transfers_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_transfers_source_circle_id_fkey"
            columns: ["source_circle_id"]
            isOneToOne: false
            referencedRelation: "connect_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_transfers_source_seat_id_fkey"
            columns: ["source_seat_id"]
            isOneToOne: false
            referencedRelation: "connect_circle_seats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_transfers_target_circle_id_fkey"
            columns: ["target_circle_id"]
            isOneToOne: false
            referencedRelation: "connect_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_transfers_target_seat_id_fkey"
            columns: ["target_seat_id"]
            isOneToOne: false
            referencedRelation: "connect_circle_seats"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_waitlist_entries: {
        Row: {
          admin_priority: number
          created_at: string
          fulfilled_at: string | null
          id: string
          membership_id: string
          metadata: Json
          offered_at: string | null
          preferred_circle_id: string | null
          preferred_city: string | null
          preferred_district: string | null
          preferred_state: string | null
          specialisation_id: string | null
          status: Database["public"]["Enums"]["waitlist_status"]
          updated_at: string
        }
        Insert: {
          admin_priority?: number
          created_at?: string
          fulfilled_at?: string | null
          id?: string
          membership_id: string
          metadata?: Json
          offered_at?: string | null
          preferred_circle_id?: string | null
          preferred_city?: string | null
          preferred_district?: string | null
          preferred_state?: string | null
          specialisation_id?: string | null
          status?: Database["public"]["Enums"]["waitlist_status"]
          updated_at?: string
        }
        Update: {
          admin_priority?: number
          created_at?: string
          fulfilled_at?: string | null
          id?: string
          membership_id?: string
          metadata?: Json
          offered_at?: string | null
          preferred_circle_id?: string | null
          preferred_city?: string | null
          preferred_district?: string | null
          preferred_state?: string | null
          specialisation_id?: string | null
          status?: Database["public"]["Enums"]["waitlist_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_waitlist_entries_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "connect_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_waitlist_entries_preferred_circle_id_fkey"
            columns: ["preferred_circle_id"]
            isOneToOne: false
            referencedRelation: "connect_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_waitlist_entries_specialisation_id_fkey"
            columns: ["specialisation_id"]
            isOneToOne: false
            referencedRelation: "business_specialisations"
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
      connect_bdp_circle_assignments: {
        Row: {
          assigned_by: string | null
          circle_id: string
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          metadata: Json
          reason: string | null
          status: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          circle_id: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          metadata?: Json
          reason?: string | null
          status?: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          circle_id?: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          metadata?: Json
          reason?: string | null
          status?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connect_bdp_circle_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_circle_assignments_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "connect_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_circle_assignments_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "connect_bdp_units"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_bdp_city_assignments: {
        Row: {
          assigned_by: string | null
          city_config_id: string
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          metadata: Json
          status: string
          unit_id: string
          updated_at: string
          zone_code: string | null
        }
        Insert: {
          assigned_by?: string | null
          city_config_id: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          metadata?: Json
          status?: string
          unit_id: string
          updated_at?: string
          zone_code?: string | null
        }
        Update: {
          assigned_by?: string | null
          city_config_id?: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          metadata?: Json
          status?: string
          unit_id?: string
          updated_at?: string
          zone_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connect_bdp_city_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_city_assignments_city_config_id_fkey"
            columns: ["city_config_id"]
            isOneToOne: false
            referencedRelation: "connect_bdp_city_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_city_assignments_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "connect_bdp_units"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_bdp_city_configs: {
        Row: {
          city: string
          created_at: string
          id: string
          is_active: boolean
          max_units: number
          metadata: Json
          state: string | null
          tier: Database["public"]["Enums"]["connect_bdp_city_tier"]
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          is_active?: boolean
          max_units: number
          metadata?: Json
          state?: string | null
          tier: Database["public"]["Enums"]["connect_bdp_city_tier"]
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          is_active?: boolean
          max_units?: number
          metadata?: Json
          state?: string | null
          tier?: Database["public"]["Enums"]["connect_bdp_city_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      connect_bdp_commission_entitlements: {
        Row: {
          attribution_id: string | null
          commission_bps: number
          created_at: string
          earning_at: string
          earning_event_key: string
          gross_commission_minor: number
          gross_eligible_revenue_minor: number
          id: string
          membership_id: string | null
          metadata: Json
          rule_version: string
          state: Database["public"]["Enums"]["connect_bdp_entitlement_state"]
          unit_id: string
          updated_at: string
        }
        Insert: {
          attribution_id?: string | null
          commission_bps?: number
          created_at?: string
          earning_at?: string
          earning_event_key: string
          gross_commission_minor?: number
          gross_eligible_revenue_minor?: number
          id?: string
          membership_id?: string | null
          metadata?: Json
          rule_version?: string
          state?: Database["public"]["Enums"]["connect_bdp_entitlement_state"]
          unit_id: string
          updated_at?: string
        }
        Update: {
          attribution_id?: string | null
          commission_bps?: number
          created_at?: string
          earning_at?: string
          earning_event_key?: string
          gross_commission_minor?: number
          gross_eligible_revenue_minor?: number
          id?: string
          membership_id?: string | null
          metadata?: Json
          rule_version?: string
          state?: Database["public"]["Enums"]["connect_bdp_entitlement_state"]
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connect_bdp_commission_entitlements_attribution_id_fkey"
            columns: ["attribution_id"]
            isOneToOne: false
            referencedRelation: "connect_bdp_member_attributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_commission_entitlements_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "connect_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_commission_entitlements_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "connect_bdp_units"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_bdp_disputes: {
        Row: {
          circle_id: string | null
          created_at: string
          details: string | null
          id: string
          membership_id: string | null
          metadata: Json
          opened_by: string | null
          prm_user_id: string | null
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["connect_bdp_dispute_status"]
          subject: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          circle_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          membership_id?: string | null
          metadata?: Json
          opened_by?: string | null
          prm_user_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["connect_bdp_dispute_status"]
          subject: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          circle_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          membership_id?: string | null
          metadata?: Json
          opened_by?: string | null
          prm_user_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["connect_bdp_dispute_status"]
          subject?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connect_bdp_disputes_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "connect_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_disputes_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "connect_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_disputes_opened_by_fkey"
            columns: ["opened_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_disputes_prm_user_id_fkey"
            columns: ["prm_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_disputes_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_disputes_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "connect_bdp_units"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_bdp_handovers: {
        Row: {
          approved_by: string | null
          completed_at: string | null
          created_at: string
          effective_from: string | null
          id: string
          metadata: Json
          notes: string | null
          requested_by: string | null
          source_unit_id: string
          status: string
          target_unit_id: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string
          effective_from?: string | null
          id?: string
          metadata?: Json
          notes?: string | null
          requested_by?: string | null
          source_unit_id: string
          status?: string
          target_unit_id: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string
          effective_from?: string | null
          id?: string
          metadata?: Json
          notes?: string | null
          requested_by?: string | null
          source_unit_id?: string
          status?: string
          target_unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connect_bdp_handovers_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_handovers_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_handovers_source_unit_id_fkey"
            columns: ["source_unit_id"]
            isOneToOne: false
            referencedRelation: "connect_bdp_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_handovers_target_unit_id_fkey"
            columns: ["target_unit_id"]
            isOneToOne: false
            referencedRelation: "connect_bdp_units"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_bdp_member_attributions: {
        Row: {
          approved_by: string | null
          basis: string | null
          bdp_user_id: string | null
          created_at: string
          created_by: string | null
          effective_from: string | null
          effective_to: string | null
          id: string
          is_correction: boolean
          membership_id: string
          metadata: Json
          provenance: string
          reason: string | null
          status: Database["public"]["Enums"]["connect_attribution_status"]
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          basis?: string | null
          bdp_user_id?: string | null
          created_at?: string
          created_by?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_correction?: boolean
          membership_id: string
          metadata?: Json
          provenance?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["connect_attribution_status"]
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          basis?: string | null
          bdp_user_id?: string | null
          created_at?: string
          created_by?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_correction?: boolean
          membership_id?: string
          metadata?: Json
          provenance?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["connect_attribution_status"]
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connect_bdp_member_attributions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_member_attributions_bdp_user_id_fkey"
            columns: ["bdp_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_member_attributions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_member_attributions_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "connect_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_member_attributions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "connect_bdp_units"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_bdp_recovery_entries: {
        Row: {
          actor_user_id: string | null
          created_at: string
          cycle_key: string
          entitlement_id: string | null
          id: string
          metadata: Json
          reason: string | null
          recovered_minor: number
          remaining_after_minor: number
          unit_id: string
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          cycle_key: string
          entitlement_id?: string | null
          id?: string
          metadata?: Json
          reason?: string | null
          recovered_minor: number
          remaining_after_minor: number
          unit_id: string
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          cycle_key?: string
          entitlement_id?: string | null
          id?: string
          metadata?: Json
          reason?: string | null
          recovered_minor?: number
          remaining_after_minor?: number
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connect_bdp_recovery_entries_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_recovery_entries_entitlement_id_fkey"
            columns: ["entitlement_id"]
            isOneToOne: false
            referencedRelation: "connect_bdp_commission_entitlements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_recovery_entries_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "connect_bdp_units"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_bdp_target_credits: {
        Row: {
          circle_activation_event_id: string
          circle_id: string
          created_at: string
          credited_at: string
          id: string
          metadata: Json
          unit_id: string
        }
        Insert: {
          circle_activation_event_id: string
          circle_id: string
          created_at?: string
          credited_at?: string
          id?: string
          metadata?: Json
          unit_id: string
        }
        Update: {
          circle_activation_event_id?: string
          circle_id?: string
          created_at?: string
          credited_at?: string
          id?: string
          metadata?: Json
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connect_bdp_target_credits_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: true
            referencedRelation: "connect_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_target_credits_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "connect_bdp_units"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_bdp_units: {
        Row: {
          activated_at: string | null
          active_portfolio_count: number
          application_status: Database["public"]["Enums"]["connect_bdp_application_status"]
          circles_capacity_max: number
          created_at: string
          credited_circles_count: number
          id: string
          initial_payment_minor: number
          kyc_case_id: string | null
          maintenance_compliant: boolean
          metadata: Json
          offline_approved_by: string | null
          offline_payment_ref: string | null
          offline_recorded_by: string | null
          package_option: Database["public"]["Enums"]["connect_bdp_package_option"]
          package_total_minor: number
          payment_intent_id: string | null
          pricing_rule_version: string
          recoverable_balance_minor: number
          recovered_to_date_minor: number
          remaining_recoverable_minor: number
          role_assignment_id: string | null
          suspended_at: string | null
          target_achieved_at: string | null
          target_circles: number
          target_start_at: string | null
          target_window_months: number
          terminated_at: string | null
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          active_portfolio_count?: number
          application_status?: Database["public"]["Enums"]["connect_bdp_application_status"]
          circles_capacity_max?: number
          created_at?: string
          credited_circles_count?: number
          id?: string
          initial_payment_minor?: number
          kyc_case_id?: string | null
          maintenance_compliant?: boolean
          metadata?: Json
          offline_approved_by?: string | null
          offline_payment_ref?: string | null
          offline_recorded_by?: string | null
          package_option?: Database["public"]["Enums"]["connect_bdp_package_option"]
          package_total_minor: number
          payment_intent_id?: string | null
          pricing_rule_version?: string
          recoverable_balance_minor?: number
          recovered_to_date_minor?: number
          remaining_recoverable_minor?: number
          role_assignment_id?: string | null
          suspended_at?: string | null
          target_achieved_at?: string | null
          target_circles?: number
          target_start_at?: string | null
          target_window_months?: number
          terminated_at?: string | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activated_at?: string | null
          active_portfolio_count?: number
          application_status?: Database["public"]["Enums"]["connect_bdp_application_status"]
          circles_capacity_max?: number
          created_at?: string
          credited_circles_count?: number
          id?: string
          initial_payment_minor?: number
          kyc_case_id?: string | null
          maintenance_compliant?: boolean
          metadata?: Json
          offline_approved_by?: string | null
          offline_payment_ref?: string | null
          offline_recorded_by?: string | null
          package_option?: Database["public"]["Enums"]["connect_bdp_package_option"]
          package_total_minor?: number
          payment_intent_id?: string | null
          pricing_rule_version?: string
          recoverable_balance_minor?: number
          recovered_to_date_minor?: number
          remaining_recoverable_minor?: number
          role_assignment_id?: string | null
          suspended_at?: string | null
          target_achieved_at?: string | null
          target_circles?: number
          target_start_at?: string | null
          target_window_months?: number
          terminated_at?: string | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connect_bdp_units_kyc_case_id_fkey"
            columns: ["kyc_case_id"]
            isOneToOne: false
            referencedRelation: "kyc_verification_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_units_offline_approved_by_fkey"
            columns: ["offline_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_units_offline_recorded_by_fkey"
            columns: ["offline_recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_units_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_units_role_assignment_id_fkey"
            columns: ["role_assignment_id"]
            isOneToOne: false
            referencedRelation: "role_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_bdp_units_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_circle_events: {
        Row: {
          active_seat_count: number | null
          actor_user_id: string | null
          circle_id: string
          created_at: string
          event_type: string
          from_constitution:
            | Database["public"]["Enums"]["circle_constitution_status"]
            | null
          from_lifecycle:
            | Database["public"]["Enums"]["circle_lifecycle_status"]
            | null
          id: string
          metadata: Json
          reason: string | null
          to_constitution:
            | Database["public"]["Enums"]["circle_constitution_status"]
            | null
          to_lifecycle:
            | Database["public"]["Enums"]["circle_lifecycle_status"]
            | null
        }
        Insert: {
          active_seat_count?: number | null
          actor_user_id?: string | null
          circle_id: string
          created_at?: string
          event_type: string
          from_constitution?:
            | Database["public"]["Enums"]["circle_constitution_status"]
            | null
          from_lifecycle?:
            | Database["public"]["Enums"]["circle_lifecycle_status"]
            | null
          id?: string
          metadata?: Json
          reason?: string | null
          to_constitution?:
            | Database["public"]["Enums"]["circle_constitution_status"]
            | null
          to_lifecycle?:
            | Database["public"]["Enums"]["circle_lifecycle_status"]
            | null
        }
        Update: {
          active_seat_count?: number | null
          actor_user_id?: string | null
          circle_id?: string
          created_at?: string
          event_type?: string
          from_constitution?:
            | Database["public"]["Enums"]["circle_constitution_status"]
            | null
          from_lifecycle?:
            | Database["public"]["Enums"]["circle_lifecycle_status"]
            | null
          id?: string
          metadata?: Json
          reason?: string | null
          to_constitution?:
            | Database["public"]["Enums"]["circle_constitution_status"]
            | null
          to_lifecycle?:
            | Database["public"]["Enums"]["circle_lifecycle_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "connect_circle_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_circle_events_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "connect_circles"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_circle_seats: {
        Row: {
          allocated_at: string | null
          circle_id: string
          confirmed_at: string | null
          counts_toward_capacity: boolean
          created_at: string
          id: string
          membership_id: string | null
          metadata: Json
          released_at: string | null
          reserved_until: string | null
          specialisation_id: string | null
          status: Database["public"]["Enums"]["circle_seat_status"]
          updated_at: string
        }
        Insert: {
          allocated_at?: string | null
          circle_id: string
          confirmed_at?: string | null
          counts_toward_capacity?: boolean
          created_at?: string
          id?: string
          membership_id?: string | null
          metadata?: Json
          released_at?: string | null
          reserved_until?: string | null
          specialisation_id?: string | null
          status?: Database["public"]["Enums"]["circle_seat_status"]
          updated_at?: string
        }
        Update: {
          allocated_at?: string | null
          circle_id?: string
          confirmed_at?: string | null
          counts_toward_capacity?: boolean
          created_at?: string
          id?: string
          membership_id?: string | null
          metadata?: Json
          released_at?: string | null
          reserved_until?: string | null
          specialisation_id?: string | null
          status?: Database["public"]["Enums"]["circle_seat_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connect_circle_seats_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "connect_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_circle_seats_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "connect_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_circle_seats_specialisation_id_fkey"
            columns: ["specialisation_id"]
            isOneToOne: false
            referencedRelation: "business_specialisations"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_circles: {
        Row: {
          activated_at: string | null
          active_seat_count: number
          bdp_target_credit_event_id: string | null
          bdp_target_credit_issued_at: string | null
          capacity_max: number
          city: string
          code: string | null
          constitution_status: Database["public"]["Enums"]["circle_constitution_status"]
          created_at: string
          created_by: string | null
          district: string | null
          full_capacity_at: string | null
          id: string
          lifecycle_status: Database["public"]["Enums"]["circle_lifecycle_status"]
          locality: string | null
          metadata: Json
          name: string
          platform_activation_granted_at: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          active_seat_count?: number
          bdp_target_credit_event_id?: string | null
          bdp_target_credit_issued_at?: string | null
          capacity_max?: number
          city: string
          code?: string | null
          constitution_status?: Database["public"]["Enums"]["circle_constitution_status"]
          created_at?: string
          created_by?: string | null
          district?: string | null
          full_capacity_at?: string | null
          id?: string
          lifecycle_status?: Database["public"]["Enums"]["circle_lifecycle_status"]
          locality?: string | null
          metadata?: Json
          name: string
          platform_activation_granted_at?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          active_seat_count?: number
          bdp_target_credit_event_id?: string | null
          bdp_target_credit_issued_at?: string | null
          capacity_max?: number
          city?: string
          code?: string | null
          constitution_status?: Database["public"]["Enums"]["circle_constitution_status"]
          created_at?: string
          created_by?: string | null
          district?: string | null
          full_capacity_at?: string | null
          id?: string
          lifecycle_status?: Database["public"]["Enums"]["circle_lifecycle_status"]
          locality?: string | null
          metadata?: Json
          name?: string
          platform_activation_granted_at?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connect_circles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_membership_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          event_type: string
          from_allocation:
            | Database["public"]["Enums"]["membership_allocation_status"]
            | null
          from_status: Database["public"]["Enums"]["membership_status"] | null
          id: string
          membership_id: string
          metadata: Json
          reason: string | null
          to_allocation:
            | Database["public"]["Enums"]["membership_allocation_status"]
            | null
          to_status: Database["public"]["Enums"]["membership_status"] | null
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          from_allocation?:
            | Database["public"]["Enums"]["membership_allocation_status"]
            | null
          from_status?: Database["public"]["Enums"]["membership_status"] | null
          id?: string
          membership_id: string
          metadata?: Json
          reason?: string | null
          to_allocation?:
            | Database["public"]["Enums"]["membership_allocation_status"]
            | null
          to_status?: Database["public"]["Enums"]["membership_status"] | null
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          from_allocation?:
            | Database["public"]["Enums"]["membership_allocation_status"]
            | null
          from_status?: Database["public"]["Enums"]["membership_status"] | null
          id?: string
          membership_id?: string
          metadata?: Json
          reason?: string | null
          to_allocation?:
            | Database["public"]["Enums"]["membership_allocation_status"]
            | null
          to_status?: Database["public"]["Enums"]["membership_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "connect_membership_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_membership_events_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "connect_memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_memberships: {
        Row: {
          activated_at: string | null
          allocation_status: Database["public"]["Enums"]["membership_allocation_status"]
          attribution_provenance: string | null
          connect_bdp_attribution_id: string | null
          connect_bdp_user_id: string | null
          created_at: string
          ends_at: string | null
          frozen_until: string | null
          grace_ends_at: string | null
          id: string
          kyc_case_id: string | null
          metadata: Json
          organisation_id: string | null
          payment_intent_id: string | null
          plan_id: string
          preferred_city: string | null
          preferred_district: string | null
          preferred_locality: string | null
          preferred_state: string | null
          pricing_rule_version: string
          specialisation_id: string | null
          starts_at: string | null
          status: Database["public"]["Enums"]["membership_status"]
          suspend_reason: string | null
          suspended_at: string | null
          suspended_by: string | null
          terminate_reason: string | null
          terminated_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          allocation_status?: Database["public"]["Enums"]["membership_allocation_status"]
          attribution_provenance?: string | null
          connect_bdp_attribution_id?: string | null
          connect_bdp_user_id?: string | null
          created_at?: string
          ends_at?: string | null
          frozen_until?: string | null
          grace_ends_at?: string | null
          id?: string
          kyc_case_id?: string | null
          metadata?: Json
          organisation_id?: string | null
          payment_intent_id?: string | null
          plan_id: string
          preferred_city?: string | null
          preferred_district?: string | null
          preferred_locality?: string | null
          preferred_state?: string | null
          pricing_rule_version?: string
          specialisation_id?: string | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["membership_status"]
          suspend_reason?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          terminate_reason?: string | null
          terminated_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activated_at?: string | null
          allocation_status?: Database["public"]["Enums"]["membership_allocation_status"]
          attribution_provenance?: string | null
          connect_bdp_attribution_id?: string | null
          connect_bdp_user_id?: string | null
          created_at?: string
          ends_at?: string | null
          frozen_until?: string | null
          grace_ends_at?: string | null
          id?: string
          kyc_case_id?: string | null
          metadata?: Json
          organisation_id?: string | null
          payment_intent_id?: string | null
          plan_id?: string
          preferred_city?: string | null
          preferred_district?: string | null
          preferred_locality?: string | null
          preferred_state?: string | null
          pricing_rule_version?: string
          specialisation_id?: string | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["membership_status"]
          suspend_reason?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          terminate_reason?: string | null
          terminated_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connect_memberships_connect_bdp_user_id_fkey"
            columns: ["connect_bdp_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_memberships_kyc_case_id_fkey"
            columns: ["kyc_case_id"]
            isOneToOne: false
            referencedRelation: "kyc_verification_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_memberships_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_memberships_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_memberships_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_memberships_specialisation_id_fkey"
            columns: ["specialisation_id"]
            isOneToOne: false
            referencedRelation: "business_specialisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_memberships_suspended_by_fkey"
            columns: ["suspended_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_access_grants: {
        Row: {
          approved_by: string | null
          created_at: string
          effective_from: string | null
          effective_to: string | null
          grantee_user_id: string
          id: string
          metadata: Json
          reason: string
          revoked_by: string | null
          status: Database["public"]["Enums"]["emergency_access_status"]
          ticket_ref: string | null
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          effective_from?: string | null
          effective_to?: string | null
          grantee_user_id: string
          id?: string
          metadata?: Json
          reason: string
          revoked_by?: string | null
          status?: Database["public"]["Enums"]["emergency_access_status"]
          ticket_ref?: string | null
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          effective_from?: string | null
          effective_to?: string | null
          grantee_user_id?: string
          id?: string
          metadata?: Json
          reason?: string
          revoked_by?: string | null
          status?: Database["public"]["Enums"]["emergency_access_status"]
          ticket_ref?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_access_grants_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_access_grants_grantee_user_id_fkey"
            columns: ["grantee_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_access_grants_revoked_by_fkey"
            columns: ["revoked_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_access_uses: {
        Row: {
          action: string
          actor_user_id: string
          correlation_id: string | null
          created_at: string
          grant_id: string
          id: string
          metadata: Json
          reason: string
          resource_id: string | null
          resource_type: string | null
        }
        Insert: {
          action: string
          actor_user_id: string
          correlation_id?: string | null
          created_at?: string
          grant_id: string
          id?: string
          metadata?: Json
          reason: string
          resource_id?: string | null
          resource_type?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string
          correlation_id?: string | null
          created_at?: string
          grant_id?: string
          id?: string
          metadata?: Json
          reason?: string
          resource_id?: string | null
          resource_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_access_uses_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_access_uses_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "emergency_access_grants"
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
      identity_suspensions: {
        Row: {
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          lifted_at: string | null
          lifted_by: string | null
          metadata: Json
          reason: string
          status: Database["public"]["Enums"]["identity_suspension_status"]
          suspended_by: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          lifted_at?: string | null
          lifted_by?: string | null
          metadata?: Json
          reason: string
          status?: Database["public"]["Enums"]["identity_suspension_status"]
          suspended_by?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          lifted_at?: string | null
          lifted_by?: string | null
          metadata?: Json
          reason?: string
          status?: Database["public"]["Enums"]["identity_suspension_status"]
          suspended_by?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "identity_suspensions_lifted_by_fkey"
            columns: ["lifted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "identity_suspensions_suspended_by_fkey"
            columns: ["suspended_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "identity_suspensions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_verification_cases: {
        Row: {
          aadhaar_used: boolean
          cleared_at: string | null
          created_at: string
          evidence_refs: Json
          expires_at: string | null
          id: string
          metadata: Json
          purpose: Database["public"]["Enums"]["kyc_purpose"]
          reason: string | null
          reviewer_user_id: string | null
          status: Database["public"]["Enums"]["kyc_case_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          aadhaar_used?: boolean
          cleared_at?: string | null
          created_at?: string
          evidence_refs?: Json
          expires_at?: string | null
          id?: string
          metadata?: Json
          purpose?: Database["public"]["Enums"]["kyc_purpose"]
          reason?: string | null
          reviewer_user_id?: string | null
          status?: Database["public"]["Enums"]["kyc_case_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          aadhaar_used?: boolean
          cleared_at?: string | null
          created_at?: string
          evidence_refs?: Json
          expires_at?: string | null
          id?: string
          metadata?: Json
          purpose?: Database["public"]["Enums"]["kyc_purpose"]
          reason?: string | null
          reviewer_user_id?: string | null
          status?: Database["public"]["Enums"]["kyc_case_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_verification_cases_reviewer_user_id_fkey"
            columns: ["reviewer_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_verification_cases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      legacy_connect_bdp_migration_map: {
        Row: {
          canonical_role_key: Database["public"]["Enums"]["gce_role_key"] | null
          created_at: string
          grants_entitlement: boolean
          id: string
          legacy_role: string
          mapping_status: Database["public"]["Enums"]["legacy_connect_bdp_map_status"]
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
          mapping_status?: Database["public"]["Enums"]["legacy_connect_bdp_map_status"]
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
          mapping_status?: Database["public"]["Enums"]["legacy_connect_bdp_map_status"]
          notes?: string | null
        }
        Relationships: []
      }
      legacy_membership_migration_map: {
        Row: {
          canonical_plan_key:
            | Database["public"]["Enums"]["membership_plan_key"]
            | null
          created_at: string
          grants_new_purchase: boolean
          id: string
          legacy_plan: string
          mapping_status: Database["public"]["Enums"]["legacy_membership_map_status"]
          notes: string | null
        }
        Insert: {
          canonical_plan_key?:
            | Database["public"]["Enums"]["membership_plan_key"]
            | null
          created_at?: string
          grants_new_purchase?: boolean
          id?: string
          legacy_plan: string
          mapping_status?: Database["public"]["Enums"]["legacy_membership_map_status"]
          notes?: string | null
        }
        Update: {
          canonical_plan_key?:
            | Database["public"]["Enums"]["membership_plan_key"]
            | null
          created_at?: string
          grants_new_purchase?: boolean
          id?: string
          legacy_plan?: string
          mapping_status?: Database["public"]["Enums"]["legacy_membership_map_status"]
          notes?: string | null
        }
        Relationships: []
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
      membership_plans: {
        Row: {
          billing_cadence: string
          created_at: string
          currency: string
          id: string
          included_tag_slots: number
          is_active: boolean
          is_purchasable: boolean
          label: string
          max_tag_slots: number
          metadata: Json
          plan_key: Database["public"]["Enums"]["membership_plan_key"]
          price_minor: number
          updated_at: string
        }
        Insert: {
          billing_cadence?: string
          created_at?: string
          currency?: string
          id?: string
          included_tag_slots?: number
          is_active?: boolean
          is_purchasable?: boolean
          label: string
          max_tag_slots?: number
          metadata?: Json
          plan_key: Database["public"]["Enums"]["membership_plan_key"]
          price_minor: number
          updated_at?: string
        }
        Update: {
          billing_cadence?: string
          created_at?: string
          currency?: string
          id?: string
          included_tag_slots?: number
          is_active?: boolean
          is_purchasable?: boolean
          label?: string
          max_tag_slots?: number
          metadata?: Json
          plan_key?: Database["public"]["Enums"]["membership_plan_key"]
          price_minor?: number
          updated_at?: string
        }
        Relationships: []
      }
      membership_tags: {
        Row: {
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          is_included: boolean
          membership_id: string
          metadata: Json
          pricing_rule_version: string
          status: string
          surcharge_bps: number
          surcharge_minor: number
          tag_key: string
          tag_label: string
          tag_slot: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_included?: boolean
          membership_id: string
          metadata?: Json
          pricing_rule_version?: string
          status?: string
          surcharge_bps?: number
          surcharge_minor?: number
          tag_key: string
          tag_label: string
          tag_slot: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_included?: boolean
          membership_id?: string
          metadata?: Json
          pricing_rule_version?: string
          status?: string
          surcharge_bps?: number
          surcharge_minor?: number
          tag_key?: string
          tag_label?: string
          tag_slot?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_tags_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "connect_memberships"
            referencedColumns: ["id"]
          },
        ]
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
          approval_reason: string | null
          approved_at: string | null
          approved_by: string | null
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
          suspend_reason: string | null
          suspended_at: string | null
          suspended_by: string | null
          terminate_reason: string | null
          terminated_at: string | null
          terminated_by: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approval_reason?: string | null
          approved_at?: string | null
          approved_by?: string | null
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
          suspend_reason?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          terminate_reason?: string | null
          terminated_at?: string | null
          terminated_by?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approval_reason?: string | null
          approved_at?: string | null
          approved_by?: string | null
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
          suspend_reason?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          terminate_reason?: string | null
          terminated_at?: string | null
          terminated_by?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_assignments_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "role_assignments_suspended_by_fkey"
            columns: ["suspended_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_assignments_terminated_by_fkey"
            columns: ["terminated_by"]
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
      gce_circle_statuses_for_count: {
        Args: { p_count: number }
        Returns: {
          constitution: Database["public"]["Enums"]["circle_constitution_status"]
          lifecycle: Database["public"]["Enums"]["circle_lifecycle_status"]
        }[]
      }
      gce_confirm_circle_seat: {
        Args: { p_actor?: string; p_seat_id: string }
        Returns: {
          allocated_at: string | null
          circle_id: string
          confirmed_at: string | null
          counts_toward_capacity: boolean
          created_at: string
          id: string
          membership_id: string | null
          metadata: Json
          released_at: string | null
          reserved_until: string | null
          specialisation_id: string | null
          status: Database["public"]["Enums"]["circle_seat_status"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "connect_circle_seats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      gce_connect_bdp_apply_recovery: {
        Args: {
          p_actor?: string
          p_cycle_key: string
          p_entitlement_id: string
          p_unit_id: string
        }
        Returns: {
          actor_user_id: string | null
          created_at: string
          cycle_key: string
          entitlement_id: string | null
          id: string
          metadata: Json
          reason: string | null
          recovered_minor: number
          remaining_after_minor: number
          unit_id: string
        }
        SetofOptions: {
          from: "*"
          to: "connect_bdp_recovery_entries"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      gce_connect_bdp_credit_circle_activation: {
        Args: { p_actor?: string; p_circle_id: string }
        Returns: {
          circle_activation_event_id: string
          circle_id: string
          created_at: string
          credited_at: string
          id: string
          metadata: Json
          unit_id: string
        }
        SetofOptions: {
          from: "*"
          to: "connect_bdp_target_credits"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      gce_connect_bdp_refresh_portfolio_counts: {
        Args: { p_unit_id: string }
        Returns: {
          activated_at: string | null
          active_portfolio_count: number
          application_status: Database["public"]["Enums"]["connect_bdp_application_status"]
          circles_capacity_max: number
          created_at: string
          credited_circles_count: number
          id: string
          initial_payment_minor: number
          kyc_case_id: string | null
          maintenance_compliant: boolean
          metadata: Json
          offline_approved_by: string | null
          offline_payment_ref: string | null
          offline_recorded_by: string | null
          package_option: Database["public"]["Enums"]["connect_bdp_package_option"]
          package_total_minor: number
          payment_intent_id: string | null
          pricing_rule_version: string
          recoverable_balance_minor: number
          recovered_to_date_minor: number
          remaining_recoverable_minor: number
          role_assignment_id: string | null
          suspended_at: string | null
          target_achieved_at: string | null
          target_circles: number
          target_start_at: string | null
          target_window_months: number
          terminated_at: string | null
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "connect_bdp_units"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      gce_current_user_id: { Args: never; Returns: string }
      gce_has_active_assignment: {
        Args: {
          p_role?: Database["public"]["Enums"]["gce_role_key"]
          p_scope_id?: string
          p_scope_type?: Database["public"]["Enums"]["assignment_scope_type"]
        }
        Returns: boolean
      }
      gce_has_active_emergency_access: {
        Args: { p_user_id?: string }
        Returns: boolean
      }
      gce_is_connect_bdp_owner: {
        Args: { p_unit_id: string }
        Returns: boolean
      }
      gce_is_identity_suspended: {
        Args: { p_user_id?: string }
        Returns: boolean
      }
      gce_is_org_member: {
        Args: { p_organisation_id: string }
        Returns: boolean
      }
      gce_is_platform_admin: { Args: never; Returns: boolean }
      gce_refresh_circle_capacity: {
        Args: { p_actor?: string; p_circle_id: string }
        Returns: {
          activated_at: string | null
          active_seat_count: number
          bdp_target_credit_event_id: string | null
          bdp_target_credit_issued_at: string | null
          capacity_max: number
          city: string
          code: string | null
          constitution_status: Database["public"]["Enums"]["circle_constitution_status"]
          created_at: string
          created_by: string | null
          district: string | null
          full_capacity_at: string | null
          id: string
          lifecycle_status: Database["public"]["Enums"]["circle_lifecycle_status"]
          locality: string | null
          metadata: Json
          name: string
          platform_activation_granted_at: string | null
          state: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "connect_circles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      allocation_proposal_status:
        | "proposed"
        | "accepted"
        | "rejected"
        | "confirmed"
        | "expired"
        | "cancelled"
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
        | "terminated"
      background_job_status:
        | "pending"
        | "leased"
        | "running"
        | "succeeded"
        | "failed"
        | "dead_letter"
      circle_constitution_status:
        | "formation_circle"
        | "provisionally_active_circle"
        | "fully_constituted_circle"
      circle_lifecycle_status:
        | "draft"
        | "formation"
        | "pending_activation"
        | "active_growth"
        | "full_capacity"
        | "mature"
        | "under_review"
        | "suspended"
        | "merged"
        | "archived"
      circle_seat_status:
        | "available"
        | "reserved"
        | "waitlisted"
        | "pending_verification"
        | "allocated"
        | "protected_grace"
        | "transfer_pending"
        | "released"
        | "blocked"
      circle_transfer_status:
        | "requested"
        | "under_review"
        | "approved"
        | "rejected"
        | "completed"
        | "cancelled"
      connect_attribution_status:
        | "unattributed"
        | "proposed"
        | "pending_evidence"
        | "active"
        | "disputed"
        | "suspended"
        | "reassigned_closed"
        | "voided"
      connect_bdp_application_status:
        | "draft"
        | "submitted"
        | "pending_verification"
        | "pending_payment"
        | "pending_approval"
        | "active"
        | "rejected"
        | "suspended"
        | "terminated"
        | "archived"
      connect_bdp_city_tier: "tier_1" | "tier_2" | "tier_3"
      connect_bdp_dispute_status:
        | "open"
        | "bdp_first_level"
        | "escalated_prm"
        | "under_review"
        | "resolved"
        | "closed"
      connect_bdp_entitlement_state:
        | "estimated"
        | "provisional"
        | "earned"
        | "on_hold"
        | "settlement_eligible"
        | "paid"
        | "reversed"
      connect_bdp_package_option: "direct_50000" | "finance_recovery_60000"
      emergency_access_status:
        | "requested"
        | "active"
        | "revoked"
        | "expired"
        | "denied"
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
        | "enterprise_platform_expert"
        | "opportunity_desk"
      identity_suspension_status: "active" | "lifted" | "expired"
      kyc_case_status:
        | "not_started"
        | "in_progress"
        | "additional_info_required"
        | "under_review"
        | "conditionally_cleared"
        | "cleared"
        | "failed"
        | "expired"
        | "revoked"
        | "waived"
      kyc_purpose: "membership" | "seat" | "role_assignment" | "venue" | "other"
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
      legacy_connect_bdp_map_status:
        | "mapped"
        | "historical_only"
        | "ambiguous"
        | "needs_review"
      legacy_membership_map_status:
        | "mapped"
        | "historical_only"
        | "ambiguous"
        | "needs_review"
      membership_allocation_status:
        | "unallocated"
        | "pending_allocation"
        | "allocated"
        | "waitlisted"
      membership_plan_key: "associate" | "core_future_inactive"
      membership_status:
        | "draft"
        | "applied"
        | "pending_payment"
        | "pending_verification"
        | "pending_approval"
        | "active"
        | "grace_period"
        | "frozen"
        | "restricted"
        | "suspended"
        | "expired"
        | "terminated"
        | "rejoining_review"
        | "archived"
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
      waitlist_status:
        | "active"
        | "offered"
        | "fulfilled"
        | "withdrawn"
        | "expired"
        | "removed"
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
      allocation_proposal_status: [
        "proposed",
        "accepted",
        "rejected",
        "confirmed",
        "expired",
        "cancelled",
      ],
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
        "terminated",
      ],
      background_job_status: [
        "pending",
        "leased",
        "running",
        "succeeded",
        "failed",
        "dead_letter",
      ],
      circle_constitution_status: [
        "formation_circle",
        "provisionally_active_circle",
        "fully_constituted_circle",
      ],
      circle_lifecycle_status: [
        "draft",
        "formation",
        "pending_activation",
        "active_growth",
        "full_capacity",
        "mature",
        "under_review",
        "suspended",
        "merged",
        "archived",
      ],
      circle_seat_status: [
        "available",
        "reserved",
        "waitlisted",
        "pending_verification",
        "allocated",
        "protected_grace",
        "transfer_pending",
        "released",
        "blocked",
      ],
      circle_transfer_status: [
        "requested",
        "under_review",
        "approved",
        "rejected",
        "completed",
        "cancelled",
      ],
      connect_attribution_status: [
        "unattributed",
        "proposed",
        "pending_evidence",
        "active",
        "disputed",
        "suspended",
        "reassigned_closed",
        "voided",
      ],
      connect_bdp_application_status: [
        "draft",
        "submitted",
        "pending_verification",
        "pending_payment",
        "pending_approval",
        "active",
        "rejected",
        "suspended",
        "terminated",
        "archived",
      ],
      connect_bdp_city_tier: ["tier_1", "tier_2", "tier_3"],
      connect_bdp_dispute_status: [
        "open",
        "bdp_first_level",
        "escalated_prm",
        "under_review",
        "resolved",
        "closed",
      ],
      connect_bdp_entitlement_state: [
        "estimated",
        "provisional",
        "earned",
        "on_hold",
        "settlement_eligible",
        "paid",
        "reversed",
      ],
      connect_bdp_package_option: ["direct_50000", "finance_recovery_60000"],
      emergency_access_status: [
        "requested",
        "active",
        "revoked",
        "expired",
        "denied",
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
        "enterprise_platform_expert",
        "opportunity_desk",
      ],
      identity_suspension_status: ["active", "lifted", "expired"],
      kyc_case_status: [
        "not_started",
        "in_progress",
        "additional_info_required",
        "under_review",
        "conditionally_cleared",
        "cleared",
        "failed",
        "expired",
        "revoked",
        "waived",
      ],
      kyc_purpose: ["membership", "seat", "role_assignment", "venue", "other"],
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
      legacy_connect_bdp_map_status: [
        "mapped",
        "historical_only",
        "ambiguous",
        "needs_review",
      ],
      legacy_membership_map_status: [
        "mapped",
        "historical_only",
        "ambiguous",
        "needs_review",
      ],
      membership_allocation_status: [
        "unallocated",
        "pending_allocation",
        "allocated",
        "waitlisted",
      ],
      membership_plan_key: ["associate", "core_future_inactive"],
      membership_status: [
        "draft",
        "applied",
        "pending_payment",
        "pending_verification",
        "pending_approval",
        "active",
        "grace_period",
        "frozen",
        "restricted",
        "suspended",
        "expired",
        "terminated",
        "rejoining_review",
        "archived",
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
      waitlist_status: [
        "active",
        "offered",
        "fulfilled",
        "withdrawn",
        "expired",
        "removed",
      ],
    },
  },
} as const

