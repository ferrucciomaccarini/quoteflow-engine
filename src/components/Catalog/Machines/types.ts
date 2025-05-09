
export interface Machine {
  id: string;
  name: string;
  category: string;
  acquisition_value: number;
  description?: string;
  daily_rate?: number;
  hourly_rate?: number;
  customer_id?: string;
  customers?: { name: string } | null;
  machine_categories?: { name: string } | null;
  category_id?: string;
}

export interface MachineCategory {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  name: string;
}
