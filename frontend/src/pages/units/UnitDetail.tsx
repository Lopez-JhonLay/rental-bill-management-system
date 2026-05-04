import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Home, UserPlus, Plus, Trash2, Loader2, ReceiptText, ArrowLeft } from 'lucide-react';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: unit, isLoading, error } = useUnit(id!);
  const deleteUnit = useDeleteUnit();

  const handleDeleteUnit = () => {
    deleteUnit.mutate(id!, {
      onSuccess: () => navigate('/units'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
      {/* Back Button */}
      <button onClick={() => navigate('/units')} className="btn btn-ghost btn-sm gap-1 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Units
      </button>

      <PageHeader
        title={unit.unit_name}
        subtitle={`₱${Number(unit.monthly_rent).toLocaleString()}/month`}
        action={
          <div className="flex gap-2">
            <button className="btn btn-error btn-outline btn-sm gap-1" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="w-4 h-4" />
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
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-5 h-5" />
                <h3 className="font-bold text-base">Unit Info</h3>
              </div>
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
                <UserPlus className="w-12 h-12 text-warning" />
                <p className="text-sm text-base-content/60">No tenant assigned yet</p>
                <button className="btn btn-warning btn-soft btn-sm gap-1" onClick={() => setShowAddTenant(true)}>
                  <Plus className="w-4 h-4" />
                  Add Tenant
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
                <div className="flex items-center gap-2">
                  <ReceiptText className="w-5 h-5" />
                  <h3 className="font-bold text-base">Bill History</h3>
                </div>
                {unit.tenant && (
                  <button className="btn btn-primary btn-soft btn-sm gap-1" onClick={() => setShowGenerateBill(true)}>
                    <Plus className="w-4 h-4" />
                    Generate Bill
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
                  <ReceiptText className="w-12 h-12" />
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md w-full mx-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-error" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg">Delete Unit</h3>
                <p className="text-xs sm:text-sm text-base-content/60">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-base-200 rounded-lg p-3 sm:p-4 mb-4">
              <p className="text-xs sm:text-sm mb-2">You are about to delete:</p>
              <p className="font-bold text-sm sm:text-base wrap-break-word">{unit?.unit_name}</p>
              {unit?.tenant && (
                <div className="mt-3 pt-3 border-t border-base-300">
                  <p className="text-xs sm:text-sm text-warning flex items-start gap-2">
                    <UserPlus className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="wrap-break-word">
                      This unit has an active tenant: <strong>{unit.tenant.tenant_name}</strong>
                    </span>
                  </p>
                </div>
              )}
              {unit?.bills && unit.bills.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs sm:text-sm text-warning flex items-start gap-2">
                    <ReceiptText className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      This unit has <strong>{unit.bills.length}</strong> bill(s) associated with it
                    </span>
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-base-content/70 mb-6">
              All associated data including tenant information and bill history will be permanently deleted.
            </p>

            <div className="modal-action flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
              <button
                className="btn btn-ghost w-full sm:w-auto order-2 sm:order-1"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteUnit.isPending}
              >
                Cancel
              </button>
              <button
                className="btn btn-error gap-2 w-full sm:w-auto order-1 sm:order-2"
                onClick={handleDeleteUnit}
                disabled={deleteUnit.isPending}
              >
                {deleteUnit.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Deleting...</span>
                    <span className="sm:hidden">Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete Permanently</span>
                    <span className="sm:hidden">Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => !deleteUnit.isPending && setShowDeleteConfirm(false)} />
        </div>
      )}
    </div>
  );
}
