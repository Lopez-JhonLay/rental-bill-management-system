import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import { useUnit } from '../../hooks/useUnitActions';
import { useDeleteUnit } from '../../hooks/useUnitActions';

import PageHeader from '../../components/shared/PageHeader';
import TenantInfoCard from '../../components/unit/TenantInfoCard';
import AddTenantModal from '../../components/unit/AddTenantModal';
import GenerateBillModal from '../../components/unit/GenarateBillModal';
import BillRow from '../../components/shared/BillRow';

export default function UnitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showGenerateBill, setShowGenerateBill] = useState(false);

  const { data: unit, isLoading, error } = useUnit(id!);
  const deleteUnit = useDeleteUnit();

  const handleDeleteUnit = () => {
    if (!confirm('Are you sure you want to delete this unit?')) return;
    deleteUnit.mutate(id!, {
      onSuccess: () => navigate('/units'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="alert alert-error">
        <span>Unit not found.</span>
      </div>
    );
  }
  return (
    <div>
      <PageHeader
        title={unit.unit_name}
        subtitle={`₱${Number(unit.monthly_rent).toLocaleString()}/month`}
        action={
          <div className="flex gap-2">
            <button
              className="btn btn-error btn-outline btn-sm"
              onClick={handleDeleteUnit}
              disabled={deleteUnit.isPending}
            >
              Delete Unit
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Tenant Info */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Unit Info Card */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h3 className="font-bold text-base">🏠 Unit Info</h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Name</span>
                  <span className="font-medium">{unit.unit_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Monthly Rent</span>
                  <span className="font-medium">₱{Number(unit.monthly_rent).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Tenant Card */}
          {unit.tenant ? (
            <TenantInfoCard tenant={unit.tenant} />
          ) : (
            <div className="card bg-base-100 border border-warning">
              <div className="card-body items-center text-center gap-3">
                <span className="text-4xl">👤</span>
                <p className="text-sm text-base-content/60">No tenant assigned yet</p>
                <button className="btn btn-warning btn-sm" onClick={() => setShowAddTenant(true)}>
                  + Add Tenant
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Right Column — Bill History */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base">🧾 Bill History</h3>
                {unit.tenant && (
                  <button className="btn btn-primary btn-sm" onClick={() => setShowGenerateBill(true)}>
                    + Generate Bill
                  </button>
                )}
              </div>

              {/* Bills Table */}
              {unit.bills && unit.bills.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Electricity</th>
                        <th>Water</th>
                        <th>Rent</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unit.bills.map((bill) => (
                        <BillRow key={bill.id} bill={bill} />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 gap-2 text-base-content/50">
                  <span className="text-3xl">🧾</span>
                  <p className="text-sm">No bills generated yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      {showAddTenant && <AddTenantModal unitId={id!} onClose={() => setShowAddTenant(false)} />}

      {showGenerateBill && <GenerateBillModal unitId={id!} onClose={() => setShowGenerateBill(false)} />}
    </div>
  );
}
