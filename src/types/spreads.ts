
export interface CreditBureauSpread {
  id: string;
  bureau_score: number;
  spread_rate: number;
  valid_from: string;
  valid_to: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface InternalRatingSpread {
  id: string;
  rating_score: number;
  spread_rate: number;
  valid_from: string;
  valid_to: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}
