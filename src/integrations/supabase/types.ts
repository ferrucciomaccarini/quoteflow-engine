export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      credit_bureau_spreads: {
        Row: {
          bureau_score: number
          created_at: string
          id: string
          spread_rate: number
          updated_at: string
          user_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          bureau_score: number
          created_at?: string
          id?: string
          spread_rate: number
          updated_at?: string
          user_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          bureau_score?: number
          created_at?: string
          id?: string
          spread_rate?: number
          updated_at?: string
          user_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          establishment_date: string | null
          id: string
          name: string
          phone: string | null
          termination_date: string | null
          updated_at: string | null
          user_id: string
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          establishment_date?: string | null
          id?: string
          name: string
          phone?: string | null
          termination_date?: string | null
          updated_at?: string | null
          user_id: string
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          establishment_date?: string | null
          id?: string
          name?: string
          phone?: string | null
          termination_date?: string | null
          updated_at?: string | null
          user_id?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      internal_rating_spreads: {
        Row: {
          created_at: string
          id: string
          rating_score: number
          spread_rate: number
          updated_at: string
          user_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          rating_score: number
          spread_rate: number
          updated_at?: string
          user_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          rating_score?: number
          spread_rate?: number
          updated_at?: string
          user_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: []
      }
      machine_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      machine_services: {
        Row: {
          created_at: string | null
          id: string
          machine_id: string
          service_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          machine_id: string
          service_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          machine_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "machine_services_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      machines: {
        Row: {
          acquisition_value: number
          average_annual_usage_hours: number | null
          category: string
          category_id: string | null
          created_at: string | null
          customer_id: string | null
          daily_rate: number
          description: string | null
          estimated_useful_life: number | null
          hourly_rate: number
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          acquisition_value?: number
          average_annual_usage_hours?: number | null
          category: string
          category_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          daily_rate?: number
          description?: string | null
          estimated_useful_life?: number | null
          hourly_rate?: number
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          acquisition_value?: number
          average_annual_usage_hours?: number | null
          category?: string
          category_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          daily_rate?: number
          description?: string | null
          estimated_useful_life?: number | null
          hourly_rate?: number
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "machines_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "machine_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machines_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string | null
          company_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          role: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          contact_person: string | null
          contract_duration: number
          created_at: string
          customer_name: string
          id: string
          machine_name: string
          machine_value: number
          quote_data: Json
          services_value: number | null
          status: string
          time_horizon: number
          total_fee: number
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_person?: string | null
          contract_duration: number
          created_at?: string
          customer_name: string
          id?: string
          machine_name: string
          machine_value: number
          quote_data: Json
          services_value?: number | null
          status: string
          time_horizon: number
          total_fee: number
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_person?: string | null
          contract_duration?: number
          created_at?: string
          customer_name?: string
          id?: string
          machine_name?: string
          machine_value?: number
          quote_data?: Json
          services_value?: number | null
          status?: string
          time_horizon?: number
          total_fee?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      risk_assessments: {
        Row: {
          annual_discount_rate: number
          av_percentage: number
          contract_years: number
          created_at: string
          id: string
          machine_id: string
          risk_data: Json
          total_actualized_residual_risk: number
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_discount_rate?: number
          av_percentage?: number
          contract_years?: number
          created_at?: string
          id?: string
          machine_id: string
          risk_data: Json
          total_actualized_residual_risk?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_discount_rate?: number
          av_percentage?: number
          contract_years?: number
          created_at?: string
          id?: string
          machine_id?: string
          risk_data?: Json
          total_actualized_residual_risk?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_assessments_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          consumables_cost: number
          created_at: string | null
          description: string | null
          id: string
          interval_type: string
          interval_value: number
          labor_cost: number
          machine_category: string
          machine_id: string | null
          name: string
          parts_cost: number
          service_category_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          consumables_cost?: number
          created_at?: string | null
          description?: string | null
          id?: string
          interval_type: string
          interval_value?: number
          labor_cost?: number
          machine_category: string
          machine_id?: string | null
          name: string
          parts_cost?: number
          service_category_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          consumables_cost?: number
          created_at?: string | null
          description?: string | null
          id?: string
          interval_type?: string
          interval_value?: number
          labor_cost?: number
          machine_category?: string
          machine_id?: string | null
          name?: string
          parts_cost?: number
          service_category_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_bureau_spread: {
        Args: {
          score: number
        }
        Returns: number
      }
      get_current_rating_spread: {
        Args: {
          score: number
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
