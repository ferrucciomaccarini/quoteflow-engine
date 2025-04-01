
import { Database } from "@/integrations/supabase/types";
import { Json } from "@/integrations/supabase/types";

// Define types based on the Supabase database schema
export type Machine = {
  id: string;
  name: string;
  category: string;
  category_id?: string | null;
  acquisition_value: number;
  description?: string | null;
  daily_rate: number;
  hourly_rate: number;
  customer_id?: string | null;
  user_id: string;
  created_at?: string | null;
  updated_at?: string | null;
  average_annual_usage_hours?: number | null;
  estimated_useful_life?: number | null;
};

export type MachineInsert = {
  name: string;
  category: string;
  category_id?: string | null;
  acquisition_value: number;
  description?: string | null;
  daily_rate: number;
  hourly_rate: number;
  customer_id?: string | null;
  user_id: string;
  average_annual_usage_hours?: number | null;
  estimated_useful_life?: number | null;
};

export type MachineCategory = {
  id: string;
  name: string;
  description?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type MachineCategoryInsert = Omit<MachineCategory, 'id' | 'created_at' | 'updated_at'>;

export type Service = {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  machine_category: string;
  interval_type: string;
  interval_value: number;
  labor_cost: number;
  parts_cost: number;
  consumables_cost: number;
  user_id: string;
  created_at?: string | null;
  updated_at?: string | null;
  service_category_id?: string | null;
  machine_id?: string | null;
};

export type ServiceInsert = {
  name: string;
  description?: string | null;
  category: string;
  machine_category: string;
  interval_type: string;
  interval_value: number;
  labor_cost: number;
  parts_cost: number;
  consumables_cost: number;
  user_id: string;
  service_category_id?: string | null;
  machine_id?: string | null;
};

export type ServiceCategory = {
  id: string;
  name: string;
  description?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type ServiceCategoryInsert = Omit<ServiceCategory, 'id' | 'created_at' | 'updated_at'>;

export type RiskAssessment = {
  id: string;
  user_id: string;
  machine_id: string;
  av_percentage: number;
  annual_discount_rate: number;
  contract_years: number;
  total_actualized_residual_risk: number;
  risk_data: RiskData;
  created_at: string;
  updated_at: string;
};

export type RiskData = {
  riskVariables: RiskVariable[];
  avPercentage: number;
  annualDiscountRate: number;
  contractYears: number;
  totalActualizedRisk: number;
  machineId?: string;
  [key: string]: any;
};

export type RiskVariable = {
  id: number | string;
  domain: string;
  name?: string;
  variable?: string;
  likelihood?: number;
  impact?: number;
  frequency?: number;
  maxLoss?: number;
  mitigation?: number;
  riskValue?: number;
  residualRisk?: number;
  presentValues?: number[];
};

export type RiskAssessmentInsert = Omit<RiskAssessment, 'id' | 'created_at' | 'updated_at'>;
