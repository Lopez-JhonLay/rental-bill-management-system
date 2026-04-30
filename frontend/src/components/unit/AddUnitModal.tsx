// src/components/units/AddUnitModal.tsx
import { useState } from 'react';
import { useCreateUnit } from '../../hooks/useUnitActions';

type AddUnitModalProps = {
  onClose: () => void;
};

export default function AddUnitModal({ onClose }: AddUnitModalProps) {
  const [form, setForm] = useState({
    unit_name: '',
    monthly_rent: 0,
  });

  const createUnit = useCreateUnit();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.name === 'monthly_rent' ? Number(e.target.value) : e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUnit.mutate(form, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add New Unit</h3>

        {/* Error */}
        {createUnit.isError && (
          <div className="alert alert-error mb-4">
            <span>Failed to create unit. Please try again.</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="form-control">
            <div className="label">
              <span className="label-text">Unit Name</span>
            </div>
            <input
              type="text"
              name="unit_name"
              placeholder='e.g. "Room 2B"'
              className="input input-bordered w-full"
              value={form.unit_name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text">Monthly Rent (₱)</span>
            </div>
            <input
              type="number"
              name="monthly_rent"
              placeholder="2500"
              className="input input-bordered w-full"
              value={form.monthly_rent}
              onChange={handleChange}
              min={0}
              required
            />
          </label>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={createUnit.isPending}>
              {createUnit.isPending ? <span className="loading loading-spinner loading-sm" /> : 'Add Unit'}
            </button>
          </div>
        </form>
      </div>

      {/* Click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
