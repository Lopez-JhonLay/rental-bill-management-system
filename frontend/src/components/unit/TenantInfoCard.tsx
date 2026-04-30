import { useState } from 'react';
import type { Tenant } from '../../types';
import { useUpdateTenant } from '../../hooks/useTenantActions';

type TenantInfoCardProps = {
  tenant: Tenant;
};

export default function TenantInfoCard({ tenant }: TenantInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    tenant_name: tenant.tenant_name,
    person_count: tenant.person_count,
  });

  const updateTenant = useUpdateTenant();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.name === 'person_count' ? Number(e.target.value) : e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenant.mutate({ id: tenant.id, payload: form }, { onSuccess: () => setIsEditing(false) });
  };

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-base">👨‍👩‍👧 Tenant Info</h3>
          {!isEditing && (
            <button className="btn btn-ghost btn-xs" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>
        {!isEditing ? (
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-base-content/60">Name</span>
              <span className="font-medium">{tenant.tenant_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">Persons</span>
              <span className="font-medium">{tenant.person_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">Since</span>
              <span className="font-medium">{new Date(tenant.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="form-control">
              <div className="label">
                <span className="label-text text-xs">Tenant Name</span>
              </div>
              <input
                type="text"
                name="tenant_name"
                className="input input-bordered input-sm"
                value={form.tenant_name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text text-xs">Person Count</span>
              </div>
              <input
                type="number"
                name="person_count"
                className="input input-bordered input-sm"
                value={form.person_count}
                onChange={handleChange}
                min={1}
                required
              />
            </label>
            <div className="flex gap-2 justify-end">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={updateTenant.isPending}>
                {updateTenant.isPending ? <span className="loading loading-spinner loading-xs" /> : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
