/**
 * Generated Database types from gce-dev (Phase 12).
 * Do not hand-edit; regenerate via Supabase MCP generate_typescript_types.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      analytics_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          event_family: string
          event_name: string
          id: string
          idempotency_key: string
          occurred_at: string
          organisation_id: string | null
          payload: Json
          schema_version: number
          source_domain: string | null
          source_event_id: string | null
          subject_id: string | null
          subject_type: string | null
          vertical: string | null
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          event_family: string
          event_name: string
          id?: string
          idempotency_key: string
          occurred_at?: string
          organisation_id?: string | null
          payload?: Json
          schema_version?: number
          source_domain?: string | null
          source_event_id?: string | null
          subject_id?: string | null
          subject_type?: string | null
          vertical?: string | null
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          event_family?: string
          event_name?: string
          id?: string
          idempotency_key?: string
          occurred_at?: string
          organisation_id?: string | null
          payload?: Json
          schema_version?: number
          source_domain?: string | null
          source_event_id?: string | null
          subject_id?: string | null
          subject_type?: string | null
          vertical?: string | null
        }
        Relationships: []
      }
      analytics_kpi_snapshots: {
        Row: {
          computed_at: string
          formula_status: string
          id: string
          kpi_key: string
          period_end: string
          period_start: string
          value_json: Json
          value_numeric: number | null
        }
        Insert: {
          computed_at?: string
          formula_status?: string
          id?: string
          kpi_key: string
          period_end: string
          period_start: string
          value_json?: Json
          value_numeric?: number | null
        }
        Update: {
          computed_at?: string
          formula_status?: string
          id?: string
          kpi_key?: string
          period_end?: string
          period_start?: string
          value_json?: Json
          value_numeric?: number | null
        }
        Relationships: []
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
      assist_closed_business_confirmations: {
        Row: {
          amount_minor: number
          created_at: string
          id: string
          lead_id: string
          notes: string | null
          outcome_id: string
          party: string
          party_user_id: string
        }
        Insert: {
          amount_minor: number
          created_at?: string
          id?: string
          lead_id: string
          notes?: string | null
          outcome_id: string
          party: string
          party_user_id: string
        }
        Update: {
          amount_minor?: number
          created_at?: string
          id?: string
          lead_id?: string
          notes?: string | null
          outcome_id?: string
          party?: string
          party_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assist_closed_business_confirmations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_closed_business_confirmations_outcome_id_fkey"
            columns: ["outcome_id"]
            isOneToOne: false
            referencedRelation: "assist_lead_outcomes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_closed_business_confirmations_party_user_id_fkey"
            columns: ["party_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_contact_reveal_events: {
        Row: {
          assignment_id: string | null
          created_at: string
          fields_revealed: string[]
          id: string
          lead_id: string
          reason: string | null
          viewer_user_id: string
        }
        Insert: {
          assignment_id?: string | null
          created_at?: string
          fields_revealed?: string[]
          id?: string
          lead_id: string
          reason?: string | null
          viewer_user_id: string
        }
        Update: {
          assignment_id?: string | null
          created_at?: string
          fields_revealed?: string[]
          id?: string
          lead_id?: string
          reason?: string | null
          viewer_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assist_contact_reveal_events_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assist_lead_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_contact_reveal_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_contact_reveal_events_viewer_user_id_fkey"
            columns: ["viewer_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_domain_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          lead_id: string | null
          payload: Json
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          lead_id?: string | null
          payload?: Json
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          lead_id?: string | null
          payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "assist_domain_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_domain_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_lead_abuse_flags: {
        Row: {
          actor_user_id: string | null
          created_at: string
          created_by: string | null
          details: string | null
          flag_type: string
          id: string
          lead_id: string | null
          status: string
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          created_by?: string | null
          details?: string | null
          flag_type: string
          id?: string
          lead_id?: string | null
          status?: string
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          created_by?: string | null
          details?: string | null
          flag_type?: string
          id?: string
          lead_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "assist_lead_abuse_flags_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_abuse_flags_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_abuse_flags_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_lead_ai_classifications: {
        Row: {
          ai_run_id: string | null
          confidence_bps: number
          created_at: string
          extracted_city: string | null
          extracted_state: string | null
          final_specialisation_id: string | null
          id: string
          is_canonical: boolean
          lead_id: string
          metadata: Json
          override_reason: string | null
          ranking_reasons: string[]
          review_reason: string | null
          review_required: boolean
          reviewed_by: string | null
          suggested_specialisation_id: string | null
          suggested_tag_codes: string[]
          urgency: string | null
        }
        Insert: {
          ai_run_id?: string | null
          confidence_bps?: number
          created_at?: string
          extracted_city?: string | null
          extracted_state?: string | null
          final_specialisation_id?: string | null
          id?: string
          is_canonical?: boolean
          lead_id: string
          metadata?: Json
          override_reason?: string | null
          ranking_reasons?: string[]
          review_reason?: string | null
          review_required?: boolean
          reviewed_by?: string | null
          suggested_specialisation_id?: string | null
          suggested_tag_codes?: string[]
          urgency?: string | null
        }
        Update: {
          ai_run_id?: string | null
          confidence_bps?: number
          created_at?: string
          extracted_city?: string | null
          extracted_state?: string | null
          final_specialisation_id?: string | null
          id?: string
          is_canonical?: boolean
          lead_id?: string
          metadata?: Json
          override_reason?: string | null
          ranking_reasons?: string[]
          review_reason?: string | null
          review_required?: boolean
          reviewed_by?: string | null
          suggested_specialisation_id?: string | null
          suggested_tag_codes?: string[]
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assist_lead_ai_classifications_ai_run_id_fkey"
            columns: ["ai_run_id"]
            isOneToOne: false
            referencedRelation: "assist_lead_ai_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_ai_classifications_final_specialisation_id_fkey"
            columns: ["final_specialisation_id"]
            isOneToOne: false
            referencedRelation: "business_specialisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_ai_classifications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_ai_classifications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_ai_classifications_suggested_specialisation_id_fkey"
            columns: ["suggested_specialisation_id"]
            isOneToOne: false
            referencedRelation: "business_specialisations"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_lead_ai_runs: {
        Row: {
          confidence_bps: number
          cost_metadata: Json
          created_at: string
          error_message: string | null
          id: string
          lead_id: string
          model_id: string
          prompt_template_version: string
          provider: string
          purpose: string
          review_required: boolean
          status: string
          structured_output: Json
        }
        Insert: {
          confidence_bps?: number
          cost_metadata?: Json
          created_at?: string
          error_message?: string | null
          id?: string
          lead_id: string
          model_id?: string
          prompt_template_version?: string
          provider?: string
          purpose?: string
          review_required?: boolean
          status?: string
          structured_output?: Json
        }
        Update: {
          confidence_bps?: number
          cost_metadata?: Json
          created_at?: string
          error_message?: string | null
          id?: string
          lead_id?: string
          model_id?: string
          prompt_template_version?: string
          provider?: string
          purpose?: string
          review_required?: boolean
          status?: string
          structured_output?: Json
        }
        Relationships: [
          {
            foreignKeyName: "assist_lead_ai_runs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_lead_assignment_events: {
        Row: {
          actor_user_id: string | null
          assignment_id: string
          created_at: string
          from_status:
            | Database["public"]["Enums"]["assist_assignment_status"]
            | null
          id: string
          lead_id: string
          reason: string | null
          to_status: Database["public"]["Enums"]["assist_assignment_status"]
        }
        Insert: {
          actor_user_id?: string | null
          assignment_id: string
          created_at?: string
          from_status?:
            | Database["public"]["Enums"]["assist_assignment_status"]
            | null
          id?: string
          lead_id: string
          reason?: string | null
          to_status: Database["public"]["Enums"]["assist_assignment_status"]
        }
        Update: {
          actor_user_id?: string | null
          assignment_id?: string
          created_at?: string
          from_status?:
            | Database["public"]["Enums"]["assist_assignment_status"]
            | null
          id?: string
          lead_id?: string
          reason?: string | null
          to_status?: Database["public"]["Enums"]["assist_assignment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "assist_lead_assignment_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_assignment_events_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assist_lead_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_assignment_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_lead_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          assignment_source: string
          created_at: string
          decline_reason: string | null
          id: string
          is_active: boolean
          lead_id: string
          metadata: Json
          receiver_circle_id: string | null
          receiver_membership_id: string | null
          receiver_user_id: string
          responded_at: string | null
          status: Database["public"]["Enums"]["assist_assignment_status"]
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          assignment_source?: string
          created_at?: string
          decline_reason?: string | null
          id?: string
          is_active?: boolean
          lead_id: string
          metadata?: Json
          receiver_circle_id?: string | null
          receiver_membership_id?: string | null
          receiver_user_id: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["assist_assignment_status"]
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          assignment_source?: string
          created_at?: string
          decline_reason?: string | null
          id?: string
          is_active?: boolean
          lead_id?: string
          metadata?: Json
          receiver_circle_id?: string | null
          receiver_membership_id?: string | null
          receiver_user_id?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["assist_assignment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "assist_lead_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_assignments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_assignments_receiver_circle_id_fkey"
            columns: ["receiver_circle_id"]
            isOneToOne: false
            referencedRelation: "connect_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_assignments_receiver_membership_id_fkey"
            columns: ["receiver_membership_id"]
            isOneToOne: false
            referencedRelation: "connect_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_assignments_receiver_user_id_fkey"
            columns: ["receiver_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_lead_duplicate_flags: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          metadata: Json
          related_lead_id: string | null
          reviewed_by: string | null
          signal: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          metadata?: Json
          related_lead_id?: string | null
          reviewed_by?: string | null
          signal: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          metadata?: Json
          related_lead_id?: string | null
          reviewed_by?: string | null
          signal?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "assist_lead_duplicate_flags_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_duplicate_flags_related_lead_id_fkey"
            columns: ["related_lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_duplicate_flags_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_lead_outcomes: {
        Row: {
          confirmed_amount_minor: number | null
          confirmed_at: string | null
          created_at: string
          creates_finance_transaction: boolean
          currency: string
          declared_amount_minor: number | null
          dispute_reason: string | null
          giver_amount_minor: number | null
          giver_status: Database["public"]["Enums"]["assist_outcome_party_status"]
          giver_submitted_at: string | null
          id: string
          lead_id: string
          metadata: Json
          outcome_type: string
          receiver_amount_minor: number | null
          receiver_status: Database["public"]["Enums"]["assist_outcome_party_status"]
          receiver_submitted_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          confirmed_amount_minor?: number | null
          confirmed_at?: string | null
          created_at?: string
          creates_finance_transaction?: boolean
          currency?: string
          declared_amount_minor?: number | null
          dispute_reason?: string | null
          giver_amount_minor?: number | null
          giver_status?: Database["public"]["Enums"]["assist_outcome_party_status"]
          giver_submitted_at?: string | null
          id?: string
          lead_id: string
          metadata?: Json
          outcome_type?: string
          receiver_amount_minor?: number | null
          receiver_status?: Database["public"]["Enums"]["assist_outcome_party_status"]
          receiver_submitted_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          confirmed_amount_minor?: number | null
          confirmed_at?: string | null
          created_at?: string
          creates_finance_transaction?: boolean
          currency?: string
          declared_amount_minor?: number | null
          dispute_reason?: string | null
          giver_amount_minor?: number | null
          giver_status?: Database["public"]["Enums"]["assist_outcome_party_status"]
          giver_submitted_at?: string | null
          id?: string
          lead_id?: string
          metadata?: Json
          outcome_type?: string
          receiver_amount_minor?: number | null
          receiver_status?: Database["public"]["Enums"]["assist_outcome_party_status"]
          receiver_submitted_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assist_lead_outcomes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_lead_reassignments: {
        Row: {
          actor_user_id: string | null
          contact_access_revoked: boolean
          created_at: string
          from_assignment_id: string | null
          id: string
          lead_id: string
          reason: string
          to_assignment_id: string | null
        }
        Insert: {
          actor_user_id?: string | null
          contact_access_revoked?: boolean
          created_at?: string
          from_assignment_id?: string | null
          id?: string
          lead_id: string
          reason: string
          to_assignment_id?: string | null
        }
        Update: {
          actor_user_id?: string | null
          contact_access_revoked?: boolean
          created_at?: string
          from_assignment_id?: string | null
          id?: string
          lead_id?: string
          reason?: string
          to_assignment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assist_lead_reassignments_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_reassignments_from_assignment_id_fkey"
            columns: ["from_assignment_id"]
            isOneToOne: false
            referencedRelation: "assist_lead_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_reassignments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_reassignments_to_assignment_id_fkey"
            columns: ["to_assignment_id"]
            isOneToOne: false
            referencedRelation: "assist_lead_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_lead_requirement_versions: {
        Row: {
          actor_user_id: string | null
          budget_indication_minor: number | null
          change_reason: string | null
          city: string | null
          confidentiality_preference: string | null
          created_at: string
          district: string | null
          id: string
          lead_id: string
          metadata: Json
          requirement_details: string | null
          requirement_summary: string
          specialisation_id: string | null
          state: string | null
          tag_codes: string[]
          timeline_notes: string | null
          urgency: string | null
          version_no: number
        }
        Insert: {
          actor_user_id?: string | null
          budget_indication_minor?: number | null
          change_reason?: string | null
          city?: string | null
          confidentiality_preference?: string | null
          created_at?: string
          district?: string | null
          id?: string
          lead_id: string
          metadata?: Json
          requirement_details?: string | null
          requirement_summary: string
          specialisation_id?: string | null
          state?: string | null
          tag_codes?: string[]
          timeline_notes?: string | null
          urgency?: string | null
          version_no: number
        }
        Update: {
          actor_user_id?: string | null
          budget_indication_minor?: number | null
          change_reason?: string | null
          city?: string | null
          confidentiality_preference?: string | null
          created_at?: string
          district?: string | null
          id?: string
          lead_id?: string
          metadata?: Json
          requirement_details?: string | null
          requirement_summary?: string
          specialisation_id?: string | null
          state?: string | null
          tag_codes?: string[]
          timeline_notes?: string | null
          urgency?: string | null
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "assist_lead_requirement_versions_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_requirement_versions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_requirement_versions_specialisation_id_fkey"
            columns: ["specialisation_id"]
            isOneToOne: false
            referencedRelation: "business_specialisations"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_lead_routing_candidates: {
        Row: {
          ai_run_id: string | null
          candidate_circle_id: string | null
          candidate_membership_id: string | null
          candidate_user_id: string
          created_at: string
          eligible: boolean
          id: string
          ineligibility_reason: string | null
          lead_id: string
          match_features: Json
          ranking_reasons: string[]
          routing_tier: string
          score_bps: number
        }
        Insert: {
          ai_run_id?: string | null
          candidate_circle_id?: string | null
          candidate_membership_id?: string | null
          candidate_user_id: string
          created_at?: string
          eligible?: boolean
          id?: string
          ineligibility_reason?: string | null
          lead_id: string
          match_features?: Json
          ranking_reasons?: string[]
          routing_tier: string
          score_bps?: number
        }
        Update: {
          ai_run_id?: string | null
          candidate_circle_id?: string | null
          candidate_membership_id?: string | null
          candidate_user_id?: string
          created_at?: string
          eligible?: boolean
          id?: string
          ineligibility_reason?: string | null
          lead_id?: string
          match_features?: Json
          ranking_reasons?: string[]
          routing_tier?: string
          score_bps?: number
        }
        Relationships: [
          {
            foreignKeyName: "assist_lead_routing_candidates_ai_run_id_fkey"
            columns: ["ai_run_id"]
            isOneToOne: false
            referencedRelation: "assist_lead_ai_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_routing_candidates_candidate_circle_id_fkey"
            columns: ["candidate_circle_id"]
            isOneToOne: false
            referencedRelation: "connect_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_routing_candidates_candidate_membership_id_fkey"
            columns: ["candidate_membership_id"]
            isOneToOne: false
            referencedRelation: "connect_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_routing_candidates_candidate_user_id_fkey"
            columns: ["candidate_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_lead_routing_candidates_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_leads: {
        Row: {
          budget_indication_minor: number | null
          city: string | null
          contact_reveal_state: string
          created_at: string
          district: string | null
          expires_at: string | null
          giver_membership_id: string | null
          giver_user_id: string
          id: string
          lead_ref: string
          legacy_lead_id: string | null
          metadata: Json
          origin_circle_id: string | null
          privacy_level: Database["public"]["Enums"]["assist_privacy_level"]
          quality_status: Database["public"]["Enums"]["assist_lead_quality_status"]
          source: string
          specialisation_id: string | null
          state: string | null
          submitted_at: string | null
          title: string
          updated_at: string
          urgency: string
          work_status: Database["public"]["Enums"]["assist_lead_work_status"]
        }
        Insert: {
          budget_indication_minor?: number | null
          city?: string | null
          contact_reveal_state?: string
          created_at?: string
          district?: string | null
          expires_at?: string | null
          giver_membership_id?: string | null
          giver_user_id: string
          id?: string
          lead_ref: string
          legacy_lead_id?: string | null
          metadata?: Json
          origin_circle_id?: string | null
          privacy_level?: Database["public"]["Enums"]["assist_privacy_level"]
          quality_status?: Database["public"]["Enums"]["assist_lead_quality_status"]
          source?: string
          specialisation_id?: string | null
          state?: string | null
          submitted_at?: string | null
          title: string
          updated_at?: string
          urgency?: string
          work_status?: Database["public"]["Enums"]["assist_lead_work_status"]
        }
        Update: {
          budget_indication_minor?: number | null
          city?: string | null
          contact_reveal_state?: string
          created_at?: string
          district?: string | null
          expires_at?: string | null
          giver_membership_id?: string | null
          giver_user_id?: string
          id?: string
          lead_ref?: string
          legacy_lead_id?: string | null
          metadata?: Json
          origin_circle_id?: string | null
          privacy_level?: Database["public"]["Enums"]["assist_privacy_level"]
          quality_status?: Database["public"]["Enums"]["assist_lead_quality_status"]
          source?: string
          specialisation_id?: string | null
          state?: string | null
          submitted_at?: string | null
          title?: string
          updated_at?: string
          urgency?: string
          work_status?: Database["public"]["Enums"]["assist_lead_work_status"]
        }
        Relationships: [
          {
            foreignKeyName: "assist_leads_giver_membership_id_fkey"
            columns: ["giver_membership_id"]
            isOneToOne: false
            referencedRelation: "connect_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_leads_giver_user_id_fkey"
            columns: ["giver_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_leads_origin_circle_id_fkey"
            columns: ["origin_circle_id"]
            isOneToOne: false
            referencedRelation: "connect_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_leads_specialisation_id_fkey"
            columns: ["specialisation_id"]
            isOneToOne: false
            referencedRelation: "business_specialisations"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_opportunity_desk_queue: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          metadata: Json
          notes: string | null
          owner_user_id: string | null
          priority: string
          reason: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          metadata?: Json
          notes?: string | null
          owner_user_id?: string | null
          priority?: string
          reason: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          metadata?: Json
          notes?: string | null
          owner_user_id?: string | null
          priority?: string
          reason?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assist_opportunity_desk_queue_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "assist_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_opportunity_desk_queue_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assist_opportunity_desk_queue_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      chargeback_cases: {
        Row: {
          amount_minor: number
          created_at: string
          id: string
          metadata: Json
          outcome: string | null
          payment_intent_id: string | null
          provider_dispute_ref: string
          provisional_hold_id: string | null
          revenue_component_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount_minor: number
          created_at?: string
          id?: string
          metadata?: Json
          outcome?: string | null
          payment_intent_id?: string | null
          provider_dispute_ref: string
          provisional_hold_id?: string | null
          revenue_component_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount_minor?: number
          created_at?: string
          id?: string
          metadata?: Json
          outcome?: string | null
          payment_intent_id?: string | null
          provider_dispute_ref?: string
          provisional_hold_id?: string | null
          revenue_component_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chargeback_cases_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chargeback_cases_provisional_hold_id_fkey"
            columns: ["provisional_hold_id"]
            isOneToOne: false
            referencedRelation: "financial_holds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chargeback_cases_revenue_component_id_fkey"
            columns: ["revenue_component_id"]
            isOneToOne: false
            referencedRelation: "revenue_components"
            referencedColumns: ["id"]
          },
        ]
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
      compliance_holds: {
        Row: {
          created_at: string
          created_by: string
          id: string
          metadata: Json
          reason: string
          release_conditions: string | null
          released_at: string | null
          released_by: string | null
          scope: string
          started_at: string
          status: string
          subject_id: string
          subject_type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          metadata?: Json
          reason: string
          release_conditions?: string | null
          released_at?: string | null
          released_by?: string | null
          scope?: string
          started_at?: string
          status?: string
          subject_id: string
          subject_type: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          metadata?: Json
          reason?: string
          release_conditions?: string | null
          released_at?: string | null
          released_by?: string | null
          scope?: string
          started_at?: string
          status?: string
          subject_id?: string
          subject_type?: string
        }
        Relationships: []
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
      customer_cx_preferences: {
        Row: {
          created_at: string
          location_label: string | null
          metadata: Json
          notification_opt_in_placeholder: boolean
          preferred_categories: string[]
          preferred_city: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          location_label?: string | null
          metadata?: Json
          notification_opt_in_placeholder?: boolean
          preferred_categories?: string[]
          preferred_city?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          location_label?: string | null
          metadata?: Json
          notification_opt_in_placeholder?: boolean
          preferred_categories?: string[]
          preferred_city?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_cx_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_domain_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          payload: Json
          subject_id: string | null
          subject_type: string | null
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          payload?: Json
          subject_id?: string | null
          subject_type?: string | null
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          subject_id?: string | null
          subject_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_domain_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_feedback: {
        Row: {
          booking_id: string | null
          claim_id: string | null
          created_at: string
          dimensions: Json
          free_text: string | null
          id: string
          metadata: Json
          moderation_status: string
          rating: number | null
          subject_id: string
          subject_type: string
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          claim_id?: string | null
          created_at?: string
          dimensions?: Json
          free_text?: string | null
          id?: string
          metadata?: Json
          moderation_status?: string
          rating?: number | null
          subject_id: string
          subject_type: string
          user_id: string
        }
        Update: {
          booking_id?: string | null
          claim_id?: string | null
          created_at?: string
          dimensions?: Json
          free_text?: string | null
          id?: string
          metadata?: Json
          moderation_status?: string
          rating?: number | null
          subject_id?: string
          subject_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_feedback_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "marketplace_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_feedback_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "marketplace_offer_claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_non_purchase_reasons: {
        Row: {
          context_id: string | null
          context_type: string
          created_at: string
          event_id: string | null
          id: string
          metadata: Json
          note: string | null
          offer_event_id: string | null
          penalty_exempt: boolean
          reason_code: string
          review_status: string
          user_id: string
        }
        Insert: {
          context_id?: string | null
          context_type: string
          created_at?: string
          event_id?: string | null
          id?: string
          metadata?: Json
          note?: string | null
          offer_event_id?: string | null
          penalty_exempt?: boolean
          reason_code: string
          review_status?: string
          user_id: string
        }
        Update: {
          context_id?: string | null
          context_type?: string
          created_at?: string
          event_id?: string | null
          id?: string
          metadata?: Json
          note?: string | null
          offer_event_id?: string | null
          penalty_exempt?: boolean
          reason_code?: string
          review_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_non_purchase_reasons_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "marketplace_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_non_purchase_reasons_offer_event_id_fkey"
            columns: ["offer_event_id"]
            isOneToOne: false
            referencedRelation: "marketplace_offer_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_non_purchase_reasons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_refund_requests: {
        Row: {
          amount_determination: string
          booking_id: string
          created_at: string
          cutoff_hours: number
          eligible_under_cutoff: boolean
          finance_reversal_ref: string | null
          id: string
          metadata: Json
          policy_version: string
          reason: string
          requested_amount_minor: number | null
          requester_user_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount_determination?: string
          booking_id: string
          created_at?: string
          cutoff_hours: number
          eligible_under_cutoff: boolean
          finance_reversal_ref?: string | null
          id?: string
          metadata?: Json
          policy_version: string
          reason: string
          requested_amount_minor?: number | null
          requester_user_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount_determination?: string
          booking_id?: string
          created_at?: string
          cutoff_hours?: number
          eligible_under_cutoff?: boolean
          finance_reversal_ref?: string | null
          id?: string
          metadata?: Json
          policy_version?: string
          reason?: string
          requested_amount_minor?: number | null
          requester_user_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_refund_requests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "marketplace_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_refund_requests_requester_user_id_fkey"
            columns: ["requester_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_refund_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_support_signals: {
        Row: {
          booking_id: string | null
          claim_id: string | null
          created_at: string
          event_id: string | null
          id: string
          message: string
          metadata: Json
          status: string
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          claim_id?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          message: string
          metadata?: Json
          status?: string
          user_id: string
        }
        Update: {
          booking_id?: string | null
          claim_id?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          message?: string
          metadata?: Json
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_support_signals_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "marketplace_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_support_signals_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "marketplace_offer_claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_support_signals_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "marketplace_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_support_signals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_trust_rank_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          delta: number
          event_type: string
          id: string
          metadata: Json
          resulting_score: number | null
          rule_version: string
          source_id: string | null
          source_type: string | null
          user_id: string
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          delta: number
          event_type: string
          id?: string
          metadata?: Json
          resulting_score?: number | null
          rule_version?: string
          source_id?: string | null
          source_type?: string | null
          user_id: string
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          delta?: number
          event_type?: string
          id?: string
          metadata?: Json
          resulting_score?: number | null
          rule_version?: string
          source_id?: string | null
          source_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_trust_rank_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_trust_rank_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_trust_rank_snapshots: {
        Row: {
          event_count: number
          formula_status: string
          level_label: string
          rule_version: string
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          event_count?: number
          formula_status?: string
          level_label?: string
          rule_version?: string
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          event_count?: number
          formula_status?: string
          level_label?: string
          rule_version?: string
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_trust_rank_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
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
      enterprise_bdp_packs: {
        Row: {
          activated_at: string | null
          active_client_count: number
          application_status: Database["public"]["Enums"]["enterprise_bdp_pack_status"]
          clients_capacity_max: number
          created_at: string
          id: string
          initial_payment_minor: number
          metadata: Json
          offline_payment_ref: string | null
          package_option: Database["public"]["Enums"]["enterprise_bdp_package_option"]
          package_total_minor: number
          payment_intent_id: string | null
          pricing_rule_version: string
          recoverable_balance_minor: number
          recovered_to_date_minor: number
          remaining_recoverable_minor: number
          role_assignment_id: string | null
          suspended_at: string | null
          terminated_at: string | null
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          active_client_count?: number
          application_status?: Database["public"]["Enums"]["enterprise_bdp_pack_status"]
          clients_capacity_max?: number
          created_at?: string
          id?: string
          initial_payment_minor?: number
          metadata?: Json
          offline_payment_ref?: string | null
          package_option?: Database["public"]["Enums"]["enterprise_bdp_package_option"]
          package_total_minor: number
          payment_intent_id?: string | null
          pricing_rule_version?: string
          recoverable_balance_minor?: number
          recovered_to_date_minor?: number
          remaining_recoverable_minor?: number
          role_assignment_id?: string | null
          suspended_at?: string | null
          terminated_at?: string | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activated_at?: string | null
          active_client_count?: number
          application_status?: Database["public"]["Enums"]["enterprise_bdp_pack_status"]
          clients_capacity_max?: number
          created_at?: string
          id?: string
          initial_payment_minor?: number
          metadata?: Json
          offline_payment_ref?: string | null
          package_option?: Database["public"]["Enums"]["enterprise_bdp_package_option"]
          package_total_minor?: number
          payment_intent_id?: string | null
          pricing_rule_version?: string
          recoverable_balance_minor?: number
          recovered_to_date_minor?: number
          remaining_recoverable_minor?: number
          role_assignment_id?: string | null
          suspended_at?: string | null
          terminated_at?: string | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_bdp_packs_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_bdp_packs_role_assignment_id_fkey"
            columns: ["role_assignment_id"]
            isOneToOne: false
            referencedRelation: "role_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_bdp_packs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      enterprise_change_orders: {
        Row: {
          approved_by: string | null
          client_accepted_at: string | null
          client_accepted_by: string | null
          commercial_impact_minor: number
          created_at: string
          id: string
          metadata: Json
          project_id: string
          requested_by: string | null
          requested_change: string
          status: string
          timeline_impact: string | null
          title: string
          updated_at: string
          version_no: number
        }
        Insert: {
          approved_by?: string | null
          client_accepted_at?: string | null
          client_accepted_by?: string | null
          commercial_impact_minor?: number
          created_at?: string
          id?: string
          metadata?: Json
          project_id: string
          requested_by?: string | null
          requested_change: string
          status?: string
          timeline_impact?: string | null
          title: string
          updated_at?: string
          version_no?: number
        }
        Update: {
          approved_by?: string | null
          client_accepted_at?: string | null
          client_accepted_by?: string | null
          commercial_impact_minor?: number
          created_at?: string
          id?: string
          metadata?: Json
          project_id?: string
          requested_by?: string | null
          requested_change?: string
          status?: string
          timeline_impact?: string | null
          title?: string
          updated_at?: string
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_change_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_change_orders_client_accepted_by_fkey"
            columns: ["client_accepted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_change_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "enterprise_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_change_orders_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_client_attributions: {
        Row: {
          approved_by: string | null
          basis: string | null
          bdp_user_id: string | null
          client_id: string
          created_at: string
          created_by: string | null
          effective_from: string | null
          effective_to: string | null
          id: string
          is_correction: boolean
          metadata: Json
          pack_id: string | null
          provenance: string
          reason: string | null
          status: Database["public"]["Enums"]["enterprise_attribution_status"]
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          basis?: string | null
          bdp_user_id?: string | null
          client_id: string
          created_at?: string
          created_by?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_correction?: boolean
          metadata?: Json
          pack_id?: string | null
          provenance?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["enterprise_attribution_status"]
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          basis?: string | null
          bdp_user_id?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_correction?: boolean
          metadata?: Json
          pack_id?: string | null
          provenance?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["enterprise_attribution_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_client_attributions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_client_attributions_bdp_user_id_fkey"
            columns: ["bdp_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_client_attributions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "enterprise_client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_client_attributions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_client_attributions_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "enterprise_bdp_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_client_handovers: {
        Row: {
          approved_by: string | null
          client_id: string
          completed_at: string | null
          created_at: string
          effective_from: string | null
          id: string
          metadata: Json
          notes: string | null
          requested_by: string | null
          source_pack_id: string | null
          status: string
          target_pack_id: string | null
        }
        Insert: {
          approved_by?: string | null
          client_id: string
          completed_at?: string | null
          created_at?: string
          effective_from?: string | null
          id?: string
          metadata?: Json
          notes?: string | null
          requested_by?: string | null
          source_pack_id?: string | null
          status?: string
          target_pack_id?: string | null
        }
        Update: {
          approved_by?: string | null
          client_id?: string
          completed_at?: string | null
          created_at?: string
          effective_from?: string | null
          id?: string
          metadata?: Json
          notes?: string | null
          requested_by?: string | null
          source_pack_id?: string | null
          status?: string
          target_pack_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_client_handovers_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_client_handovers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "enterprise_client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_client_handovers_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_client_handovers_source_pack_id_fkey"
            columns: ["source_pack_id"]
            isOneToOne: false
            referencedRelation: "enterprise_bdp_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_client_handovers_target_pack_id_fkey"
            columns: ["target_pack_id"]
            isOneToOne: false
            referencedRelation: "enterprise_bdp_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_client_profiles: {
        Row: {
          billing_ref: string | null
          compliance_ref: string | null
          created_at: string
          display_name: string
          engagement_status: string
          id: string
          industry: string | null
          legacy_application_id: string | null
          metadata: Json
          organisation_id: string
          primary_representative_user_id: string | null
          status: Database["public"]["Enums"]["enterprise_client_status"]
          updated_at: string
          verification_status: string
        }
        Insert: {
          billing_ref?: string | null
          compliance_ref?: string | null
          created_at?: string
          display_name: string
          engagement_status?: string
          id?: string
          industry?: string | null
          legacy_application_id?: string | null
          metadata?: Json
          organisation_id: string
          primary_representative_user_id?: string | null
          status?: Database["public"]["Enums"]["enterprise_client_status"]
          updated_at?: string
          verification_status?: string
        }
        Update: {
          billing_ref?: string | null
          compliance_ref?: string | null
          created_at?: string
          display_name?: string
          engagement_status?: string
          id?: string
          industry?: string | null
          legacy_application_id?: string | null
          metadata?: Json
          organisation_id?: string
          primary_representative_user_id?: string | null
          status?: Database["public"]["Enums"]["enterprise_client_status"]
          updated_at?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_client_profiles_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: true
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_client_profiles_primary_representative_user_id_fkey"
            columns: ["primary_representative_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_disputes: {
        Row: {
          client_id: string | null
          created_at: string
          details: string | null
          escalation: string | null
          id: string
          metadata: Json
          owner_user_id: string | null
          project_id: string | null
          resolution: string | null
          resolved_at: string | null
          severity: string
          status: string
          subject_type: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          details?: string | null
          escalation?: string | null
          id?: string
          metadata?: Json
          owner_user_id?: string | null
          project_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          subject_type: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          details?: string | null
          escalation?: string | null
          id?: string
          metadata?: Json
          owner_user_id?: string | null
          project_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          subject_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_disputes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "enterprise_client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_disputes_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_disputes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "enterprise_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_milestones: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          amount_minor: number | null
          component_id: string | null
          created_at: string
          due_on: string | null
          due_trigger: string | null
          id: string
          metadata: Json
          name: string
          percentage_bps: number | null
          project_id: string
          sort_order: number
          status: Database["public"]["Enums"]["enterprise_milestone_status"]
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          amount_minor?: number | null
          component_id?: string | null
          created_at?: string
          due_on?: string | null
          due_trigger?: string | null
          id?: string
          metadata?: Json
          name: string
          percentage_bps?: number | null
          project_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["enterprise_milestone_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          amount_minor?: number | null
          component_id?: string | null
          created_at?: string
          due_on?: string | null
          due_trigger?: string | null
          id?: string
          metadata?: Json
          name?: string
          percentage_bps?: number | null
          project_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["enterprise_milestone_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_milestones_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_milestones_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "enterprise_project_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "enterprise_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_opportunities: {
        Row: {
          attributed_bdp_user_id: string | null
          category: string | null
          client_id: string
          client_rep_user_id: string | null
          created_at: string
          expected_budget_max_minor: number | null
          expected_budget_min_minor: number | null
          expert_user_id: string | null
          id: string
          legacy_request_id: string | null
          metadata: Json
          owner_user_id: string | null
          pack_id: string | null
          priority: string
          source: string | null
          status: Database["public"]["Enums"]["enterprise_opportunity_status"]
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          attributed_bdp_user_id?: string | null
          category?: string | null
          client_id: string
          client_rep_user_id?: string | null
          created_at?: string
          expected_budget_max_minor?: number | null
          expected_budget_min_minor?: number | null
          expert_user_id?: string | null
          id?: string
          legacy_request_id?: string | null
          metadata?: Json
          owner_user_id?: string | null
          pack_id?: string | null
          priority?: string
          source?: string | null
          status?: Database["public"]["Enums"]["enterprise_opportunity_status"]
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          attributed_bdp_user_id?: string | null
          category?: string | null
          client_id?: string
          client_rep_user_id?: string | null
          created_at?: string
          expected_budget_max_minor?: number | null
          expected_budget_min_minor?: number | null
          expert_user_id?: string | null
          id?: string
          legacy_request_id?: string | null
          metadata?: Json
          owner_user_id?: string | null
          pack_id?: string | null
          priority?: string
          source?: string | null
          status?: Database["public"]["Enums"]["enterprise_opportunity_status"]
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_opportunities_attributed_bdp_user_id_fkey"
            columns: ["attributed_bdp_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_opportunities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "enterprise_client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_opportunities_client_rep_user_id_fkey"
            columns: ["client_rep_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_opportunities_expert_user_id_fkey"
            columns: ["expert_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_opportunities_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_opportunities_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "enterprise_bdp_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_project_components: {
        Row: {
          commercial_amount_minor: number
          component_key: string
          component_type: string
          created_at: string
          id: string
          label: string
          marketplace_venue_id: string | null
          metadata: Json
          platform_commission_bps: number
          platform_commission_minor: number
          project_id: string
          provider_ref: string | null
          revenue_component_key: string
          sourcing_vertical: string
          status: string
          updated_at: string
        }
        Insert: {
          commercial_amount_minor?: number
          component_key: string
          component_type: string
          created_at?: string
          id?: string
          label: string
          marketplace_venue_id?: string | null
          metadata?: Json
          platform_commission_bps?: number
          platform_commission_minor?: number
          project_id: string
          provider_ref?: string | null
          revenue_component_key: string
          sourcing_vertical: string
          status?: string
          updated_at?: string
        }
        Update: {
          commercial_amount_minor?: number
          component_key?: string
          component_type?: string
          created_at?: string
          id?: string
          label?: string
          marketplace_venue_id?: string | null
          metadata?: Json
          platform_commission_bps?: number
          platform_commission_minor?: number
          project_id?: string
          provider_ref?: string | null
          revenue_component_key?: string
          sourcing_vertical?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_project_components_marketplace_venue_id_fkey"
            columns: ["marketplace_venue_id"]
            isOneToOne: false
            referencedRelation: "marketplace_venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_project_components_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "enterprise_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_projects: {
        Row: {
          accepted_quote_id: string | null
          attribution_id: string | null
          client_id: string
          commercial_total_minor: number
          created_at: string
          ends_on: string | null
          gce_execution_role: string
          id: string
          metadata: Json
          opportunity_id: string | null
          owner_user_id: string | null
          pack_id: string | null
          project_ref: string
          starts_on: string | null
          status: Database["public"]["Enums"]["enterprise_project_status"]
          title: string
          updated_at: string
        }
        Insert: {
          accepted_quote_id?: string | null
          attribution_id?: string | null
          client_id: string
          commercial_total_minor?: number
          created_at?: string
          ends_on?: string | null
          gce_execution_role?: string
          id?: string
          metadata?: Json
          opportunity_id?: string | null
          owner_user_id?: string | null
          pack_id?: string | null
          project_ref: string
          starts_on?: string | null
          status?: Database["public"]["Enums"]["enterprise_project_status"]
          title: string
          updated_at?: string
        }
        Update: {
          accepted_quote_id?: string | null
          attribution_id?: string | null
          client_id?: string
          commercial_total_minor?: number
          created_at?: string
          ends_on?: string | null
          gce_execution_role?: string
          id?: string
          metadata?: Json
          opportunity_id?: string | null
          owner_user_id?: string | null
          pack_id?: string | null
          project_ref?: string
          starts_on?: string | null
          status?: Database["public"]["Enums"]["enterprise_project_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_projects_accepted_quote_id_fkey"
            columns: ["accepted_quote_id"]
            isOneToOne: false
            referencedRelation: "enterprise_quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_projects_attribution_id_fkey"
            columns: ["attribution_id"]
            isOneToOne: false
            referencedRelation: "enterprise_client_attributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "enterprise_client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_projects_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "enterprise_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_projects_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_projects_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "enterprise_bdp_packs"
            referencedColumns: ["id"]
          },
        ]
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
      enterprise_quote_lines: {
        Row: {
          amount_minor: number
          component_type: string
          created_at: string
          id: string
          label: string
          line_no: number
          metadata: Json
          platform_commission_bps: number
          quote_id: string
          revenue_component_key: string
          sourcing_vertical: string
        }
        Insert: {
          amount_minor?: number
          component_type?: string
          created_at?: string
          id?: string
          label: string
          line_no: number
          metadata?: Json
          platform_commission_bps?: number
          quote_id: string
          revenue_component_key: string
          sourcing_vertical?: string
        }
        Update: {
          amount_minor?: number
          component_type?: string
          created_at?: string
          id?: string
          label?: string
          line_no?: number
          metadata?: Json
          platform_commission_bps?: number
          quote_id?: string
          revenue_component_key?: string
          sourcing_vertical?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_quote_lines_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "enterprise_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_quotes: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          client_id: string
          created_at: string
          currency: string
          finance_cosign_required: boolean
          finance_cosigned_at: string | null
          finance_cosigned_by: string | null
          id: string
          issued_at: string | null
          issued_by: string | null
          metadata: Json
          opportunity_id: string
          proposal_id: string | null
          quote_ref: string
          requirement_version_id: string | null
          status: Database["public"]["Enums"]["enterprise_quote_status"]
          supersedes_quote_id: string | null
          total_proposed_minor: number
          updated_at: string
          validity_until: string | null
          version_no: number
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          client_id: string
          created_at?: string
          currency?: string
          finance_cosign_required?: boolean
          finance_cosigned_at?: string | null
          finance_cosigned_by?: string | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          metadata?: Json
          opportunity_id: string
          proposal_id?: string | null
          quote_ref: string
          requirement_version_id?: string | null
          status?: Database["public"]["Enums"]["enterprise_quote_status"]
          supersedes_quote_id?: string | null
          total_proposed_minor?: number
          updated_at?: string
          validity_until?: string | null
          version_no?: number
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          client_id?: string
          created_at?: string
          currency?: string
          finance_cosign_required?: boolean
          finance_cosigned_at?: string | null
          finance_cosigned_by?: string | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          metadata?: Json
          opportunity_id?: string
          proposal_id?: string | null
          quote_ref?: string
          requirement_version_id?: string | null
          status?: Database["public"]["Enums"]["enterprise_quote_status"]
          supersedes_quote_id?: string | null
          total_proposed_minor?: number
          updated_at?: string
          validity_until?: string | null
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_quotes_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "enterprise_client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_quotes_finance_cosigned_by_fkey"
            columns: ["finance_cosigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_quotes_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_quotes_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "enterprise_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_quotes_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "enterprise_solution_proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_quotes_requirement_version_id_fkey"
            columns: ["requirement_version_id"]
            isOneToOne: false
            referencedRelation: "enterprise_requirement_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_quotes_supersedes_quote_id_fkey"
            columns: ["supersedes_quote_id"]
            isOneToOne: false
            referencedRelation: "enterprise_quotes"
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
      enterprise_requirement_versions: {
        Row: {
          actor_user_id: string | null
          approval_status: string
          budget_guidance_minor: number | null
          change_reason: string | null
          constraints: string | null
          created_at: string
          deliverables: string | null
          id: string
          locations: string | null
          metadata: Json
          objectives: string | null
          raw_requirement: string | null
          requirement_id: string
          structured_scope: string | null
          timeline_notes: string | null
          version_no: number
        }
        Insert: {
          actor_user_id?: string | null
          approval_status?: string
          budget_guidance_minor?: number | null
          change_reason?: string | null
          constraints?: string | null
          created_at?: string
          deliverables?: string | null
          id?: string
          locations?: string | null
          metadata?: Json
          objectives?: string | null
          raw_requirement?: string | null
          requirement_id: string
          structured_scope?: string | null
          timeline_notes?: string | null
          version_no: number
        }
        Update: {
          actor_user_id?: string | null
          approval_status?: string
          budget_guidance_minor?: number | null
          change_reason?: string | null
          constraints?: string | null
          created_at?: string
          deliverables?: string | null
          id?: string
          locations?: string | null
          metadata?: Json
          objectives?: string | null
          raw_requirement?: string | null
          requirement_id?: string
          structured_scope?: string | null
          timeline_notes?: string | null
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_requirement_versions_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_requirement_versions_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "enterprise_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_requirements: {
        Row: {
          created_at: string
          current_version: number
          id: string
          metadata: Json
          opportunity_id: string
          readiness_status: string
          structured_by: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_version?: number
          id?: string
          metadata?: Json
          opportunity_id: string
          readiness_status?: string
          structured_by?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_version?: number
          id?: string
          metadata?: Json
          opportunity_id?: string
          readiness_status?: string
          structured_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_requirements_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: true
            referencedRelation: "enterprise_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_requirements_structured_by_fkey"
            columns: ["structured_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_revenue_entitlements: {
        Row: {
          attribution_id: string | null
          client_id: string
          component_id: string | null
          created_at: string
          earning_event_key: string
          ebdp_entitlement_bps: number
          ebdp_entitlement_minor: number
          eligible_event_revenue_minor: number
          has_valid_attribution: boolean
          id: string
          metadata: Json
          pack_id: string | null
          platform_commission_minor: number
          project_id: string | null
          revenue_component_key: string
          rule_version: string
          state: Database["public"]["Enums"]["enterprise_entitlement_state"]
          updated_at: string
        }
        Insert: {
          attribution_id?: string | null
          client_id: string
          component_id?: string | null
          created_at?: string
          earning_event_key: string
          ebdp_entitlement_bps?: number
          ebdp_entitlement_minor?: number
          eligible_event_revenue_minor?: number
          has_valid_attribution?: boolean
          id?: string
          metadata?: Json
          pack_id?: string | null
          platform_commission_minor?: number
          project_id?: string | null
          revenue_component_key: string
          rule_version?: string
          state?: Database["public"]["Enums"]["enterprise_entitlement_state"]
          updated_at?: string
        }
        Update: {
          attribution_id?: string | null
          client_id?: string
          component_id?: string | null
          created_at?: string
          earning_event_key?: string
          ebdp_entitlement_bps?: number
          ebdp_entitlement_minor?: number
          eligible_event_revenue_minor?: number
          has_valid_attribution?: boolean
          id?: string
          metadata?: Json
          pack_id?: string | null
          platform_commission_minor?: number
          project_id?: string | null
          revenue_component_key?: string
          rule_version?: string
          state?: Database["public"]["Enums"]["enterprise_entitlement_state"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_revenue_entitlements_attribution_id_fkey"
            columns: ["attribution_id"]
            isOneToOne: false
            referencedRelation: "enterprise_client_attributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_revenue_entitlements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "enterprise_client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_revenue_entitlements_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "enterprise_project_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_revenue_entitlements_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "enterprise_bdp_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_revenue_entitlements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "enterprise_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_solution_proposals: {
        Row: {
          assumptions: string | null
          client_facing_status: string
          created_at: string
          exclusions: string | null
          id: string
          internal_status: string
          metadata: Json
          opportunity_id: string
          prepared_by: string | null
          pricing_summary_minor: number
          requirement_version_id: string | null
          reviewed_by: string | null
          solution_summary: string | null
          title: string
          updated_at: string
          validity_until: string | null
          version_no: number
        }
        Insert: {
          assumptions?: string | null
          client_facing_status?: string
          created_at?: string
          exclusions?: string | null
          id?: string
          internal_status?: string
          metadata?: Json
          opportunity_id: string
          prepared_by?: string | null
          pricing_summary_minor?: number
          requirement_version_id?: string | null
          reviewed_by?: string | null
          solution_summary?: string | null
          title: string
          updated_at?: string
          validity_until?: string | null
          version_no?: number
        }
        Update: {
          assumptions?: string | null
          client_facing_status?: string
          created_at?: string
          exclusions?: string | null
          id?: string
          internal_status?: string
          metadata?: Json
          opportunity_id?: string
          prepared_by?: string | null
          pricing_summary_minor?: number
          requirement_version_id?: string | null
          reviewed_by?: string | null
          solution_summary?: string | null
          title?: string
          updated_at?: string
          validity_until?: string | null
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_solution_proposals_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "enterprise_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_solution_proposals_prepared_by_fkey"
            columns: ["prepared_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_solution_proposals_requirement_version_id_fkey"
            columns: ["requirement_version_id"]
            isOneToOne: false
            referencedRelation: "enterprise_requirement_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_solution_proposals_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_vendor_assignments: {
        Row: {
          approved_by: string | null
          assigned_by: string | null
          commercial_amount_minor: number | null
          component_id: string | null
          created_at: string
          id: string
          metadata: Json
          project_id: string
          scope: string | null
          status: string
          vendor_id: string
        }
        Insert: {
          approved_by?: string | null
          assigned_by?: string | null
          commercial_amount_minor?: number | null
          component_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          project_id: string
          scope?: string | null
          status?: string
          vendor_id: string
        }
        Update: {
          approved_by?: string | null
          assigned_by?: string | null
          commercial_amount_minor?: number | null
          component_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          project_id?: string
          scope?: string | null
          status?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_vendor_assignments_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_vendor_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_vendor_assignments_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "enterprise_project_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_vendor_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "enterprise_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_vendor_assignments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "enterprise_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_vendors: {
        Row: {
          business_name: string
          capabilities: string | null
          category: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          login_enabled: boolean
          metadata: Json
          payout_ref: string | null
          status: string
          updated_at: string
          verification_status: string
        }
        Insert: {
          business_name: string
          capabilities?: string | null
          category?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          login_enabled?: boolean
          metadata?: Json
          payout_ref?: string | null
          status?: string
          updated_at?: string
          verification_status?: string
        }
        Update: {
          business_name?: string
          capabilities?: string | null
          category?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          login_enabled?: boolean
          metadata?: Json
          payout_ref?: string | null
          status?: string
          updated_at?: string
          verification_status?: string
        }
        Relationships: []
      }
      entitlement_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          entitlement_id: string
          from_status:
            | Database["public"]["Enums"]["stakeholder_entitlement_status"]
            | null
          id: string
          metadata: Json
          reason: string | null
          to_status: Database["public"]["Enums"]["stakeholder_entitlement_status"]
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          entitlement_id: string
          from_status?:
            | Database["public"]["Enums"]["stakeholder_entitlement_status"]
            | null
          id?: string
          metadata?: Json
          reason?: string | null
          to_status: Database["public"]["Enums"]["stakeholder_entitlement_status"]
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          entitlement_id?: string
          from_status?:
            | Database["public"]["Enums"]["stakeholder_entitlement_status"]
            | null
          id?: string
          metadata?: Json
          reason?: string | null
          to_status?: Database["public"]["Enums"]["stakeholder_entitlement_status"]
        }
        Relationships: [
          {
            foreignKeyName: "entitlement_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlement_events_entitlement_id_fkey"
            columns: ["entitlement_id"]
            isOneToOne: false
            referencedRelation: "stakeholder_entitlements"
            referencedColumns: ["id"]
          },
        ]
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
      financial_corrections: {
        Row: {
          actor_user_id: string | null
          amount_minor: number
          approved_by: string | null
          correction_key: string
          created_at: string
          id: string
          metadata: Json
          reason: string
          reversing_transaction_id: string | null
          status: string
          subject_id: string
          subject_type: string
        }
        Insert: {
          actor_user_id?: string | null
          amount_minor?: number
          approved_by?: string | null
          correction_key: string
          created_at?: string
          id?: string
          metadata?: Json
          reason: string
          reversing_transaction_id?: string | null
          status?: string
          subject_id: string
          subject_type: string
        }
        Update: {
          actor_user_id?: string | null
          amount_minor?: number
          approved_by?: string | null
          correction_key?: string
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string
          reversing_transaction_id?: string | null
          status?: string
          subject_id?: string
          subject_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_corrections_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_corrections_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_corrections_reversing_transaction_id_fkey"
            columns: ["reversing_transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_holds: {
        Row: {
          actor_user_id: string | null
          amount_minor: number | null
          created_at: string
          id: string
          metadata: Json
          reason: string
          released_at: string | null
          released_by: string | null
          scope_id: string
          scope_type: string
          started_at: string
          status: string
        }
        Insert: {
          actor_user_id?: string | null
          amount_minor?: number | null
          created_at?: string
          id?: string
          metadata?: Json
          reason: string
          released_at?: string | null
          released_by?: string | null
          scope_id: string
          scope_type: string
          started_at?: string
          status?: string
        }
        Update: {
          actor_user_id?: string | null
          amount_minor?: number | null
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string
          released_at?: string | null
          released_by?: string | null
          scope_id?: string
          scope_type?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_holds_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_holds_released_by_fkey"
            columns: ["released_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_reversals: {
        Row: {
          actor_user_id: string | null
          amount_minor: number
          chargeback_ref: string | null
          created_at: string
          id: string
          metadata: Json
          original_entitlement_id: string | null
          original_financial_transaction_id: string | null
          original_revenue_component_id: string | null
          reason: string
          refund_ref: string | null
          reversing_transaction_id: string | null
        }
        Insert: {
          actor_user_id?: string | null
          amount_minor: number
          chargeback_ref?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          original_entitlement_id?: string | null
          original_financial_transaction_id?: string | null
          original_revenue_component_id?: string | null
          reason: string
          refund_ref?: string | null
          reversing_transaction_id?: string | null
        }
        Update: {
          actor_user_id?: string | null
          amount_minor?: number
          chargeback_ref?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          original_entitlement_id?: string | null
          original_financial_transaction_id?: string | null
          original_revenue_component_id?: string | null
          reason?: string
          refund_ref?: string | null
          reversing_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_reversals_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_reversals_original_entitlement_id_fkey"
            columns: ["original_entitlement_id"]
            isOneToOne: false
            referencedRelation: "stakeholder_entitlements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_reversals_original_financial_transaction_id_fkey"
            columns: ["original_financial_transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_reversals_original_revenue_component_id_fkey"
            columns: ["original_revenue_component_id"]
            isOneToOne: false
            referencedRelation: "revenue_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_reversals_reversing_transaction_id_fkey"
            columns: ["reversing_transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_rule_versions: {
        Row: {
          attribution_required: boolean
          authority_refs: string[]
          basis: string
          created_at: string
          effective_from: string
          effective_to: string | null
          formula_notes: string | null
          id: string
          is_active: boolean
          metadata: Json
          rate_bps: number
          rule_key: string
          stakeholder_type: string
          version: string
          vertical: Database["public"]["Enums"]["finance_vertical"]
        }
        Insert: {
          attribution_required?: boolean
          authority_refs?: string[]
          basis: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          formula_notes?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          rate_bps?: number
          rule_key: string
          stakeholder_type: string
          version: string
          vertical: Database["public"]["Enums"]["finance_vertical"]
        }
        Update: {
          attribution_required?: boolean
          authority_refs?: string[]
          basis?: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          formula_notes?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          rate_bps?: number
          rule_key?: string
          stakeholder_type?: string
          version?: string
          vertical?: Database["public"]["Enums"]["finance_vertical"]
        }
        Relationships: []
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
      gce_commissioned_revenue_components: {
        Row: {
          created_at: string
          entitlement_ref: string | null
          metadata: Json
          revenue_component_key: string
          source_vertical: string
          stakeholder_family: string
        }
        Insert: {
          created_at?: string
          entitlement_ref?: string | null
          metadata?: Json
          revenue_component_key: string
          source_vertical: string
          stakeholder_family: string
        }
        Update: {
          created_at?: string
          entitlement_ref?: string | null
          metadata?: Json
          revenue_component_key?: string
          source_vertical?: string
          stakeholder_family?: string
        }
        Relationships: []
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
      in_app_notifications: {
        Row: {
          archived_at: string | null
          body: string
          category: string
          created_at: string
          deep_link: string | null
          expires_at: string | null
          id: string
          intent_id: string | null
          notification_type: string
          priority: string
          read_at: string | null
          recipient_user_id: string
          source_entity_id: string | null
          source_entity_type: string | null
          title: string
        }
        Insert: {
          archived_at?: string | null
          body: string
          category: string
          created_at?: string
          deep_link?: string | null
          expires_at?: string | null
          id?: string
          intent_id?: string | null
          notification_type: string
          priority?: string
          read_at?: string | null
          recipient_user_id: string
          source_entity_id?: string | null
          source_entity_type?: string | null
          title: string
        }
        Update: {
          archived_at?: string | null
          body?: string
          category?: string
          created_at?: string
          deep_link?: string | null
          expires_at?: string | null
          id?: string
          intent_id?: string | null
          notification_type?: string
          priority?: string
          read_at?: string | null
          recipient_user_id?: string
          source_entity_id?: string | null
          source_entity_type?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "in_app_notifications_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "notification_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_signals: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          first_seen_at: string
          id: string
          last_seen_at: string
          owner_user_id: string | null
          related_event_ids: Json
          resolution_ref: string | null
          resolved_at: string | null
          severity: string
          source: string
          status: string
          summary: string
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          owner_user_id?: string | null
          related_event_ids?: Json
          resolution_ref?: string | null
          resolved_at?: string | null
          severity?: string
          source: string
          status?: string
          summary: string
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          owner_user_id?: string | null
          related_event_ids?: Json
          resolution_ref?: string | null
          resolved_at?: string | null
          severity?: string
          source?: string
          status?: string
          summary?: string
          title?: string
        }
        Relationships: []
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
      legacy_enterprise_migration_map: {
        Row: {
          created_at: string
          id: string
          legacy_object: string
          mapping_status: Database["public"]["Enums"]["legacy_enterprise_map_status"]
          notes: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_object: string
          mapping_status?: Database["public"]["Enums"]["legacy_enterprise_map_status"]
          notes?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          legacy_object?: string
          mapping_status?: Database["public"]["Enums"]["legacy_enterprise_map_status"]
          notes?: string | null
        }
        Relationships: []
      }
      legacy_finance_migration_map: {
        Row: {
          created_at: string
          id: string
          legacy_object: string
          mapping_status: string
          notes: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_object: string
          mapping_status?: string
          notes?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          legacy_object?: string
          mapping_status?: string
          notes?: string | null
        }
        Relationships: []
      }
      legacy_lead_assist_migration_map: {
        Row: {
          created_at: string
          id: string
          legacy_object: string
          mapping_status: string
          notes: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_object: string
          mapping_status?: string
          notes?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          legacy_object?: string
          mapping_status?: string
          notes?: string | null
        }
        Relationships: []
      }
      legacy_marketplace_migration_map: {
        Row: {
          created_at: string
          id: string
          legacy_object: string
          mapping_status: Database["public"]["Enums"]["legacy_marketplace_map_status"]
          notes: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_object: string
          mapping_status?: Database["public"]["Enums"]["legacy_marketplace_map_status"]
          notes?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          legacy_object?: string
          mapping_status?: Database["public"]["Enums"]["legacy_marketplace_map_status"]
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
      marketplace_bdp_recovery_entries: {
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
            foreignKeyName: "marketplace_bdp_recovery_entries_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_bdp_recovery_entries_entitlement_id_fkey"
            columns: ["entitlement_id"]
            isOneToOne: false
            referencedRelation: "marketplace_revenue_entitlements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_bdp_recovery_entries_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "marketplace_bdp_units"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_bdp_units: {
        Row: {
          activated_at: string | null
          active_venue_count: number
          application_status: Database["public"]["Enums"]["marketplace_bdp_application_status"]
          created_at: string
          id: string
          initial_payment_minor: number
          kyc_case_id: string | null
          metadata: Json
          offline_approved_by: string | null
          offline_payment_ref: string | null
          offline_recorded_by: string | null
          package_option: Database["public"]["Enums"]["marketplace_bdp_package_option"]
          package_total_minor: number
          payment_intent_id: string | null
          pricing_rule_version: string
          recoverable_balance_minor: number
          recovered_to_date_minor: number
          remaining_recoverable_minor: number
          role_assignment_id: string | null
          suspended_at: string | null
          terminated_at: string | null
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
          venues_capacity_max: number
        }
        Insert: {
          activated_at?: string | null
          active_venue_count?: number
          application_status?: Database["public"]["Enums"]["marketplace_bdp_application_status"]
          created_at?: string
          id?: string
          initial_payment_minor?: number
          kyc_case_id?: string | null
          metadata?: Json
          offline_approved_by?: string | null
          offline_payment_ref?: string | null
          offline_recorded_by?: string | null
          package_option?: Database["public"]["Enums"]["marketplace_bdp_package_option"]
          package_total_minor: number
          payment_intent_id?: string | null
          pricing_rule_version?: string
          recoverable_balance_minor?: number
          recovered_to_date_minor?: number
          remaining_recoverable_minor?: number
          role_assignment_id?: string | null
          suspended_at?: string | null
          terminated_at?: string | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id: string
          venues_capacity_max?: number
        }
        Update: {
          activated_at?: string | null
          active_venue_count?: number
          application_status?: Database["public"]["Enums"]["marketplace_bdp_application_status"]
          created_at?: string
          id?: string
          initial_payment_minor?: number
          kyc_case_id?: string | null
          metadata?: Json
          offline_approved_by?: string | null
          offline_payment_ref?: string | null
          offline_recorded_by?: string | null
          package_option?: Database["public"]["Enums"]["marketplace_bdp_package_option"]
          package_total_minor?: number
          payment_intent_id?: string | null
          pricing_rule_version?: string
          recoverable_balance_minor?: number
          recovered_to_date_minor?: number
          remaining_recoverable_minor?: number
          role_assignment_id?: string | null
          suspended_at?: string | null
          terminated_at?: string | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id?: string
          venues_capacity_max?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_bdp_units_kyc_case_id_fkey"
            columns: ["kyc_case_id"]
            isOneToOne: false
            referencedRelation: "kyc_verification_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_bdp_units_offline_approved_by_fkey"
            columns: ["offline_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_bdp_units_offline_recorded_by_fkey"
            columns: ["offline_recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_bdp_units_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_bdp_units_role_assignment_id_fkey"
            columns: ["role_assignment_id"]
            isOneToOne: false
            referencedRelation: "role_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_bdp_units_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_bookings: {
        Row: {
          attribution_id: string | null
          buyer_user_id: string
          cancel_cutoff_hours: number
          cancel_policy_version: string
          created_at: string
          currency: string
          event_id: string
          id: string
          idempotency_key: string | null
          metadata: Json
          payment_intent_id: string | null
          quantity: number
          status: Database["public"]["Enums"]["marketplace_booking_status"]
          total_minor: number
          unit_price_minor: number
          updated_at: string
        }
        Insert: {
          attribution_id?: string | null
          buyer_user_id: string
          cancel_cutoff_hours?: number
          cancel_policy_version?: string
          created_at?: string
          currency?: string
          event_id: string
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          payment_intent_id?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["marketplace_booking_status"]
          total_minor: number
          unit_price_minor: number
          updated_at?: string
        }
        Update: {
          attribution_id?: string | null
          buyer_user_id?: string
          cancel_cutoff_hours?: number
          cancel_policy_version?: string
          created_at?: string
          currency?: string
          event_id?: string
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          payment_intent_id?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["marketplace_booking_status"]
          total_minor?: number
          unit_price_minor?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_bookings_attribution_id_fkey"
            columns: ["attribution_id"]
            isOneToOne: false
            referencedRelation: "marketplace_venue_attributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_bookings_buyer_user_id_fkey"
            columns: ["buyer_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "marketplace_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_bookings_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_events: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          attribution_id: string | null
          cancel_cutoff_hours: number
          cancel_policy_version: string
          capacity: number
          category: string | null
          created_at: string
          currency: string
          description: string | null
          ends_at: string | null
          id: string
          legacy_event_id: string | null
          metadata: Json
          price_minor: number
          published_at: string | null
          recommended_by: string | null
          starts_at: string
          status: Database["public"]["Enums"]["marketplace_event_status"]
          submitted_by: string | null
          title: string
          updated_at: string
          venue_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          attribution_id?: string | null
          cancel_cutoff_hours?: number
          cancel_policy_version?: string
          capacity?: number
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          legacy_event_id?: string | null
          metadata?: Json
          price_minor?: number
          published_at?: string | null
          recommended_by?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["marketplace_event_status"]
          submitted_by?: string | null
          title: string
          updated_at?: string
          venue_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          attribution_id?: string | null
          cancel_cutoff_hours?: number
          cancel_policy_version?: string
          capacity?: number
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          legacy_event_id?: string | null
          metadata?: Json
          price_minor?: number
          published_at?: string | null
          recommended_by?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["marketplace_event_status"]
          submitted_by?: string | null
          title?: string
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_events_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_events_attribution_id_fkey"
            columns: ["attribution_id"]
            isOneToOne: false
            referencedRelation: "marketplace_venue_attributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_events_recommended_by_fkey"
            columns: ["recommended_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_events_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "marketplace_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_offer_claims: {
        Row: {
          claim_token_hash: string
          claimant_user_id: string
          claimed_at: string
          created_at: string
          expires_at: string
          id: string
          metadata: Json
          non_purchase_notes: string | null
          non_purchase_reason: string | null
          offer_event_id: string
          penalty_exempt: boolean
          redeemed_at: string | null
          status: Database["public"]["Enums"]["marketplace_claim_status"]
          updated_at: string
          venue_response: string | null
        }
        Insert: {
          claim_token_hash: string
          claimant_user_id: string
          claimed_at?: string
          created_at?: string
          expires_at: string
          id?: string
          metadata?: Json
          non_purchase_notes?: string | null
          non_purchase_reason?: string | null
          offer_event_id: string
          penalty_exempt?: boolean
          redeemed_at?: string | null
          status?: Database["public"]["Enums"]["marketplace_claim_status"]
          updated_at?: string
          venue_response?: string | null
        }
        Update: {
          claim_token_hash?: string
          claimant_user_id?: string
          claimed_at?: string
          created_at?: string
          expires_at?: string
          id?: string
          metadata?: Json
          non_purchase_notes?: string | null
          non_purchase_reason?: string | null
          offer_event_id?: string
          penalty_exempt?: boolean
          redeemed_at?: string | null
          status?: Database["public"]["Enums"]["marketplace_claim_status"]
          updated_at?: string
          venue_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_offer_claims_claimant_user_id_fkey"
            columns: ["claimant_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_offer_claims_offer_event_id_fkey"
            columns: ["offer_event_id"]
            isOneToOne: false
            referencedRelation: "marketplace_offer_events"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_offer_events: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          attribution_id: string | null
          campaign_ends_at: string
          campaign_starts_at: string
          claim_validity_hours: number
          claims_count: number
          created_at: string
          customer_cap: number
          description: string | null
          id: string
          metadata: Json
          planned_commercial_value_minor: number
          published_at: string | null
          recommended_by: string | null
          status: Database["public"]["Enums"]["marketplace_offer_status"]
          submitted_by: string | null
          title: string
          updated_at: string
          venue_id: string
          version: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          attribution_id?: string | null
          campaign_ends_at: string
          campaign_starts_at: string
          claim_validity_hours?: number
          claims_count?: number
          created_at?: string
          customer_cap?: number
          description?: string | null
          id?: string
          metadata?: Json
          planned_commercial_value_minor: number
          published_at?: string | null
          recommended_by?: string | null
          status?: Database["public"]["Enums"]["marketplace_offer_status"]
          submitted_by?: string | null
          title: string
          updated_at?: string
          venue_id: string
          version?: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          attribution_id?: string | null
          campaign_ends_at?: string
          campaign_starts_at?: string
          claim_validity_hours?: number
          claims_count?: number
          created_at?: string
          customer_cap?: number
          description?: string | null
          id?: string
          metadata?: Json
          planned_commercial_value_minor?: number
          published_at?: string | null
          recommended_by?: string | null
          status?: Database["public"]["Enums"]["marketplace_offer_status"]
          submitted_by?: string | null
          title?: string
          updated_at?: string
          venue_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_offer_events_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_offer_events_attribution_id_fkey"
            columns: ["attribution_id"]
            isOneToOne: false
            referencedRelation: "marketplace_venue_attributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_offer_events_recommended_by_fkey"
            columns: ["recommended_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_offer_events_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_offer_events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "marketplace_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_redemptions: {
        Row: {
          claim_id: string
          created_at: string
          id: string
          metadata: Json
          offer_event_id: string
          redeemed_by_staff_user_id: string | null
          redemption_token_hash: string
          sale_confirmed: boolean
          sale_reference: string | null
          status: string
          venue_id: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          id?: string
          metadata?: Json
          offer_event_id: string
          redeemed_by_staff_user_id?: string | null
          redemption_token_hash: string
          sale_confirmed?: boolean
          sale_reference?: string | null
          status?: string
          venue_id: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          offer_event_id?: string
          redeemed_by_staff_user_id?: string | null
          redemption_token_hash?: string
          sale_confirmed?: boolean
          sale_reference?: string | null
          status?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_redemptions_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: true
            referencedRelation: "marketplace_offer_claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_redemptions_offer_event_id_fkey"
            columns: ["offer_event_id"]
            isOneToOne: false
            referencedRelation: "marketplace_offer_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_redemptions_redeemed_by_staff_user_id_fkey"
            columns: ["redeemed_by_staff_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_redemptions_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "marketplace_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_revenue_entitlements: {
        Row: {
          attribution_id: string | null
          created_at: string
          earning_event_key: string
          eligible_revenue_minor: number
          gce_share_minor: number
          has_valid_attribution: boolean
          id: string
          mbdp_commission_bps: number
          mbdp_share_minor: number
          metadata: Json
          rule_version: string
          source_id: string | null
          source_type: string
          state: Database["public"]["Enums"]["marketplace_entitlement_state"]
          unit_id: string | null
          updated_at: string
          venue_id: string
          venue_share_minor: number
        }
        Insert: {
          attribution_id?: string | null
          created_at?: string
          earning_event_key: string
          eligible_revenue_minor?: number
          gce_share_minor?: number
          has_valid_attribution?: boolean
          id?: string
          mbdp_commission_bps?: number
          mbdp_share_minor?: number
          metadata?: Json
          rule_version?: string
          source_id?: string | null
          source_type: string
          state?: Database["public"]["Enums"]["marketplace_entitlement_state"]
          unit_id?: string | null
          updated_at?: string
          venue_id: string
          venue_share_minor?: number
        }
        Update: {
          attribution_id?: string | null
          created_at?: string
          earning_event_key?: string
          eligible_revenue_minor?: number
          gce_share_minor?: number
          has_valid_attribution?: boolean
          id?: string
          mbdp_commission_bps?: number
          mbdp_share_minor?: number
          metadata?: Json
          rule_version?: string
          source_id?: string | null
          source_type?: string
          state?: Database["public"]["Enums"]["marketplace_entitlement_state"]
          unit_id?: string | null
          updated_at?: string
          venue_id?: string
          venue_share_minor?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_revenue_entitlements_attribution_id_fkey"
            columns: ["attribution_id"]
            isOneToOne: false
            referencedRelation: "marketplace_venue_attributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_revenue_entitlements_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "marketplace_bdp_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_revenue_entitlements_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "marketplace_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_tickets: {
        Row: {
          booking_id: string
          checked_in_at: string | null
          checked_in_by: string | null
          created_at: string
          event_id: string
          holder_user_id: string
          id: string
          issued_at: string
          metadata: Json
          qr_token_hash: string
          status: Database["public"]["Enums"]["marketplace_ticket_status"]
          ticket_ref: string
          updated_at: string
          voided_at: string | null
        }
        Insert: {
          booking_id: string
          checked_in_at?: string | null
          checked_in_by?: string | null
          created_at?: string
          event_id: string
          holder_user_id: string
          id?: string
          issued_at?: string
          metadata?: Json
          qr_token_hash: string
          status?: Database["public"]["Enums"]["marketplace_ticket_status"]
          ticket_ref: string
          updated_at?: string
          voided_at?: string | null
        }
        Update: {
          booking_id?: string
          checked_in_at?: string | null
          checked_in_by?: string | null
          created_at?: string
          event_id?: string
          holder_user_id?: string
          id?: string
          issued_at?: string
          metadata?: Json
          qr_token_hash?: string
          status?: Database["public"]["Enums"]["marketplace_ticket_status"]
          ticket_ref?: string
          updated_at?: string
          voided_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_tickets_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "marketplace_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_tickets_checked_in_by_fkey"
            columns: ["checked_in_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "marketplace_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_tickets_holder_user_id_fkey"
            columns: ["holder_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_venue_attributions: {
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
          metadata: Json
          provenance: string
          reason: string | null
          status: Database["public"]["Enums"]["marketplace_attribution_status"]
          unit_id: string | null
          updated_at: string
          venue_id: string
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
          metadata?: Json
          provenance?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["marketplace_attribution_status"]
          unit_id?: string | null
          updated_at?: string
          venue_id: string
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
          metadata?: Json
          provenance?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["marketplace_attribution_status"]
          unit_id?: string | null
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_venue_attributions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venue_attributions_bdp_user_id_fkey"
            columns: ["bdp_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venue_attributions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venue_attributions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "marketplace_bdp_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venue_attributions_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "marketplace_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_venue_handovers: {
        Row: {
          approved_by: string | null
          completed_at: string | null
          created_at: string
          effective_from: string | null
          id: string
          metadata: Json
          notes: string | null
          requested_by: string | null
          source_unit_id: string | null
          status: string
          target_unit_id: string | null
          updated_at: string
          venue_id: string
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
          source_unit_id?: string | null
          status?: string
          target_unit_id?: string | null
          updated_at?: string
          venue_id: string
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
          source_unit_id?: string | null
          status?: string
          target_unit_id?: string | null
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_venue_handovers_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venue_handovers_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venue_handovers_source_unit_id_fkey"
            columns: ["source_unit_id"]
            isOneToOne: false
            referencedRelation: "marketplace_bdp_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venue_handovers_target_unit_id_fkey"
            columns: ["target_unit_id"]
            isOneToOne: false
            referencedRelation: "marketplace_bdp_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venue_handovers_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "marketplace_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_venues: {
        Row: {
          address: string | null
          approved_at: string | null
          approved_by: string | null
          category: string | null
          city: string
          created_at: string
          display_name: string
          id: string
          inactive_reason: string | null
          kyc_case_id: string | null
          legacy_venue_id: string | null
          legal_name: string | null
          metadata: Json
          organisation_id: string
          payout_details_ref: string | null
          performance_score: number | null
          recommended_at: string | null
          recommended_by_unit_id: string | null
          recommended_by_user_id: string | null
          rejected_by: string | null
          rejection_reason: string | null
          state: string | null
          status: Database["public"]["Enums"]["marketplace_venue_status"]
          submitted_by: string | null
          updated_at: string
          verification_status: string
        }
        Insert: {
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          category?: string | null
          city: string
          created_at?: string
          display_name: string
          id?: string
          inactive_reason?: string | null
          kyc_case_id?: string | null
          legacy_venue_id?: string | null
          legal_name?: string | null
          metadata?: Json
          organisation_id: string
          payout_details_ref?: string | null
          performance_score?: number | null
          recommended_at?: string | null
          recommended_by_unit_id?: string | null
          recommended_by_user_id?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["marketplace_venue_status"]
          submitted_by?: string | null
          updated_at?: string
          verification_status?: string
        }
        Update: {
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          category?: string | null
          city?: string
          created_at?: string
          display_name?: string
          id?: string
          inactive_reason?: string | null
          kyc_case_id?: string | null
          legacy_venue_id?: string | null
          legal_name?: string | null
          metadata?: Json
          organisation_id?: string
          payout_details_ref?: string | null
          performance_score?: number | null
          recommended_at?: string | null
          recommended_by_unit_id?: string | null
          recommended_by_user_id?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["marketplace_venue_status"]
          submitted_by?: string | null
          updated_at?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_venues_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venues_kyc_case_id_fkey"
            columns: ["kyc_case_id"]
            isOneToOne: false
            referencedRelation: "kyc_verification_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venues_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: true
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venues_recommended_by_unit_id_fkey"
            columns: ["recommended_by_unit_id"]
            isOneToOne: false
            referencedRelation: "marketplace_bdp_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venues_recommended_by_user_id_fkey"
            columns: ["recommended_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venues_rejected_by_fkey"
            columns: ["rejected_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_venues_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      notification_dead_letters: {
        Row: {
          attempt_count: number
          created_at: string
          disposed_at: string | null
          disposed_by: string | null
          disposition: string
          id: string
          intent_id: string
          last_error: string | null
          reason: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          disposed_at?: string | null
          disposed_by?: string | null
          disposition?: string
          id?: string
          intent_id: string
          last_error?: string | null
          reason: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          disposed_at?: string | null
          disposed_by?: string | null
          disposition?: string
          id?: string
          intent_id?: string
          last_error?: string | null
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_dead_letters_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: true
            referencedRelation: "notification_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_deliveries: {
        Row: {
          attempted_at: string
          channel: string
          created_at: string
          id: string
          intent_id: string
          provider: string
          provider_message_id: string | null
          response: Json
          status: string
        }
        Insert: {
          attempted_at?: string
          channel: string
          created_at?: string
          id?: string
          intent_id: string
          provider?: string
          provider_message_id?: string | null
          response?: Json
          status?: string
        }
        Update: {
          attempted_at?: string
          channel?: string
          created_at?: string
          id?: string
          intent_id?: string
          provider?: string
          provider_message_id?: string | null
          response?: Json
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_deliveries_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "notification_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_intents: {
        Row: {
          attempt_count: number
          category: string
          channel: string
          correlation_id: string | null
          created_at: string
          deep_link: string | null
          delivered_at: string | null
          id: string
          idempotency_key: string
          last_error: string | null
          locale: string
          max_attempts: number
          next_attempt_at: string | null
          payload: Json
          priority: string
          provider: string | null
          recipient_user_id: string
          scheduled_at: string
          source_domain: string | null
          source_event_id: string | null
          status: string
          template_key: string
          template_version: number | null
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          category: string
          channel: string
          correlation_id?: string | null
          created_at?: string
          deep_link?: string | null
          delivered_at?: string | null
          id?: string
          idempotency_key: string
          last_error?: string | null
          locale?: string
          max_attempts?: number
          next_attempt_at?: string | null
          payload?: Json
          priority?: string
          provider?: string | null
          recipient_user_id: string
          scheduled_at?: string
          source_domain?: string | null
          source_event_id?: string | null
          status?: string
          template_key: string
          template_version?: number | null
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          category?: string
          channel?: string
          correlation_id?: string | null
          created_at?: string
          deep_link?: string | null
          delivered_at?: string | null
          id?: string
          idempotency_key?: string
          last_error?: string | null
          locale?: string
          max_attempts?: number
          next_attempt_at?: string | null
          payload?: Json
          priority?: string
          provider?: string | null
          recipient_user_id?: string
          scheduled_at?: string
          source_domain?: string | null
          source_event_id?: string | null
          status?: string
          template_key?: string
          template_version?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      notification_preference_events: {
        Row: {
          actor_user_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          category_overrides: Json
          created_at: string
          email_enabled: boolean
          in_app_enabled: boolean
          marketing_opt_in: boolean
          push_enabled: boolean
          sms_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          category_overrides?: Json
          created_at?: string
          email_enabled?: boolean
          in_app_enabled?: boolean
          marketing_opt_in?: boolean
          push_enabled?: boolean
          sms_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          category_overrides?: Json
          created_at?: string
          email_enabled?: boolean
          in_app_enabled?: boolean
          marketing_opt_in?: boolean
          push_enabled?: boolean
          sms_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          body_template: string
          category: string
          channel: string
          created_at: string
          id: string
          is_active: boolean
          locale: string
          subject_template: string | null
          template_key: string
          title_template: string
          updated_at: string
          variables_schema: Json
          version: number
        }
        Insert: {
          body_template: string
          category: string
          channel: string
          created_at?: string
          id?: string
          is_active?: boolean
          locale?: string
          subject_template?: string | null
          template_key: string
          title_template: string
          updated_at?: string
          variables_schema?: Json
          version?: number
        }
        Update: {
          body_template?: string
          category?: string
          channel?: string
          created_at?: string
          id?: string
          is_active?: boolean
          locale?: string
          subject_template?: string | null
          template_key?: string
          title_template?: string
          updated_at?: string
          variables_schema?: Json
          version?: number
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
      offline_payment_records: {
        Row: {
          amount_minor: number
          bank_reference: string
          created_at: string
          currency: string
          discrepancy_notes: string | null
          id: string
          matched_payment_intent_id: string | null
          metadata: Json
          method: string
          payer_user_id: string | null
          proof_ref: string | null
          received_on: string
          reconciliation_status: Database["public"]["Enums"]["reconciliation_status"]
          recorded_by: string | null
          source_domain: string
          source_id: string | null
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          amount_minor: number
          bank_reference: string
          created_at?: string
          currency?: string
          discrepancy_notes?: string | null
          id?: string
          matched_payment_intent_id?: string | null
          metadata?: Json
          method: string
          payer_user_id?: string | null
          proof_ref?: string | null
          received_on: string
          reconciliation_status?: Database["public"]["Enums"]["reconciliation_status"]
          recorded_by?: string | null
          source_domain: string
          source_id?: string | null
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          amount_minor?: number
          bank_reference?: string
          created_at?: string
          currency?: string
          discrepancy_notes?: string | null
          id?: string
          matched_payment_intent_id?: string | null
          metadata?: Json
          method?: string
          payer_user_id?: string | null
          proof_ref?: string | null
          received_on?: string
          reconciliation_status?: Database["public"]["Enums"]["reconciliation_status"]
          recorded_by?: string | null
          source_domain?: string
          source_id?: string | null
          updated_at?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offline_payment_records_matched_payment_intent_id_fkey"
            columns: ["matched_payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offline_payment_records_payer_user_id_fkey"
            columns: ["payer_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offline_payment_records_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offline_payment_records_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      operational_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_key: string
          details: Json
          first_seen_at: string
          id: string
          last_seen_at: string
          occurrence_count: number
          resolved_at: string | null
          severity: string
          status: string
          summary: string
          threshold_config: Json
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_key: string
          details?: Json
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          occurrence_count?: number
          resolved_at?: string | null
          severity?: string
          status?: string
          summary: string
          threshold_config?: Json
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_key?: string
          details?: Json
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          occurrence_count?: number
          resolved_at?: string | null
          severity?: string
          status?: string
          summary?: string
          threshold_config?: Json
          title?: string
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
          payload_hash: string | null
          processed_at: string | null
          processing_status: string
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_event_id: string | null
          received_at: string
          replay_detected: boolean
          signature_valid: boolean | null
        }
        Insert: {
          correlation_id?: string | null
          error_message?: string | null
          id?: string
          idempotency_key: string
          payload: Json
          payload_hash?: string | null
          processed_at?: string | null
          processing_status?: string
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_event_id?: string | null
          received_at?: string
          replay_detected?: boolean
          signature_valid?: boolean | null
        }
        Update: {
          correlation_id?: string | null
          error_message?: string | null
          id?: string
          idempotency_key?: string
          payload?: Json
          payload_hash?: string | null
          processed_at?: string | null
          processing_status?: string
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_event_id?: string | null
          received_at?: string
          replay_detected?: boolean
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
      payout_items: {
        Row: {
          batch_id: string | null
          batch_item_id: string | null
          created_at: string
          deductions_minor: number
          gross_minor: number
          hold_id: string | null
          id: string
          metadata: Json
          net_minor: number
          payee_org_id: string | null
          payee_user_id: string | null
          payout_destination_ref: string | null
          recovery_minor: number
          stakeholder_type: string
          status: string
          updated_at: string
        }
        Insert: {
          batch_id?: string | null
          batch_item_id?: string | null
          created_at?: string
          deductions_minor?: number
          gross_minor?: number
          hold_id?: string | null
          id?: string
          metadata?: Json
          net_minor?: number
          payee_org_id?: string | null
          payee_user_id?: string | null
          payout_destination_ref?: string | null
          recovery_minor?: number
          stakeholder_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          batch_id?: string | null
          batch_item_id?: string | null
          created_at?: string
          deductions_minor?: number
          gross_minor?: number
          hold_id?: string | null
          id?: string
          metadata?: Json
          net_minor?: number
          payee_org_id?: string | null
          payee_user_id?: string | null
          payout_destination_ref?: string | null
          recovery_minor?: number
          stakeholder_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "settlement_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_items_batch_item_id_fkey"
            columns: ["batch_item_id"]
            isOneToOne: false
            referencedRelation: "settlement_batch_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_items_hold_id_fkey"
            columns: ["hold_id"]
            isOneToOne: false
            referencedRelation: "financial_holds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_items_payee_org_id_fkey"
            columns: ["payee_org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_items_payee_user_id_fkey"
            columns: ["payee_user_id"]
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
      privacy_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          details: Json
          id: string
          request_type: string
          requester_user_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          details?: Json
          id?: string
          request_type: string
          requester_user_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          details?: Json
          id?: string
          request_type?: string
          requester_user_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
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
      push_subscriptions: {
        Row: {
          created_at: string
          endpoint_hash: string
          endpoint_ref: string
          id: string
          is_active: boolean
          last_seen_at: string
          metadata: Json
          provider: string
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint_hash: string
          endpoint_ref: string
          id?: string
          is_active?: boolean
          last_seen_at?: string
          metadata?: Json
          provider?: string
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          endpoint_hash?: string
          endpoint_ref?: string
          id?: string
          is_active?: boolean
          last_seen_at?: string
          metadata?: Json
          provider?: string
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      reconciliation_records: {
        Row: {
          amount_minor: number | null
          created_at: string
          domain: string
          exception_queue: boolean
          id: string
          left_ref: string
          metadata: Json
          notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          right_ref: string | null
          status: Database["public"]["Enums"]["reconciliation_status"]
          updated_at: string
        }
        Insert: {
          amount_minor?: number | null
          created_at?: string
          domain: string
          exception_queue?: boolean
          id?: string
          left_ref: string
          metadata?: Json
          notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          right_ref?: string | null
          status?: Database["public"]["Enums"]["reconciliation_status"]
          updated_at?: string
        }
        Update: {
          amount_minor?: number | null
          created_at?: string
          domain?: string
          exception_queue?: boolean
          id?: string
          left_ref?: string
          metadata?: Json
          notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          right_ref?: string | null
          status?: Database["public"]["Enums"]["reconciliation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reconciliation_records_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recovery_applications: {
        Row: {
          applied_minor: number
          cap_minor: number
          created_at: string
          created_by: string | null
          cycle_key: string
          entitlement_id: string
          id: string
          metadata: Json
          pack_or_unit_ref: string | null
          remaining_after_minor: number
          remaining_before_minor: number
          rule_version: string
          vertical: Database["public"]["Enums"]["finance_vertical"]
        }
        Insert: {
          applied_minor: number
          cap_minor?: number
          created_at?: string
          created_by?: string | null
          cycle_key: string
          entitlement_id: string
          id?: string
          metadata?: Json
          pack_or_unit_ref?: string | null
          remaining_after_minor: number
          remaining_before_minor: number
          rule_version?: string
          vertical: Database["public"]["Enums"]["finance_vertical"]
        }
        Update: {
          applied_minor?: number
          cap_minor?: number
          created_at?: string
          created_by?: string | null
          cycle_key?: string
          entitlement_id?: string
          id?: string
          metadata?: Json
          pack_or_unit_ref?: string | null
          remaining_after_minor?: number
          remaining_before_minor?: number
          rule_version?: string
          vertical?: Database["public"]["Enums"]["finance_vertical"]
        }
        Relationships: [
          {
            foreignKeyName: "recovery_applications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recovery_applications_entitlement_id_fkey"
            columns: ["entitlement_id"]
            isOneToOne: false
            referencedRelation: "stakeholder_entitlements"
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
      retention_policies: {
        Row: {
          created_at: string
          data_class: string
          deletion_or_anonymisation: string
          id: string
          legal_hold_exception: boolean
          notes: string | null
          period_status: string
          policy_key: string
          retention_basis: string
          retention_period_days: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_class: string
          deletion_or_anonymisation?: string
          id?: string
          legal_hold_exception?: boolean
          notes?: string | null
          period_status?: string
          policy_key: string
          retention_basis?: string
          retention_period_days?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_class?: string
          deletion_or_anonymisation?: string
          id?: string
          legal_hold_exception?: boolean
          notes?: string | null
          period_status?: string
          policy_key?: string
          retention_basis?: string
          retention_period_days?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      retention_reviews: {
        Row: {
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision: string | null
          eligibility: string
          id: string
          policy_key: string
          subject_ref: string | null
        }
        Insert: {
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision?: string | null
          eligibility?: string
          id?: string
          policy_key: string
          subject_ref?: string | null
        }
        Update: {
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision?: string | null
          eligibility?: string
          id?: string
          policy_key?: string
          subject_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retention_reviews_policy_key_fkey"
            columns: ["policy_key"]
            isOneToOne: false
            referencedRelation: "retention_policies"
            referencedColumns: ["policy_key"]
          },
        ]
      }
      revenue_components: {
        Row: {
          attribution_snapshot: Json
          created_at: string
          currency: string
          domain_object_id: string | null
          domain_object_type: string
          eligible_base_minor: number
          excluded_amount_minor: number
          financial_transaction_id: string | null
          gross_amount_minor: number
          id: string
          metadata: Json
          payment_intent_id: string | null
          recognised_at: string | null
          recognition_status: Database["public"]["Enums"]["revenue_recognition_status"]
          revenue_component_key: string
          rule_version: string
          source_ids: Json
          tax_amount_minor: number
          updated_at: string
          vertical: Database["public"]["Enums"]["finance_vertical"]
        }
        Insert: {
          attribution_snapshot?: Json
          created_at?: string
          currency?: string
          domain_object_id?: string | null
          domain_object_type: string
          eligible_base_minor?: number
          excluded_amount_minor?: number
          financial_transaction_id?: string | null
          gross_amount_minor?: number
          id?: string
          metadata?: Json
          payment_intent_id?: string | null
          recognised_at?: string | null
          recognition_status?: Database["public"]["Enums"]["revenue_recognition_status"]
          revenue_component_key: string
          rule_version?: string
          source_ids?: Json
          tax_amount_minor?: number
          updated_at?: string
          vertical: Database["public"]["Enums"]["finance_vertical"]
        }
        Update: {
          attribution_snapshot?: Json
          created_at?: string
          currency?: string
          domain_object_id?: string | null
          domain_object_type?: string
          eligible_base_minor?: number
          excluded_amount_minor?: number
          financial_transaction_id?: string | null
          gross_amount_minor?: number
          id?: string
          metadata?: Json
          payment_intent_id?: string | null
          recognised_at?: string | null
          recognition_status?: Database["public"]["Enums"]["revenue_recognition_status"]
          revenue_component_key?: string
          rule_version?: string
          source_ids?: Json
          tax_amount_minor?: number
          updated_at?: string
          vertical?: Database["public"]["Enums"]["finance_vertical"]
        }
        Relationships: [
          {
            foreignKeyName: "revenue_components_financial_transaction_id_fkey"
            columns: ["financial_transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_components_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
        ]
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
      risk_signals: {
        Row: {
          actor_user_id: string | null
          auto_action_applied: string
          category: string
          created_at: string
          details: Json
          id: string
          idempotency_key: string
          recommendation: string
          review_status: string
          reviewed_at: string | null
          reviewed_by: string | null
          score_bps: number
          signal_type: string
          subject_id: string
          subject_type: string
        }
        Insert: {
          actor_user_id?: string | null
          auto_action_applied?: string
          category?: string
          created_at?: string
          details?: Json
          id?: string
          idempotency_key: string
          recommendation?: string
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          score_bps?: number
          signal_type: string
          subject_id: string
          subject_type: string
        }
        Update: {
          actor_user_id?: string | null
          auto_action_applied?: string
          category?: string
          created_at?: string
          details?: Json
          id?: string
          idempotency_key?: string
          recommendation?: string
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          score_bps?: number
          signal_type?: string
          subject_id?: string
          subject_type?: string
        }
        Relationships: []
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
      security_events: {
        Row: {
          actor_user_id: string | null
          correlation_id: string | null
          created_at: string
          details: Json
          event_type: string
          id: string
          organisation_id: string | null
          severity: string
          source: string
          subject_id: string | null
          subject_type: string | null
          summary: string
          workspace_key: string | null
        }
        Insert: {
          actor_user_id?: string | null
          correlation_id?: string | null
          created_at?: string
          details?: Json
          event_type: string
          id?: string
          organisation_id?: string | null
          severity?: string
          source?: string
          subject_id?: string | null
          subject_type?: string | null
          summary: string
          workspace_key?: string | null
        }
        Update: {
          actor_user_id?: string | null
          correlation_id?: string | null
          created_at?: string
          details?: Json
          event_type?: string
          id?: string
          organisation_id?: string | null
          severity?: string
          source?: string
          subject_id?: string | null
          subject_type?: string | null
          summary?: string
          workspace_key?: string | null
        }
        Relationships: []
      }
      sensitive_access_events: {
        Row: {
          access_result: string
          actor_user_id: string
          created_at: string
          id: string
          purpose: string | null
          record_id: string
          record_type: string
          workspace_key: string | null
        }
        Insert: {
          access_result?: string
          actor_user_id: string
          created_at?: string
          id?: string
          purpose?: string | null
          record_id: string
          record_type: string
          workspace_key?: string | null
        }
        Update: {
          access_result?: string
          actor_user_id?: string
          created_at?: string
          id?: string
          purpose?: string | null
          record_id?: string
          record_type?: string
          workspace_key?: string | null
        }
        Relationships: []
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
      settlement_batch_items: {
        Row: {
          batch_id: string
          created_at: string
          entitlement_id: string
          gross_minor: number
          id: string
          metadata: Json
          net_minor: number
          recovery_minor: number
          status: string
        }
        Insert: {
          batch_id: string
          created_at?: string
          entitlement_id: string
          gross_minor?: number
          id?: string
          metadata?: Json
          net_minor?: number
          recovery_minor?: number
          status?: string
        }
        Update: {
          batch_id?: string
          created_at?: string
          entitlement_id?: string
          gross_minor?: number
          id?: string
          metadata?: Json
          net_minor?: number
          recovery_minor?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlement_batch_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "settlement_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlement_batch_items_entitlement_id_fkey"
            columns: ["entitlement_id"]
            isOneToOne: false
            referencedRelation: "stakeholder_entitlements"
            referencedColumns: ["id"]
          },
        ]
      }
      settlement_batches: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          batch_ref: string
          created_at: string
          currency: string
          executed_at: string | null
          execution_blocked_reason: string | null
          generated_at: string | null
          gross_total_minor: number
          id: string
          item_count: number
          metadata: Json
          net_total_minor: number
          period_end: string
          period_start: string
          reconciliation_status:
            | Database["public"]["Enums"]["reconciliation_status"]
            | null
          recovery_total_minor: number
          status: Database["public"]["Enums"]["settlement_batch_status"]
          updated_at: string
          vertical: Database["public"]["Enums"]["finance_vertical"]
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          batch_ref: string
          created_at?: string
          currency?: string
          executed_at?: string | null
          execution_blocked_reason?: string | null
          generated_at?: string | null
          gross_total_minor?: number
          id?: string
          item_count?: number
          metadata?: Json
          net_total_minor?: number
          period_end: string
          period_start: string
          reconciliation_status?:
            | Database["public"]["Enums"]["reconciliation_status"]
            | null
          recovery_total_minor?: number
          status?: Database["public"]["Enums"]["settlement_batch_status"]
          updated_at?: string
          vertical?: Database["public"]["Enums"]["finance_vertical"]
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          batch_ref?: string
          created_at?: string
          currency?: string
          executed_at?: string | null
          execution_blocked_reason?: string | null
          generated_at?: string | null
          gross_total_minor?: number
          id?: string
          item_count?: number
          metadata?: Json
          net_total_minor?: number
          period_end?: string
          period_start?: string
          reconciliation_status?:
            | Database["public"]["Enums"]["reconciliation_status"]
            | null
          recovery_total_minor?: number
          status?: Database["public"]["Enums"]["settlement_batch_status"]
          updated_at?: string
          vertical?: Database["public"]["Enums"]["finance_vertical"]
        }
        Relationships: [
          {
            foreignKeyName: "settlement_batches_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stakeholder_entitlements: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          attribution_ref: string | null
          created_at: string
          earning_event_key: string
          gross_eligible_basis_minor: number
          gross_entitlement_minor: number
          id: string
          metadata: Json
          net_settlement_eligible_minor: number
          rate_bps: number
          recognised_at: string | null
          recovery_deduction_minor: number
          revenue_component_id: string
          revenue_component_key: string
          reversal_amount_minor: number
          rule_key: string
          rule_version: string
          settlement_batch_id: string | null
          source_vertical: Database["public"]["Enums"]["finance_vertical"]
          stakeholder_org_id: string | null
          stakeholder_type: string
          stakeholder_user_id: string | null
          status: Database["public"]["Enums"]["stakeholder_entitlement_status"]
          updated_at: string
          vertical_source_ref: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          attribution_ref?: string | null
          created_at?: string
          earning_event_key: string
          gross_eligible_basis_minor?: number
          gross_entitlement_minor?: number
          id?: string
          metadata?: Json
          net_settlement_eligible_minor?: number
          rate_bps?: number
          recognised_at?: string | null
          recovery_deduction_minor?: number
          revenue_component_id: string
          revenue_component_key: string
          reversal_amount_minor?: number
          rule_key: string
          rule_version: string
          settlement_batch_id?: string | null
          source_vertical: Database["public"]["Enums"]["finance_vertical"]
          stakeholder_org_id?: string | null
          stakeholder_type: string
          stakeholder_user_id?: string | null
          status?: Database["public"]["Enums"]["stakeholder_entitlement_status"]
          updated_at?: string
          vertical_source_ref?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          attribution_ref?: string | null
          created_at?: string
          earning_event_key?: string
          gross_eligible_basis_minor?: number
          gross_entitlement_minor?: number
          id?: string
          metadata?: Json
          net_settlement_eligible_minor?: number
          rate_bps?: number
          recognised_at?: string | null
          recovery_deduction_minor?: number
          revenue_component_id?: string
          revenue_component_key?: string
          reversal_amount_minor?: number
          rule_key?: string
          rule_version?: string
          settlement_batch_id?: string | null
          source_vertical?: Database["public"]["Enums"]["finance_vertical"]
          stakeholder_org_id?: string | null
          stakeholder_type?: string
          stakeholder_user_id?: string | null
          status?: Database["public"]["Enums"]["stakeholder_entitlement_status"]
          updated_at?: string
          vertical_source_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stakeholder_entitlements_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stakeholder_entitlements_revenue_component_id_fkey"
            columns: ["revenue_component_id"]
            isOneToOne: false
            referencedRelation: "revenue_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stakeholder_entitlements_settlement_batch_id_fkey"
            columns: ["settlement_batch_id"]
            isOneToOne: false
            referencedRelation: "settlement_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stakeholder_entitlements_stakeholder_org_id_fkey"
            columns: ["stakeholder_org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stakeholder_entitlements_stakeholder_user_id_fkey"
            columns: ["stakeholder_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      tax_component_refs: {
        Row: {
          account_mapping_key: string | null
          amount_minor: number | null
          created_at: string
          id: string
          metadata: Json
          rate_bps: number | null
          revenue_component_id: string | null
          tax_kind: string
          validation_status: string
        }
        Insert: {
          account_mapping_key?: string | null
          amount_minor?: number | null
          created_at?: string
          id?: string
          metadata?: Json
          rate_bps?: number | null
          revenue_component_id?: string | null
          tax_kind: string
          validation_status?: string
        }
        Update: {
          account_mapping_key?: string | null
          amount_minor?: number | null
          created_at?: string
          id?: string
          metadata?: Json
          rate_bps?: number | null
          revenue_component_id?: string | null
          tax_kind?: string
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_component_refs_revenue_component_id_fkey"
            columns: ["revenue_component_id"]
            isOneToOne: false
            referencedRelation: "revenue_components"
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
      venue_performance_rank_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          delta: number
          event_type: string
          id: string
          metadata: Json
          resulting_score: number | null
          rule_version: string
          source_id: string | null
          source_type: string | null
          venue_id: string
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          delta?: number
          event_type: string
          id?: string
          metadata?: Json
          resulting_score?: number | null
          rule_version?: string
          source_id?: string | null
          source_type?: string | null
          venue_id: string
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          delta?: number
          event_type?: string
          id?: string
          metadata?: Json
          resulting_score?: number | null
          rule_version?: string
          source_id?: string | null
          source_type?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_performance_rank_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_performance_rank_events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "marketplace_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_performance_rank_snapshots: {
        Row: {
          event_count: number
          formula_status: string
          public_display_allowed: boolean
          rule_version: string
          score: number
          updated_at: string
          venue_id: string
        }
        Insert: {
          event_count?: number
          formula_status?: string
          public_display_allowed?: boolean
          rule_version?: string
          score?: number
          updated_at?: string
          venue_id: string
        }
        Update: {
          event_count?: number
          formula_status?: string
          public_display_allowed?: boolean
          rule_version?: string
          score?: number
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_performance_rank_snapshots_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: true
            referencedRelation: "marketplace_venues"
            referencedColumns: ["id"]
          },
        ]
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
      gce_assert_txn_balanced: { Args: { p_txn_id: string }; Returns: boolean }
      gce_assist_emit_event: {
        Args: {
          p_actor: string
          p_lead_id: string
          p_payload?: Json
          p_type: string
        }
        Returns: {
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          lead_id: string | null
          payload: Json
        }
        SetofOptions: {
          from: "*"
          to: "assist_domain_events"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      gce_assist_reconcile_outcome: {
        Args: { p_outcome_id: string }
        Returns: {
          confirmed_amount_minor: number | null
          confirmed_at: string | null
          created_at: string
          creates_finance_transaction: boolean
          currency: string
          declared_amount_minor: number | null
          dispute_reason: string | null
          giver_amount_minor: number | null
          giver_status: Database["public"]["Enums"]["assist_outcome_party_status"]
          giver_submitted_at: string | null
          id: string
          lead_id: string
          metadata: Json
          outcome_type: string
          receiver_amount_minor: number | null
          receiver_status: Database["public"]["Enums"]["assist_outcome_party_status"]
          receiver_submitted_at: string | null
          status: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "assist_lead_outcomes"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      gce_circle_statuses_for_count: {
        Args: { p_count: number }
        Returns: {
          constitution: Database["public"]["Enums"]["circle_constitution_status"]
          lifecycle: Database["public"]["Enums"]["circle_lifecycle_status"]
        }[]
      }
      gce_claim_revenue_component: {
        Args: {
          p_entitlement_ref?: string
          p_key: string
          p_stakeholder: string
          p_vertical: string
        }
        Returns: {
          created_at: string
          entitlement_ref: string | null
          metadata: Json
          revenue_component_key: string
          source_vertical: string
          stakeholder_family: string
        }
        SetofOptions: {
          from: "*"
          to: "gce_commissioned_revenue_components"
          isOneToOne: true
          isSetofReturn: false
        }
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
      gce_ebdp_refresh_client_counts: {
        Args: { p_pack_id: string }
        Returns: {
          activated_at: string | null
          active_client_count: number
          application_status: Database["public"]["Enums"]["enterprise_bdp_pack_status"]
          clients_capacity_max: number
          created_at: string
          id: string
          initial_payment_minor: number
          metadata: Json
          offline_payment_ref: string | null
          package_option: Database["public"]["Enums"]["enterprise_bdp_package_option"]
          package_total_minor: number
          payment_intent_id: string | null
          pricing_rule_version: string
          recoverable_balance_minor: number
          recovered_to_date_minor: number
          remaining_recoverable_minor: number
          role_assignment_id: string | null
          suspended_at: string | null
          terminated_at: string | null
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "enterprise_bdp_packs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      gce_finance_claim_stakeholder: {
        Args: {
          p_entitlement_ref?: string
          p_key: string
          p_stakeholder: string
          p_vertical: string
        }
        Returns: {
          created_at: string
          entitlement_ref: string | null
          metadata: Json
          revenue_component_key: string
          source_vertical: string
          stakeholder_family: string
        }
        SetofOptions: {
          from: "*"
          to: "gce_commissioned_revenue_components"
          isOneToOne: true
          isSetofReturn: false
        }
      }
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
      gce_is_compliance_admin: { Args: never; Returns: boolean }
      gce_is_connect_bdp_owner: {
        Args: { p_unit_id: string }
        Returns: boolean
      }
      gce_is_ebdp_pack_owner: { Args: { p_pack_id: string }; Returns: boolean }
      gce_is_enterprise_client_rep: {
        Args: { p_client_id: string }
        Returns: boolean
      }
      gce_is_enterprise_expert: { Args: never; Returns: boolean }
      gce_is_finance_admin: { Args: never; Returns: boolean }
      gce_is_identity_suspended: {
        Args: { p_user_id?: string }
        Returns: boolean
      }
      gce_is_marketplace_venue_rep: {
        Args: { p_venue_id: string }
        Returns: boolean
      }
      gce_is_mbdp_unit_owner: { Args: { p_unit_id: string }; Returns: boolean }
      gce_is_opportunity_desk: { Args: never; Returns: boolean }
      gce_is_org_member: {
        Args: { p_organisation_id: string }
        Returns: boolean
      }
      gce_is_platform_admin: { Args: never; Returns: boolean }
      gce_is_security_ops: { Args: never; Returns: boolean }
      gce_is_support_or_platform_admin: { Args: never; Returns: boolean }
      gce_marketplace_claim_offer: {
        Args: {
          p_claimant: string
          p_expires_at: string
          p_offer_id: string
          p_token_hash: string
        }
        Returns: {
          claim_token_hash: string
          claimant_user_id: string
          claimed_at: string
          created_at: string
          expires_at: string
          id: string
          metadata: Json
          non_purchase_notes: string | null
          non_purchase_reason: string | null
          offer_event_id: string
          penalty_exempt: boolean
          redeemed_at: string | null
          status: Database["public"]["Enums"]["marketplace_claim_status"]
          updated_at: string
          venue_response: string | null
        }
        SetofOptions: {
          from: "*"
          to: "marketplace_offer_claims"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      gce_marketplace_create_booking: {
        Args: {
          p_buyer: string
          p_event_id: string
          p_idempotency_key?: string
          p_quantity: number
        }
        Returns: {
          attribution_id: string | null
          buyer_user_id: string
          cancel_cutoff_hours: number
          cancel_policy_version: string
          created_at: string
          currency: string
          event_id: string
          id: string
          idempotency_key: string | null
          metadata: Json
          payment_intent_id: string | null
          quantity: number
          status: Database["public"]["Enums"]["marketplace_booking_status"]
          total_minor: number
          unit_price_minor: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "marketplace_bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      gce_marketplace_redeem_claim: {
        Args: {
          p_actor?: string
          p_claim_id: string
          p_redemption_token_hash: string
          p_sale_confirmed?: boolean
          p_sale_reference?: string
        }
        Returns: {
          claim_id: string
          created_at: string
          id: string
          metadata: Json
          offer_event_id: string
          redeemed_by_staff_user_id: string | null
          redemption_token_hash: string
          sale_confirmed: boolean
          sale_reference: string | null
          status: string
          venue_id: string
        }
        SetofOptions: {
          from: "*"
          to: "marketplace_redemptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      gce_marketplace_split: {
        Args: { p_eligible_minor: number; p_has_attribution: boolean }
        Returns: {
          gce_share_minor: number
          mbdp_commission_bps: number
          mbdp_share_minor: number
          venue_share_minor: number
        }[]
      }
      gce_marketplace_ticket_check_in: {
        Args: {
          p_actor?: string
          p_presented_token_hash: string
          p_ticket_id: string
        }
        Returns: {
          booking_id: string
          checked_in_at: string | null
          checked_in_by: string | null
          created_at: string
          event_id: string
          holder_user_id: string
          id: string
          issued_at: string
          metadata: Json
          qr_token_hash: string
          status: Database["public"]["Enums"]["marketplace_ticket_status"]
          ticket_ref: string
          updated_at: string
          voided_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "marketplace_tickets"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      gce_mbdp_apply_recovery: {
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
          to: "marketplace_bdp_recovery_entries"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      gce_mbdp_refresh_venue_counts: {
        Args: { p_unit_id: string }
        Returns: {
          activated_at: string | null
          active_venue_count: number
          application_status: Database["public"]["Enums"]["marketplace_bdp_application_status"]
          created_at: string
          id: string
          initial_payment_minor: number
          kyc_case_id: string | null
          metadata: Json
          offline_approved_by: string | null
          offline_payment_ref: string | null
          offline_recorded_by: string | null
          package_option: Database["public"]["Enums"]["marketplace_bdp_package_option"]
          package_total_minor: number
          payment_intent_id: string | null
          pricing_rule_version: string
          recoverable_balance_minor: number
          recovered_to_date_minor: number
          remaining_recoverable_minor: number
          role_assignment_id: string | null
          suspended_at: string | null
          terminated_at: string | null
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
          venues_capacity_max: number
        }
        SetofOptions: {
          from: "*"
          to: "marketplace_bdp_units"
          isOneToOne: true
          isSetofReturn: false
        }
      }
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
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
      assist_assignment_status:
        | "proposed"
        | "assigned"
        | "accepted"
        | "declined"
        | "expired"
        | "reassigned_closed"
        | "revoked"
      assist_lead_quality_status:
        | "unverified"
        | "preliminarily_verified"
        | "qualified"
        | "rejected"
      assist_lead_work_status:
        | "draft"
        | "submitted"
        | "classifying"
        | "classified"
        | "routing"
        | "routed"
        | "review_required"
        | "offered"
        | "accepted"
        | "declined"
        | "no_response"
        | "in_follow_up"
        | "reassigned"
        | "contact_revealed"
        | "outcome_pending"
        | "closed_dual_confirmed"
        | "closed_unconverted"
        | "expired"
        | "cancelled"
        | "disputed"
      assist_outcome_party_status:
        | "pending"
        | "submitted"
        | "confirmed"
        | "disputed"
      assist_privacy_level:
        | "standard"
        | "restricted"
        | "masked"
        | "manual_review"
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
      enterprise_attribution_status:
        | "unattributed"
        | "proposed"
        | "pending_evidence"
        | "active"
        | "disputed"
        | "suspended"
        | "reassigned_closed"
        | "voided"
      enterprise_bdp_pack_status:
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
      enterprise_bdp_package_option: "direct_30000" | "finance_recovery_36000"
      enterprise_client_status:
        | "draft"
        | "active"
        | "on_hold"
        | "suspended"
        | "terminated"
        | "archived"
      enterprise_entitlement_state:
        | "estimated"
        | "provisional"
        | "earned"
        | "on_hold"
        | "settlement_eligible"
        | "paid"
        | "reversed"
      enterprise_milestone_status:
        | "planned"
        | "due"
        | "submitted"
        | "accepted"
        | "disputed"
        | "completed"
        | "cancelled"
      enterprise_opportunity_status:
        | "draft"
        | "open"
        | "qualifying"
        | "proposal_in_progress"
        | "quoting"
        | "won"
        | "lost"
        | "on_hold"
        | "cancelled"
        | "archived"
      enterprise_project_status:
        | "setup"
        | "approved"
        | "active"
        | "on_hold"
        | "completed"
        | "cancelled"
        | "terminated"
      enterprise_quote_status:
        | "draft"
        | "internal_review"
        | "pending_finance_cosign"
        | "finance_cosigned"
        | "issued"
        | "viewed"
        | "accepted"
        | "rejected"
        | "changes_requested"
        | "expired"
        | "superseded"
        | "cancelled"
      finance_vertical:
        | "connect"
        | "marketplace"
        | "enterprise"
        | "platform"
        | "cross_vertical"
        | "other"
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
      legacy_enterprise_map_status:
        | "mapped"
        | "historical_only"
        | "ambiguous"
        | "needs_review"
        | "reusable_shell"
      legacy_marketplace_map_status:
        | "mapped"
        | "historical_only"
        | "ambiguous"
        | "needs_review"
        | "reusable_shell"
      legacy_membership_map_status:
        | "mapped"
        | "historical_only"
        | "ambiguous"
        | "needs_review"
      marketplace_attribution_status:
        | "unattributed"
        | "proposed"
        | "pending_evidence"
        | "active"
        | "disputed"
        | "suspended"
        | "reassigned_closed"
        | "voided"
      marketplace_bdp_application_status:
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
      marketplace_bdp_package_option: "direct_50000" | "finance_recovery_60000"
      marketplace_booking_status:
        | "draft"
        | "pending_payment"
        | "paid"
        | "confirmed"
        | "cancelled"
        | "refund_pending"
        | "refunded"
        | "failed"
      marketplace_claim_status:
        | "claimed"
        | "expired"
        | "redeemed"
        | "cancelled"
        | "voided"
        | "no_purchase"
      marketplace_entitlement_state:
        | "estimated"
        | "provisional"
        | "earned"
        | "on_hold"
        | "settlement_eligible"
        | "paid"
        | "reversed"
      marketplace_event_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "changes_requested"
        | "approved"
        | "published"
        | "suspended"
        | "closed"
        | "cancelled"
        | "rejected"
      marketplace_offer_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "changes_requested"
        | "approved"
        | "published"
        | "suspended"
        | "closed"
        | "expired"
        | "rejected"
      marketplace_ticket_status:
        | "issued"
        | "cancelled"
        | "checked_in"
        | "voided"
        | "expired"
      marketplace_venue_status:
        | "draft"
        | "submitted"
        | "pending_mbdp_recommendation"
        | "pending_platform_approval"
        | "active"
        | "temporarily_inactive"
        | "review_required"
        | "suspended"
        | "terminated"
        | "archived"
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
      reconciliation_status:
        | "matched"
        | "unmatched"
        | "mismatch"
        | "duplicate"
        | "under_review"
        | "resolved"
      revenue_recognition_status:
        | "payment_received"
        | "revenue_eligible"
        | "recognised"
        | "held"
        | "partially_reversed"
        | "reversed"
        | "cancelled"
      settlement_batch_status:
        | "draft"
        | "generated"
        | "under_review"
        | "approved"
        | "payout_ready"
        | "execution_blocked"
        | "executed"
        | "partially_failed"
        | "reconciled"
        | "cancelled"
      stakeholder_entitlement_status:
        | "estimated"
        | "provisional"
        | "earned"
        | "on_hold"
        | "settlement_eligible"
        | "approved"
        | "payable"
        | "paid"
        | "reversed"
        | "partially_reversed"
        | "cancelled"
        | "recoverable_balance"
        | "clawed_back"
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
      assist_assignment_status: [
        "proposed",
        "assigned",
        "accepted",
        "declined",
        "expired",
        "reassigned_closed",
        "revoked",
      ],
      assist_lead_quality_status: [
        "unverified",
        "preliminarily_verified",
        "qualified",
        "rejected",
      ],
      assist_lead_work_status: [
        "draft",
        "submitted",
        "classifying",
        "classified",
        "routing",
        "routed",
        "review_required",
        "offered",
        "accepted",
        "declined",
        "no_response",
        "in_follow_up",
        "reassigned",
        "contact_revealed",
        "outcome_pending",
        "closed_dual_confirmed",
        "closed_unconverted",
        "expired",
        "cancelled",
        "disputed",
      ],
      assist_outcome_party_status: [
        "pending",
        "submitted",
        "confirmed",
        "disputed",
      ],
      assist_privacy_level: [
        "standard",
        "restricted",
        "masked",
        "manual_review",
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
      enterprise_attribution_status: [
        "unattributed",
        "proposed",
        "pending_evidence",
        "active",
        "disputed",
        "suspended",
        "reassigned_closed",
        "voided",
      ],
      enterprise_bdp_pack_status: [
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
      enterprise_bdp_package_option: ["direct_30000", "finance_recovery_36000"],
      enterprise_client_status: [
        "draft",
        "active",
        "on_hold",
        "suspended",
        "terminated",
        "archived",
      ],
      enterprise_entitlement_state: [
        "estimated",
        "provisional",
        "earned",
        "on_hold",
        "settlement_eligible",
        "paid",
        "reversed",
      ],
      enterprise_milestone_status: [
        "planned",
        "due",
        "submitted",
        "accepted",
        "disputed",
        "completed",
        "cancelled",
      ],
      enterprise_opportunity_status: [
        "draft",
        "open",
        "qualifying",
        "proposal_in_progress",
        "quoting",
        "won",
        "lost",
        "on_hold",
        "cancelled",
        "archived",
      ],
      enterprise_project_status: [
        "setup",
        "approved",
        "active",
        "on_hold",
        "completed",
        "cancelled",
        "terminated",
      ],
      enterprise_quote_status: [
        "draft",
        "internal_review",
        "pending_finance_cosign",
        "finance_cosigned",
        "issued",
        "viewed",
        "accepted",
        "rejected",
        "changes_requested",
        "expired",
        "superseded",
        "cancelled",
      ],
      finance_vertical: [
        "connect",
        "marketplace",
        "enterprise",
        "platform",
        "cross_vertical",
        "other",
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
      legacy_enterprise_map_status: [
        "mapped",
        "historical_only",
        "ambiguous",
        "needs_review",
        "reusable_shell",
      ],
      legacy_marketplace_map_status: [
        "mapped",
        "historical_only",
        "ambiguous",
        "needs_review",
        "reusable_shell",
      ],
      legacy_membership_map_status: [
        "mapped",
        "historical_only",
        "ambiguous",
        "needs_review",
      ],
      marketplace_attribution_status: [
        "unattributed",
        "proposed",
        "pending_evidence",
        "active",
        "disputed",
        "suspended",
        "reassigned_closed",
        "voided",
      ],
      marketplace_bdp_application_status: [
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
      marketplace_bdp_package_option: [
        "direct_50000",
        "finance_recovery_60000",
      ],
      marketplace_booking_status: [
        "draft",
        "pending_payment",
        "paid",
        "confirmed",
        "cancelled",
        "refund_pending",
        "refunded",
        "failed",
      ],
      marketplace_claim_status: [
        "claimed",
        "expired",
        "redeemed",
        "cancelled",
        "voided",
        "no_purchase",
      ],
      marketplace_entitlement_state: [
        "estimated",
        "provisional",
        "earned",
        "on_hold",
        "settlement_eligible",
        "paid",
        "reversed",
      ],
      marketplace_event_status: [
        "draft",
        "submitted",
        "under_review",
        "changes_requested",
        "approved",
        "published",
        "suspended",
        "closed",
        "cancelled",
        "rejected",
      ],
      marketplace_offer_status: [
        "draft",
        "submitted",
        "under_review",
        "changes_requested",
        "approved",
        "published",
        "suspended",
        "closed",
        "expired",
        "rejected",
      ],
      marketplace_ticket_status: [
        "issued",
        "cancelled",
        "checked_in",
        "voided",
        "expired",
      ],
      marketplace_venue_status: [
        "draft",
        "submitted",
        "pending_mbdp_recommendation",
        "pending_platform_approval",
        "active",
        "temporarily_inactive",
        "review_required",
        "suspended",
        "terminated",
        "archived",
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
      reconciliation_status: [
        "matched",
        "unmatched",
        "mismatch",
        "duplicate",
        "under_review",
        "resolved",
      ],
      revenue_recognition_status: [
        "payment_received",
        "revenue_eligible",
        "recognised",
        "held",
        "partially_reversed",
        "reversed",
        "cancelled",
      ],
      settlement_batch_status: [
        "draft",
        "generated",
        "under_review",
        "approved",
        "payout_ready",
        "execution_blocked",
        "executed",
        "partially_failed",
        "reconciled",
        "cancelled",
      ],
      stakeholder_entitlement_status: [
        "estimated",
        "provisional",
        "earned",
        "on_hold",
        "settlement_eligible",
        "approved",
        "payable",
        "paid",
        "reversed",
        "partially_reversed",
        "cancelled",
        "recoverable_balance",
        "clawed_back",
      ],
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
