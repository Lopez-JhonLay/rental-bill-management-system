// Fictional fixtures used only by the headless screenshot script.
const created_at = '2026-09-01T08:00:00.000Z';
export const user = { id: 'demo-landlord', full_name: 'Elena Cruz', email: 'elena@example.com', created_at };
export const rates = [
  { id: 'rate-nov', user_id: user.id, electricity_rate: 12.5, water_rate: 150, effective_from: '2026-11-01T00:00:00.000Z', created_at },
  { id: 'rate-sep', user_id: user.id, electricity_rate: 12, water_rate: 125, effective_from: '2026-09-01T00:00:00.000Z', created_at },
];
export const units = [
  { id: 'unit-1', unit_name: 'Room 1A', monthly_rent: 6500, tenant: { id: 'tenant-1', unit_id: 'unit-1', tenant_name: 'Maria Santos', person_count: 2, created_at } },
  { id: 'unit-2', unit_name: 'Room 2B', monthly_rent: 8000, tenant: { id: 'tenant-2', unit_id: 'unit-2', tenant_name: 'Daniel Reyes', person_count: 3, created_at } },
  { id: 'unit-3', unit_name: 'Garden Studio', monthly_rent: 9000, tenant: { id: 'tenant-3', unit_id: 'unit-3', tenant_name: 'Nina Garcia', person_count: 1, created_at } },
  { id: 'unit-4', unit_name: 'Room 3C', monthly_rent: 7000, tenant: null },
].map(unit => ({ ...unit, user_id: user.id, created_at }));
export const bills = [
  { id: 'bill-draft', unit_id: 'unit-1', billing_month: '2026-11', previous_kwh: 1240, current_kwh: 1320, status: 'DRAFT' },
  { id: 'bill-confirmed', unit_id: 'unit-1', billing_month: '2026-10', previous_kwh: 1160, current_kwh: 1240, status: 'CONFIRMED' },
  { id: 'bill-2', unit_id: 'unit-2', billing_month: '2026-11', previous_kwh: 2100, current_kwh: 2220, status: 'CONFIRMED' },
  { id: 'bill-3', unit_id: 'unit-3', billing_month: '2026-11', previous_kwh: 600, current_kwh: 660, status: 'DRAFT' },
].map(bill => {
  const unit = units.find(unit => unit.id === bill.unit_id);
  const rate = bill.billing_month === '2026-10' ? rates[1] : rates[0];
  const electricity_charge = (bill.current_kwh - bill.previous_kwh) * rate.electricity_rate;
  const water_charge = unit.tenant.person_count * rate.water_rate;
  return { ...bill, unit, tenant: unit.tenant, tenant_id: unit.tenant.id, electricity_rate: rate.electricity_rate, water_rate: rate.water_rate, electricity_charge, water_charge, rent_charge: unit.monthly_rent, total_amount: electricity_charge + water_charge + unit.monthly_rent, created_at, confirmed_at: bill.status === 'CONFIRMED' ? '2026-11-02T08:00:00.000Z' : null };
});
export const unitDetails = units.map(unit => ({ ...unit, bills: bills.filter(bill => bill.unit_id === unit.id) }));
