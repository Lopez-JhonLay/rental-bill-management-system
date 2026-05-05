import { useState } from 'react';
import { useCreateTenant } from '../../hooks/useTenantActions';

type AddTenantModalProps = {
  unitId: string;
  onClose: () => void;
};

export default function AddTenantModal({ unitId, onClose }: AddTenantModalProps) {
  const [form, setForm] = useState({
    tenant_name: '',
    person_count: null,
  });

  const createTenant = useCreateTenant();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'person_count') {
      // Remove leading zeros and convert to number
      const numValue = value === '' ? null : Number(value.replace(/^0+/, '') || '0');
      setForm((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTenant.mutate({ unit_id: unitId, ...form }, { onSuccess: () => onClose() });
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add Tenant</h3>

        {createTenant.isError && (
          <div className="alert alert-error mb-4">
            <span>Failed to add tenant. Unit may already have a tenant.</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="form-control">
            <div className="label">
              <span className="label-text">Tenant Name</span>
            </div>
            <input
              type="text"
              name="tenant_name"
              placeholder="Santos Family"
              className="input input-bordered w-full"
              value={form.tenant_name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text">Number of Persons</span>
            </div>
            <input
              type="number"
              name="person_count"
              placeholder="4"
              className="input input-bordered w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={form.person_count ?? ''}
              onChange={handleChange}
              min={0}
              required
            />
          </label>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={createTenant.isPending}>
              {createTenant.isPending ? <span className="loading loading-spinner loading-sm" /> : 'Add Tenant'}
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
