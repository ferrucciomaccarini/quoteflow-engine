
export interface Machine {
  id: string;
  name: string;
  category: string;
  acquisition_value: number;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  parts_cost: number;
  labor_cost: number;
  consumables_cost: number;
  interval_type: string;
  interval_value: number;
  fixed_cost?: number;
  machine_id?: string;
}

export interface CreditBureauSpread {
  id: string;
  bureau_score: number;
  spread_rate: number;
  user_id: string;
  valid_from: string;
  valid_to: string | null;
}

export interface InternalRatingSpread {
  id: string;
  rating_score: number;
  spread_rate: number;
  user_id: string;
  valid_from: string;
  valid_to: string | null;
}

export interface StepComponentProps {
  data: any;
  updateData: (data: any) => void;
}
