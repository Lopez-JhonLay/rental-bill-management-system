export type User = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
};

export type Unit = {
  id: string;
  user_id: string;
  unit_name: string;
  monthly_rent: number;
  created_at: string;
};

export type Tenant = {
  id: string;
  unit_id: string;
  tenant_name: string;
  person_count: number;
  created_at: string;
};

export type BillStatus = 'DRAFT' | 'CONFIRMED';

export type Bill = {
  id: string;
  unit_id: string;
  tenant_id: string;
  billing_month: string;
  previous_kwh: number;
  current_kwh: number;
  electricity_rate: number;
  water_rate: number;
  electricity_charge: number;
  water_charge: number;
  rent_charge: number;
  total_amount: number;
  status: BillStatus;
  created_at: string;
  confirmed_at: string | null;
};

export type RateSetting = {
  id: string;
  electricity_rate: number;
  water_rate: number;
  effective_from: string;
  created_at: string;
};
