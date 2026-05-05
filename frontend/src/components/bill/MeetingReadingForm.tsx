import { useState } from 'react';
import type { Bill } from '../../types';

import { useUpdateBill } from '../../hooks/useBillActions';

import { Zap } from 'lucide-react';

type MeterReadingFormProps = {
  bill: Bill;
};

export default function MeterReadingForm({ bill }: MeterReadingFormProps) {
  const [form, setForm] = useState({
    previous_kwh: Number(bill.previous_kwh),
    current_kwh: Number(bill.current_kwh),
  });

  const updateBill = useUpdateBill(bill.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Remove leading zeros and convert to number
    const numValue = value === '' ? 0 : Number(value.replace(/^0+(?=\d)/, ''));
    setForm((prev) => ({ ...prev, [name]: numValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBill.mutate(form);
  };

  // Get error message
  const getErrorMessage = () => {
    const error = updateBill.error as any;
    return error?.response?.data?.message || 'Failed to update readings';
  };

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h3 className="font-bold text-base mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Meter Readings
        </h3>

        {updateBill.isError && (
          <div className="alert alert-error mb-4">
            <span>{getErrorMessage()}</span>
          </div>
        )}

        {updateBill.isSuccess && (
          <div className="alert alert-success mb-4">
            <span>Readings updated successfully!</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="form-control">
            <div className="label">
              <span className="label-text">Previous Reading (KWH)</span>
              <span className="label-text-alt text-base-content/50">Pre-filled from last bill</span>
            </div>
            <input
              type="number"
              name="previous_kwh"
              className="input input-bordered w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={form.previous_kwh}
              onChange={handleChange}
              min={0}
              required
            />
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text">Current Reading (KWH)</span>
            </div>
            <input
              type="number"
              name="current_kwh"
              className="input input-bordered w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={form.current_kwh}
              onChange={handleChange}
              min={0}
              required
            />
          </label>

          {/* Consumption preview */}
          <div className="bg-base-200 rounded-lg p-3 text-sm">
            <span className="text-base-content/60">Consumption: </span>
            <span className="font-bold">{Math.max(0, form.current_kwh - form.previous_kwh)} KWH</span>
          </div>

          <button type="submit" className="btn btn-outline btn-sm" disabled={updateBill.isPending}>
            {updateBill.isPending ? <span className="loading loading-spinner loading-xs" /> : 'Update Readings'}
          </button>
        </form>
      </div>
    </div>
  );
}
