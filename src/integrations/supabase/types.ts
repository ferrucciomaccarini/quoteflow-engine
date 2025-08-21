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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          acknowledged: boolean
          acknowledged_at: string | null
          auto_resolved: boolean
          created_at: string
          id: string
          machinery_id: string
          message: string
          resolved_at: string | null
          sensor_id: string | null
          severity: Database["public"]["Enums"]["event_severity"]
          title: string
          type: Database["public"]["Enums"]["alert_type"]
        }
        Insert: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          auto_resolved?: boolean
          created_at?: string
          id?: string
          machinery_id: string
          message: string
          resolved_at?: string | null
          sensor_id?: string | null
          severity: Database["public"]["Enums"]["event_severity"]
          title: string
          type: Database["public"]["Enums"]["alert_type"]
        }
        Update: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          auto_resolved?: boolean
          created_at?: string
          id?: string
          machinery_id?: string
          message?: string
          resolved_at?: string | null
          sensor_id?: string | null
          severity?: Database["public"]["Enums"]["event_severity"]
          title?: string
          type?: Database["public"]["Enums"]["alert_type"]
        }
        Relationships: [
          {
            foreignKeyName: "alerts_machinery_id_fkey"
            columns: ["machinery_id"]
            isOneToOne: false
            referencedRelation: "virtual_machinery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "virtual_sensors"
            referencedColumns: ["id"]
          },
        ]
      }
      AnagClienti: {
        Row: {
          address: string | null
          Codice_SDI: string | null
          Comune: string | null
          contact_person: string | null
          email: string | null
          Fido: string | null
          IBAN: string | null
          ID: number
          Modalità_Pagamento: string | null
          name: string | null
          Partita_IVA: string | null
          PEC: string | null
          phone: string | null
          Prov: string | null
          Rating: string | null
          "Settore/ATECO": string | null
          Split_Payment: string | null
        }
        Insert: {
          address?: string | null
          Codice_SDI?: string | null
          Comune?: string | null
          contact_person?: string | null
          email?: string | null
          Fido?: string | null
          IBAN?: string | null
          ID: number
          Modalità_Pagamento?: string | null
          name?: string | null
          Partita_IVA?: string | null
          PEC?: string | null
          phone?: string | null
          Prov?: string | null
          Rating?: string | null
          "Settore/ATECO"?: string | null
          Split_Payment?: string | null
        }
        Update: {
          address?: string | null
          Codice_SDI?: string | null
          Comune?: string | null
          contact_person?: string | null
          email?: string | null
          Fido?: string | null
          IBAN?: string | null
          ID?: number
          Modalità_Pagamento?: string | null
          name?: string | null
          Partita_IVA?: string | null
          PEC?: string | null
          phone?: string | null
          Prov?: string | null
          Rating?: string | null
          "Settore/ATECO"?: string | null
          Split_Payment?: string | null
        }
        Relationships: []
      }
      assessment_history: {
        Row: {
          areas: Json
          assessment_date: string
          company_id: number | null
          company_name: string
          created_at: string
          id: string
          maturity_description: string
          maturity_level: string
          total_score: number
          user_id: string | null
        }
        Insert: {
          areas: Json
          assessment_date?: string
          company_id?: number | null
          company_name: string
          created_at?: string
          id?: string
          maturity_description: string
          maturity_level: string
          total_score: number
          user_id?: string | null
        }
        Update: {
          areas?: Json
          assessment_date?: string
          company_id?: number | null
          company_name?: string
          created_at?: string
          id?: string
          maturity_description?: string
          maturity_level?: string
          total_score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "AnagClienti"
            referencedColumns: ["ID"]
          },
        ]
      }
      azr_scenarios: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          id: string
          learnability_reward: number
          machinery_id: string
          parameters: Json | null
          status: Database["public"]["Enums"]["scenario_status"]
          title: string
          type: Database["public"]["Enums"]["scenario_type"]
          updated_at: string
          validity_score: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          learnability_reward?: number
          machinery_id: string
          parameters?: Json | null
          status?: Database["public"]["Enums"]["scenario_status"]
          title: string
          type: Database["public"]["Enums"]["scenario_type"]
          updated_at?: string
          validity_score?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          learnability_reward?: number
          machinery_id?: string
          parameters?: Json | null
          status?: Database["public"]["Enums"]["scenario_status"]
          title?: string
          type?: Database["public"]["Enums"]["scenario_type"]
          updated_at?: string
          validity_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "azr_scenarios_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "unified_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "azr_scenarios_machinery_id_fkey"
            columns: ["machinery_id"]
            isOneToOne: false
            referencedRelation: "virtual_machinery"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_flows: {
        Row: {
          contract_id: string | null
          created_at: string | null
          flow_date: string
          id: string
          net_cash_flow: number | null
          operating_costs: number | null
          risk_stream: number | null
          service_stream: number | null
          usage_stream: number | null
        }
        Insert: {
          contract_id?: string | null
          created_at?: string | null
          flow_date: string
          id?: string
          net_cash_flow?: number | null
          operating_costs?: number | null
          risk_stream?: number | null
          service_stream?: number | null
          usage_stream?: number | null
        }
        Update: {
          contract_id?: string | null
          created_at?: string | null
          flow_date?: string
          id?: string
          net_cash_flow?: number | null
          operating_costs?: number | null
          risk_stream?: number | null
          service_stream?: number | null
          usage_stream?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_flows_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      Clientinew: {
        Row: {
          address: string | null
          contact_person: string | null
          email: string | null
          name: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          email?: string | null
          name?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          email?: string | null
          name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          ateco_code: string | null
          city: string
          contract_code: string
          contract_duration: number
          contract_end_date: string
          contract_start_date: string
          contract_value: number
          created_at: string | null
          customer_name: string
          equipment_category: string
          equipment_type: string
          id: string
          last_payment_date: string | null
          monthly_fee: number
          next_payment_date: string | null
          province: string
          region: string
          risk_score_finance: number | null
          risk_score_overall: number | null
          risk_score_reputation: number | null
          risk_score_strategy: number | null
          risk_score_usage: number | null
          sector: string
          status: string
          updated_at: string | null
          utilization_rate: number | null
        }
        Insert: {
          ateco_code?: string | null
          city: string
          contract_code: string
          contract_duration: number
          contract_end_date: string
          contract_start_date: string
          contract_value: number
          created_at?: string | null
          customer_name: string
          equipment_category: string
          equipment_type: string
          id?: string
          last_payment_date?: string | null
          monthly_fee: number
          next_payment_date?: string | null
          province: string
          region: string
          risk_score_finance?: number | null
          risk_score_overall?: number | null
          risk_score_reputation?: number | null
          risk_score_strategy?: number | null
          risk_score_usage?: number | null
          sector: string
          status?: string
          updated_at?: string | null
          utilization_rate?: number | null
        }
        Update: {
          ateco_code?: string | null
          city?: string
          contract_code?: string
          contract_duration?: number
          contract_end_date?: string
          contract_start_date?: string
          contract_value?: number
          created_at?: string | null
          customer_name?: string
          equipment_category?: string
          equipment_type?: string
          id?: string
          last_payment_date?: string | null
          monthly_fee?: number
          next_payment_date?: string | null
          province?: string
          region?: string
          risk_score_finance?: number | null
          risk_score_overall?: number | null
          risk_score_reputation?: number | null
          risk_score_strategy?: number | null
          risk_score_usage?: number | null
          sector?: string
          status?: string
          updated_at?: string | null
          utilization_rate?: number | null
        }
        Relationships: []
      }
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
      eaas_simulations: {
        Row: {
          added_value_percentage: number
          amortization_duration: number
          annual_interest_rate: number
          company_name: string
          contract_duration: number
          created_at: string
          eaas_percentage: number
          id: string
          initial_ebitda_percent: number
          initial_revenue: number
          results: Json
          service_margin_percent: number
          simulation_date: string
          user_id: string
        }
        Insert: {
          added_value_percentage: number
          amortization_duration: number
          annual_interest_rate: number
          company_name: string
          contract_duration: number
          created_at?: string
          eaas_percentage: number
          id?: string
          initial_ebitda_percent: number
          initial_revenue: number
          results: Json
          service_margin_percent: number
          simulation_date: string
          user_id: string
        }
        Update: {
          added_value_percentage?: number
          amortization_duration?: number
          annual_interest_rate?: number
          company_name?: string
          contract_duration?: number
          created_at?: string
          eaas_percentage?: number
          id?: string
          initial_ebitda_percent?: number
          initial_revenue?: number
          results?: Json
          service_margin_percent?: number
          simulation_date?: string
          user_id?: string
        }
        Relationships: []
      }
      EURIRS: {
        Row: {
          Apertura: string | null
          Data: string | null
          Massimo: string | null
          Minimo: string | null
          Ultimo: string | null
          "Var. %": string | null
        }
        Insert: {
          Apertura?: string | null
          Data?: string | null
          Massimo?: string | null
          Minimo?: string | null
          Ultimo?: string | null
          "Var. %"?: string | null
        }
        Update: {
          Apertura?: string | null
          Data?: string | null
          Massimo?: string | null
          Minimo?: string | null
          Ultimo?: string | null
          "Var. %"?: string | null
        }
        Relationships: []
      }
      integrated_diagnoses: {
        Row: {
          confidence_score: number
          cost_breakdown: Json | null
          created_at: string
          description: string | null
          estimated_cost: number | null
          id: string
          machinery_id: string
          predicted_failure_time: string | null
          recommended_actions: string[] | null
          risk_level: Database["public"]["Enums"]["event_severity"]
          scenario_id: string
          title: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          confidence_score?: number
          cost_breakdown?: Json | null
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          machinery_id: string
          predicted_failure_time?: string | null
          recommended_actions?: string[] | null
          risk_level: Database["public"]["Enums"]["event_severity"]
          scenario_id: string
          title: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          confidence_score?: number
          cost_breakdown?: Json | null
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          machinery_id?: string
          predicted_failure_time?: string | null
          recommended_actions?: string[] | null
          risk_level?: Database["public"]["Enums"]["event_severity"]
          scenario_id?: string
          title?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "integrated_diagnoses_machinery_id_fkey"
            columns: ["machinery_id"]
            isOneToOne: false
            referencedRelation: "virtual_machinery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integrated_diagnoses_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "azr_scenarios"
            referencedColumns: ["id"]
          },
        ]
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
      knowledge_documents: {
        Row: {
          content: string | null
          created_at: string
          document_type: string
          extracted_components: Json | null
          extracted_parameters: Json | null
          extracted_processes: Json | null
          extracted_specifications: Json | null
          filename: string
          id: string
          machinery_id: string | null
          processing_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          document_type: string
          extracted_components?: Json | null
          extracted_parameters?: Json | null
          extracted_processes?: Json | null
          extracted_specifications?: Json | null
          filename: string
          id?: string
          machinery_id?: string | null
          processing_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          document_type?: string
          extracted_components?: Json | null
          extracted_parameters?: Json | null
          extracted_processes?: Json | null
          extracted_specifications?: Json | null
          filename?: string
          id?: string
          machinery_id?: string | null
          processing_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_documents_machinery_id_fkey"
            columns: ["machinery_id"]
            isOneToOne: false
            referencedRelation: "virtual_machinery"
            referencedColumns: ["id"]
          },
        ]
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
          daily_rate: number | null
          description: string | null
          estimated_useful_life: number | null
          hourly_rate: number | null
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
          daily_rate?: number | null
          description?: string | null
          estimated_useful_life?: number | null
          hourly_rate?: number | null
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
          daily_rate?: number | null
          description?: string | null
          estimated_useful_life?: number | null
          hourly_rate?: number | null
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
      quote_calculations: {
        Row: {
          annual_usage_hours: number
          created_at: string
          daily_shifts: number
          discount_rate: number
          equipment_amortization: Json | null
          id: string
          present_value: number
          quote_id: string | null
          risk_amortization: Json | null
          services_amortization: Json | null
          time_horizon: number
          updated_at: string
          user_id: string
          year_1_costs: number | null
          year_10_costs: number | null
          year_2_costs: number | null
          year_3_costs: number | null
          year_4_costs: number | null
          year_5_costs: number | null
          year_6_costs: number | null
          year_7_costs: number | null
          year_8_costs: number | null
          year_9_costs: number | null
        }
        Insert: {
          annual_usage_hours: number
          created_at?: string
          daily_shifts: number
          discount_rate: number
          equipment_amortization?: Json | null
          id?: string
          present_value: number
          quote_id?: string | null
          risk_amortization?: Json | null
          services_amortization?: Json | null
          time_horizon: number
          updated_at?: string
          user_id: string
          year_1_costs?: number | null
          year_10_costs?: number | null
          year_2_costs?: number | null
          year_3_costs?: number | null
          year_4_costs?: number | null
          year_5_costs?: number | null
          year_6_costs?: number | null
          year_7_costs?: number | null
          year_8_costs?: number | null
          year_9_costs?: number | null
        }
        Update: {
          annual_usage_hours?: number
          created_at?: string
          daily_shifts?: number
          discount_rate?: number
          equipment_amortization?: Json | null
          id?: string
          present_value?: number
          quote_id?: string | null
          risk_amortization?: Json | null
          services_amortization?: Json | null
          time_horizon?: number
          updated_at?: string
          user_id?: string
          year_1_costs?: number | null
          year_10_costs?: number | null
          year_2_costs?: number | null
          year_3_costs?: number | null
          year_4_costs?: number | null
          year_5_costs?: number | null
          year_6_costs?: number | null
          year_7_costs?: number | null
          year_8_costs?: number | null
          year_9_costs?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_calculations_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
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
      reasoning_workflows: {
        Row: {
          created_at: string
          event_id: string
          execution_time_ms: number | null
          id: string
          proposer_result: Json | null
          solver_result: Json | null
          status: Database["public"]["Enums"]["workflow_status"]
          updated_at: string
          validator_result: Json | null
        }
        Insert: {
          created_at?: string
          event_id: string
          execution_time_ms?: number | null
          id?: string
          proposer_result?: Json | null
          solver_result?: Json | null
          status?: Database["public"]["Enums"]["workflow_status"]
          updated_at?: string
          validator_result?: Json | null
        }
        Update: {
          created_at?: string
          event_id?: string
          execution_time_ms?: number | null
          id?: string
          proposer_result?: Json | null
          solver_result?: Json | null
          status?: Database["public"]["Enums"]["workflow_status"]
          updated_at?: string
          validator_result?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "reasoning_workflows_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "unified_events"
            referencedColumns: ["id"]
          },
        ]
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
      risk_events: {
        Row: {
          contract_id: string | null
          description: string
          domain: string
          event_date: string | null
          event_type: string
          id: string
          resolved: boolean | null
          resolved_date: string | null
          severity: string
        }
        Insert: {
          contract_id?: string | null
          description: string
          domain: string
          event_date?: string | null
          event_type: string
          id?: string
          resolved?: boolean | null
          resolved_date?: string | null
          severity: string
        }
        Update: {
          contract_id?: string | null
          description?: string
          domain?: string
          event_date?: string | null
          event_type?: string
          id?: string
          resolved?: boolean | null
          resolved_date?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_events_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      sensor_readings: {
        Row: {
          anomaly_score: number
          id: string
          sensor_id: string
          timestamp: string
          value: number
        }
        Insert: {
          anomaly_score?: number
          id?: string
          sensor_id: string
          timestamp?: string
          value: number
        }
        Update: {
          anomaly_score?: number
          id?: string
          sensor_id?: string
          timestamp?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "sensor_readings_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "virtual_sensors"
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
      synthetic_events: {
        Row: {
          correlation_factors: Json | null
          cost_breakdown: Json | null
          created_at: string
          degradation_rate: number | null
          description: string | null
          estimated_cost: number | null
          event_date: string
          event_time: string
          event_type: string
          id: string
          machinery_id: string
          maintenance_window: boolean | null
          projection_id: string
          scenario_type: string
          seasonal_factor: number | null
          severity: string
          title: string
        }
        Insert: {
          correlation_factors?: Json | null
          cost_breakdown?: Json | null
          created_at?: string
          degradation_rate?: number | null
          description?: string | null
          estimated_cost?: number | null
          event_date: string
          event_time: string
          event_type: string
          id?: string
          machinery_id: string
          maintenance_window?: boolean | null
          projection_id: string
          scenario_type: string
          seasonal_factor?: number | null
          severity: string
          title: string
        }
        Update: {
          correlation_factors?: Json | null
          cost_breakdown?: Json | null
          created_at?: string
          degradation_rate?: number | null
          description?: string | null
          estimated_cost?: number | null
          event_date?: string
          event_time?: string
          event_type?: string
          id?: string
          machinery_id?: string
          maintenance_window?: boolean | null
          projection_id?: string
          scenario_type?: string
          seasonal_factor?: number | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "synthetic_events_machinery_id_fkey"
            columns: ["machinery_id"]
            isOneToOne: false
            referencedRelation: "virtual_machinery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "synthetic_events_projection_id_fkey"
            columns: ["projection_id"]
            isOneToOne: false
            referencedRelation: "synthetic_projections"
            referencedColumns: ["id"]
          },
        ]
      }
      synthetic_projections: {
        Row: {
          configuration: Json
          created_at: string
          description: string | null
          end_date: string
          estimated_cost: number | null
          id: string
          name: string
          start_date: string
          status: string
          time_horizon: number
          total_events: number
          updated_at: string
          user_id: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          description?: string | null
          end_date: string
          estimated_cost?: number | null
          id?: string
          name: string
          start_date?: string
          status?: string
          time_horizon?: number
          total_events?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          description?: string | null
          end_date?: string
          estimated_cost?: number | null
          id?: string
          name?: string
          start_date?: string
          status?: string
          time_horizon?: number
          total_events?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      unified_events: {
        Row: {
          anomaly_score: number
          created_at: string
          description: string | null
          event_type: string
          id: string
          machinery_id: string
          physical_parameters: Json | null
          scenario_type: Database["public"]["Enums"]["scenario_type"]
          sensor_id: string | null
          severity: Database["public"]["Enums"]["event_severity"]
          title: string
        }
        Insert: {
          anomaly_score?: number
          created_at?: string
          description?: string | null
          event_type: string
          id?: string
          machinery_id: string
          physical_parameters?: Json | null
          scenario_type: Database["public"]["Enums"]["scenario_type"]
          sensor_id?: string | null
          severity: Database["public"]["Enums"]["event_severity"]
          title: string
        }
        Update: {
          anomaly_score?: number
          created_at?: string
          description?: string | null
          event_type?: string
          id?: string
          machinery_id?: string
          physical_parameters?: Json | null
          scenario_type?: Database["public"]["Enums"]["scenario_type"]
          sensor_id?: string | null
          severity?: Database["public"]["Enums"]["event_severity"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "unified_events_machinery_id_fkey"
            columns: ["machinery_id"]
            isOneToOne: false
            referencedRelation: "virtual_machinery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unified_events_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "virtual_sensors"
            referencedColumns: ["id"]
          },
        ]
      }
      virtual_components: {
        Row: {
          created_at: string
          failure_modes: Json | null
          id: string
          machinery_id: string
          name: string
          sensor_config: Json | null
          specifications: Json | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          failure_modes?: Json | null
          id?: string
          machinery_id: string
          name: string
          sensor_config?: Json | null
          specifications?: Json | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          failure_modes?: Json | null
          id?: string
          machinery_id?: string
          name?: string
          sensor_config?: Json | null
          specifications?: Json | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "virtual_components_machinery_id_fkey"
            columns: ["machinery_id"]
            isOneToOne: false
            referencedRelation: "virtual_machinery"
            referencedColumns: ["id"]
          },
        ]
      }
      virtual_machinery: {
        Row: {
          created_at: string
          created_from_docs: boolean
          health: number
          id: string
          knowledge_base: Json | null
          location: string | null
          manufacturer: string | null
          model: string | null
          name: string
          specifications: Json | null
          status: Database["public"]["Enums"]["machinery_status"]
          type: Database["public"]["Enums"]["machinery_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_from_docs?: boolean
          health?: number
          id?: string
          knowledge_base?: Json | null
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name: string
          specifications?: Json | null
          status?: Database["public"]["Enums"]["machinery_status"]
          type: Database["public"]["Enums"]["machinery_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_from_docs?: boolean
          health?: number
          id?: string
          knowledge_base?: Json | null
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string
          specifications?: Json | null
          status?: Database["public"]["Enums"]["machinery_status"]
          type?: Database["public"]["Enums"]["machinery_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      virtual_sensors: {
        Row: {
          component_id: string | null
          created_at: string
          current_value: number
          degradation_rate: number
          id: string
          is_active: boolean
          machinery_id: string
          max_value: number
          min_value: number
          name: string
          noise_factor: number
          threshold_critical: number
          threshold_warning: number
          type: Database["public"]["Enums"]["sensor_type"]
          unit: string
          updated_at: string
        }
        Insert: {
          component_id?: string | null
          created_at?: string
          current_value?: number
          degradation_rate?: number
          id?: string
          is_active?: boolean
          machinery_id: string
          max_value?: number
          min_value?: number
          name: string
          noise_factor?: number
          threshold_critical?: number
          threshold_warning?: number
          type: Database["public"]["Enums"]["sensor_type"]
          unit: string
          updated_at?: string
        }
        Update: {
          component_id?: string | null
          created_at?: string
          current_value?: number
          degradation_rate?: number
          id?: string
          is_active?: boolean
          machinery_id?: string
          max_value?: number
          min_value?: number
          name?: string
          noise_factor?: number
          threshold_critical?: number
          threshold_warning?: number
          type?: Database["public"]["Enums"]["sensor_type"]
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "virtual_sensors_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "virtual_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "virtual_sensors_machinery_id_fkey"
            columns: ["machinery_id"]
            isOneToOne: false
            referencedRelation: "virtual_machinery"
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
        Args: { score: number }
        Returns: number
      }
      get_current_rating_spread: {
        Args: { score: number }
        Returns: number
      }
    }
    Enums: {
      alert_type: "sensor_threshold" | "prediction" | "maintenance" | "system"
      event_severity: "info" | "warning" | "error" | "critical"
      machinery_status: "active" | "maintenance" | "offline" | "warning"
      machinery_type: "pump" | "motor" | "compressor" | "conveyor"
      scenario_status: "proposed" | "validated" | "rejected"
      scenario_type: "abduction" | "deduction" | "induction"
      sensor_type:
        | "temperature"
        | "pressure"
        | "vibration"
        | "speed"
        | "humidity"
        | "power"
      workflow_status: "pending" | "processing" | "completed" | "failed"
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
      alert_type: ["sensor_threshold", "prediction", "maintenance", "system"],
      event_severity: ["info", "warning", "error", "critical"],
      machinery_status: ["active", "maintenance", "offline", "warning"],
      machinery_type: ["pump", "motor", "compressor", "conveyor"],
      scenario_status: ["proposed", "validated", "rejected"],
      scenario_type: ["abduction", "deduction", "induction"],
      sensor_type: [
        "temperature",
        "pressure",
        "vibration",
        "speed",
        "humidity",
        "power",
      ],
      workflow_status: ["pending", "processing", "completed", "failed"],
    },
  },
} as const
