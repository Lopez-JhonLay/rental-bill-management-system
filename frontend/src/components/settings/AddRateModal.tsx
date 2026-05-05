import { useState } from 'react';
import { useCreateRate } from '../../hooks/useSettingsAction';

type AddRateModalProps = {
  onClose: () => void;
};

export default function AddRateModal({ onClose }: AddRateModalProps) {
  const [form, setForm] = useState<{
    electricity_rate: number | null;
    water_rate: number | null;
    effective_from: string;
  }>({
    electricity_rate: null,
    water_rate: null,
    effective_from: '',
  });

  const createRate = useCreateRate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'effective_from') {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      // Remove leading zeros and convert to number
      const numValue = value === '' ? 0 : Number(value.replace(/^0+(?=\d)/, ''));
      setForm((prev) => ({ ...prev, [name]: numValue }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.electricity_rate === null || form.water_rate === null) return;
    createRate.mutate(
      {
        electricity_rate: form.electricity_rate,
        water_rate: form.water_rate,
        effective_from: form.effective_from,
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  const getErrorMessage = () => {
    const error = createRate.error as any;
    return error?.response?.data?.message || 'Failed to add rate';
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add New Rate</h3>

        {/* Info note */}
        <div className="alert alert-info mb-4 text-sm">
          <span>
            💡 Adding a new rate will not affect already confirmed bills. It will only apply to bills generated after
            the effective date.
          </span>
        </div>

        {createRate.isError && (
          <div className="alert alert-error mb-4">
            <span>{getErrorMessage()}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="form-control">
            <div className="label">
              <span className="label-text">Electricity Rate (₱ per KWH)</span>
            </div>
            <input
              type="number"
              name="electricity_rate"
              placeholder="e.g. 15"
              className="input input-bordered w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={form.electricity_rate || ''}
              onChange={handleChange}
              min={0}
              step="0.01"
              required
            />
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text">Water Rate (₱ per person)</span>
            </div>
            <input
              type="number"
              name="water_rate"
              placeholder="e.g. 100"
              className="input input-bordered w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={form.water_rate || ''}
              onChange={handleChange}
              min={0}
              step="0.01"
              required
            />
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text">Effective From</span>
            </div>
            <input
              type="date"
              name="effective_from"
              className="input input-bordered w-full"
              value={form.effective_from}
              onChange={handleChange}
              required
            />
          </label>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-soft btn-primary" disabled={createRate.isPending}>
              {createRate.isPending ? <span className="loading loading-spinner loading-sm" /> : 'Add Rate'}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
