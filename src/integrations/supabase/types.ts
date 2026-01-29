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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'candidate' | 'recruiter'
          full_name: string | null
          email: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          role: 'candidate' | 'recruiter'
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'candidate' | 'recruiter'
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      job_roles: {
        Row: {
          id: string
          recruiter_id: string
          title: string
          company: string
          description: string | null
          location: string | null
          salary_range: string | null
          required_skills: { skillId: string; name: string; weight: number; minScore: number }[]
          posted_at: string
        }
        Insert: {
          id?: string
          recruiter_id: string
          title: string
          company: string
          description?: string | null
          location?: string | null
          salary_range?: string | null
          required_skills?: { skillId: string; name: string; weight: number; minScore: number }[]
          posted_at?: string
        }
        Update: {
          id?: string
          recruiter_id?: string
          title?: string
          company?: string
          description?: string | null
          location?: string | null
          salary_range?: string | null
          required_skills?: { skillId: string; name: string; weight: number; minScore: number }[]
          posted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_roles_recruiter_id_fkey"
            columns: ["recruiter_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      candidate_skills: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string | null
          score: number | null
          max_score: number | null
          target_score: number | null
          assessed_at: string | null
          status: 'pending' | 'assessed' | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category?: string | null
          score?: number | null
          max_score?: number | null
          target_score?: number | null
          assessed_at?: string | null
          status?: 'pending' | 'assessed' | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string | null
          score?: number | null
          max_score?: number | null
          target_score?: number | null
          assessed_at?: string | null
          status?: 'pending' | 'assessed' | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_skills_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      job_applications: {
        Row: {
          id: string
          job_role_id: string
          candidate_id: string
          status: 'pending' | 'accepted' | 'declined' | 'applied'
          match_percentage: number | null
          created_at: string
        }
        Insert: {
          id?: string
          job_role_id: string
          candidate_id: string
          status?: 'pending' | 'accepted' | 'declined' | 'applied'
          match_percentage?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          job_role_id?: string
          candidate_id?: string
          status?: 'pending' | 'accepted' | 'declined' | 'applied'
          match_percentage?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_candidate_id_fkey"
            columns: ["candidate_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_role_id_fkey"
            columns: ["job_role_id"]
            referencedRelation: "job_roles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
