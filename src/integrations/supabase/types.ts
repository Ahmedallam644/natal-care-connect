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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_risk_scores: {
        Row: {
          anemia_risk: number | null
          calculated_at: string | null
          fetal_growth_restriction_risk: number | null
          gestational_diabetes_risk: number | null
          id: string
          notes: string | null
          overall_risk_level: string | null
          patient_id: string
          preeclampsia_risk: number | null
          pregnancy_id: string | null
          preterm_birth_risk: number | null
        }
        Insert: {
          anemia_risk?: number | null
          calculated_at?: string | null
          fetal_growth_restriction_risk?: number | null
          gestational_diabetes_risk?: number | null
          id?: string
          notes?: string | null
          overall_risk_level?: string | null
          patient_id: string
          preeclampsia_risk?: number | null
          pregnancy_id?: string | null
          preterm_birth_risk?: number | null
        }
        Update: {
          anemia_risk?: number | null
          calculated_at?: string | null
          fetal_growth_restriction_risk?: number | null
          gestational_diabetes_risk?: number | null
          id?: string
          notes?: string | null
          overall_risk_level?: string | null
          patient_id?: string
          preeclampsia_risk?: number | null
          pregnancy_id?: string | null
          preterm_birth_risk?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_risk_scores_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_risk_scores_pregnancy_id_fkey"
            columns: ["pregnancy_id"]
            isOneToOne: false
            referencedRelation: "pregnancy_history"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_codes: {
        Row: {
          code: string
          created_at: string | null
          doctor_id: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          code: string
          created_at?: string | null
          doctor_id: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string | null
          doctor_id?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_codes_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          created_at: string | null
          hospital_id: string | null
          id: string
          is_active: boolean | null
          license_number: string | null
          specialty: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hospital_id?: string | null
          id?: string
          is_active?: boolean | null
          license_number?: string | null
          specialty?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          hospital_id?: string | null
          id?: string
          is_active?: boolean | null
          license_number?: string | null
          specialty?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_hospital_fk"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      fmc_records: {
        Row: {
          duration_minutes: number | null
          id: string
          kick_count: number
          notes: string | null
          patient_id: string
          pregnancy_id: string | null
          recorded_at: string | null
        }
        Insert: {
          duration_minutes?: number | null
          id?: string
          kick_count: number
          notes?: string | null
          patient_id: string
          pregnancy_id?: string | null
          recorded_at?: string | null
        }
        Update: {
          duration_minutes?: number | null
          id?: string
          kick_count?: number
          notes?: string | null
          patient_id?: string
          pregnancy_id?: string | null
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fmc_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fmc_records_pregnancy_id_fkey"
            columns: ["pregnancy_id"]
            isOneToOne: false
            referencedRelation: "pregnancy_history"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name_ar: string
          name_en: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name_ar: string
          name_en: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name_ar?: string
          name_en?: string
          phone?: string | null
        }
        Relationships: []
      }
      lab_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name_ar: string
          name_en: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name_ar: string
          name_en: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name_ar?: string
          name_en?: string
        }
        Relationships: []
      }
      lab_orders: {
        Row: {
          category_id: string | null
          doctor_id: string
          due_date: string | null
          id: string
          instructions: string | null
          ordered_at: string | null
          patient_id: string
          status: string | null
          test_name_ar: string
          test_name_en: string
        }
        Insert: {
          category_id?: string | null
          doctor_id: string
          due_date?: string | null
          id?: string
          instructions?: string | null
          ordered_at?: string | null
          patient_id: string
          status?: string | null
          test_name_ar: string
          test_name_en: string
        }
        Update: {
          category_id?: string | null
          doctor_id?: string
          due_date?: string | null
          id?: string
          instructions?: string | null
          ordered_at?: string | null
          patient_id?: string
          status?: string | null
          test_name_ar?: string
          test_name_en?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_orders_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "lab_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_results: {
        Row: {
          id: string
          notes: string | null
          order_id: string
          patient_id: string
          result_file_url: string | null
          result_value: string | null
          reviewed_at: string | null
          reviewed_by_doctor: boolean | null
          uploaded_at: string | null
        }
        Insert: {
          id?: string
          notes?: string | null
          order_id: string
          patient_id: string
          result_file_url?: string | null
          result_value?: string | null
          reviewed_at?: string | null
          reviewed_by_doctor?: boolean | null
          uploaded_at?: string | null
        }
        Update: {
          id?: string
          notes?: string | null
          order_id?: string
          patient_id?: string
          result_file_url?: string | null
          result_value?: string | null
          reviewed_at?: string | null
          reviewed_by_doctor?: boolean | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_results_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "lab_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_results_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications_log: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message_ar: string | null
          message_en: string | null
          title_ar: string | null
          title_en: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_ar?: string | null
          message_en?: string | null
          title_ar?: string | null
          title_en?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_ar?: string | null
          message_en?: string | null
          title_ar?: string | null
          title_en?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          blood_type: string | null
          created_at: string | null
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          id: string
          linked_doctor_id: string | null
          user_id: string
        }
        Insert: {
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          linked_doctor_id?: string | null
          user_id: string
        }
        Update: {
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          linked_doctor_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_linked_doctor_id_fkey"
            columns: ["linked_doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      pregnancy_history: {
        Row: {
          created_at: string | null
          expected_due_date: string | null
          id: string
          is_current: boolean | null
          last_menstrual_period: string | null
          notes: string | null
          outcome: string | null
          patient_id: string
          pregnancy_number: number | null
        }
        Insert: {
          created_at?: string | null
          expected_due_date?: string | null
          id?: string
          is_current?: boolean | null
          last_menstrual_period?: string | null
          notes?: string | null
          outcome?: string | null
          patient_id: string
          pregnancy_number?: number | null
        }
        Update: {
          created_at?: string | null
          expected_due_date?: string | null
          id?: string
          is_current?: boolean | null
          last_menstrual_period?: string | null
          notes?: string | null
          outcome?: string | null
          patient_id?: string
          pregnancy_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pregnancy_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          language_preference: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          language_preference?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          language_preference?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      symptoms: {
        Row: {
          id: string
          notes: string | null
          patient_id: string
          pregnancy_id: string | null
          recorded_at: string | null
          severity: number | null
          symptom_type: string
        }
        Insert: {
          id?: string
          notes?: string | null
          patient_id: string
          pregnancy_id?: string | null
          recorded_at?: string | null
          severity?: number | null
          symptom_type: string
        }
        Update: {
          id?: string
          notes?: string | null
          patient_id?: string
          pregnancy_id?: string | null
          recorded_at?: string | null
          severity?: number | null
          symptom_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "symptoms_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "symptoms_pregnancy_id_fkey"
            columns: ["pregnancy_id"]
            isOneToOne: false
            referencedRelation: "pregnancy_history"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "doctor" | "admin"
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
      app_role: ["patient", "doctor", "admin"],
    },
  },
} as const
