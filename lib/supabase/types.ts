export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type WorkflowStatus =
  | "SUBMITTED"
  | "AI_PROCESSED"
  | "NEEDS_HUMAN_REVIEW"
  | "PATH_A_RESOLVED"
  | "PATH_B_ROUTED"
  | "PATH_B_ACKNOWLEDGED"
  | "PATH_B_RESOLVED"
  | "PATH_C_CERTIFIED"
  | "PATH_C_PASSPORT_PUBLISHED"
  | "PATH_C_MATCHED"
  | "PATH_C_COMMITMENT_CONFIRMED"
  | "PILOT_READY"
  | "PILOT_ACTIVE"
  | "REJECTED";

export type SuggestedPath = "A" | "B" | "C";

export interface Database {
  public: {
    Tables: {
      reports: {
        Row: {
          id: string;
          tracking_id: string;
          recovery_phrase: string | null;
          title: string;
          description: string;
          category: string;
          district: string;
          block: string;
          village: string;
          status: WorkflowStatus;
          suggested_path: SuggestedPath;
          suggested_department: string | null;
          ai_confidence: number | null;
          ai_reasoning: string | null;
          is_likely_duplicate: boolean | null;
          duplicate_of_report_id: string | null;
          attachments: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          tracking_id: string;
          recovery_phrase?: string | null;
          title: string;
          description: string;
          category: string;
          district: string;
          block: string;
          village: string;
          status?: WorkflowStatus;
          suggested_path?: SuggestedPath;
          suggested_department?: string | null;
          ai_confidence?: number | null;
          ai_reasoning?: string | null;
          is_likely_duplicate?: boolean | null;
          duplicate_of_report_id?: string | null;
          attachments?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tracking_id?: string;
          recovery_phrase?: string | null;
          title?: string;
          description?: string;
          category?: string;
          district?: string;
          block?: string;
          village?: string;
          status?: WorkflowStatus;
          suggested_path?: SuggestedPath;
          suggested_department?: string | null;
          ai_confidence?: number | null;
          ai_reasoning?: string | null;
          is_likely_duplicate?: boolean | null;
          duplicate_of_report_id?: string | null;
          attachments?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_events: {
        Row: {
          id: string;
          report_id: string;
          from_status: WorkflowStatus;
          to_status: WorkflowStatus;
          actor_role: string;
          actor_name: string;
          reason: string;
          ip_metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          from_status: WorkflowStatus;
          to_status: WorkflowStatus;
          actor_role: string;
          actor_name: string;
          reason: string;
          ip_metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          from_status?: WorkflowStatus;
          to_status?: WorkflowStatus;
          actor_role?: string;
          actor_name?: string;
          reason?: string;
          ip_metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          role: string;
          title: string;
          message: string;
          report_id: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          role: string;
          title: string;
          message: string;
          report_id?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: string;
          title?: string;
          message?: string;
          report_id?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      problem_clusters: {
        Row: {
          id: string;
          cluster_code: string;
          title: string;
          category: string;
          district: string;
          status: string;
          evidence_rule_satisfied: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cluster_code: string;
          title: string;
          category: string;
          district: string;
          status?: string;
          evidence_rule_satisfied?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cluster_code?: string;
          title?: string;
          category?: string;
          district?: string;
          status?: string;
          evidence_rule_satisfied?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      challenges: {
        Row: {
          id: string;
          challenge_code: string;
          cluster_id: string | null;
          origin_report_id: string | null;
          title: string;
          redacted_problem_statement: string;
          district: string;
          block: string;
          status: WorkflowStatus;
          government_owner: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          challenge_code: string;
          cluster_id?: string | null;
          origin_report_id?: string | null;
          title: string;
          redacted_problem_statement: string;
          district: string;
          block: string;
          status?: WorkflowStatus;
          government_owner?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          challenge_code?: string;
          cluster_id?: string | null;
          origin_report_id?: string | null;
          title?: string;
          redacted_problem_statement?: string;
          district?: string;
          block?: string;
          status?: WorkflowStatus;
          government_owner?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      innovation_gap_certificates: {
        Row: {
          id: string;
          challenge_id: string;
          certificate_number: string;
          evidence_snapshot: Json;
          signers: Json;
          issued_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          certificate_number: string;
          evidence_snapshot?: Json;
          signers?: Json;
          issued_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          certificate_number?: string;
          evidence_snapshot?: Json;
          signers?: Json;
          issued_at?: string;
        };
        Relationships: [];
      };
      capability_cards: {
        Row: {
          id: string;
          institution_name: string;
          domain: string;
          lab_facilities: string[];
          faculty_mentors: Json;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          institution_name: string;
          domain: string;
          lab_facilities?: string[];
          faculty_mentors?: Json;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          institution_name?: string;
          domain?: string;
          lab_facilities?: string[];
          faculty_mentors?: Json;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      commitments: {
        Row: {
          id: string;
          challenge_id: string;
          organization_name: string;
          commitment_type: string;
          description: string;
          amount: number | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          organization_name: string;
          commitment_type: string;
          description: string;
          amount?: number | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          organization_name?: string;
          commitment_type?: string;
          description?: string;
          amount?: number | null;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      pilots: {
        Row: {
          id: string;
          challenge_id: string;
          department: string;
          target_site: string;
          baseline_metrics: Json;
          status: WorkflowStatus;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          department: string;
          target_site: string;
          baseline_metrics?: Json;
          status?: WorkflowStatus;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          department?: string;
          target_site?: string;
          baseline_metrics?: Json;
          status?: WorkflowStatus;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      workflow_status: WorkflowStatus;
      suggested_path: SuggestedPath;
    };
    CompositeTypes: Record<string, never>;
  };
}
