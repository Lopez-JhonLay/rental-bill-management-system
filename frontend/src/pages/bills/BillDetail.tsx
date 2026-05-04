// src/pages/bills/BillDetail.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useBill, useConfirmBill, useRecomputeBill } from '../../hooks/useBillActions';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/shared/StatusBadge';
import BillBreakdown from '../../components/bill/BillBreakdown';
import MeterReadingForm from '../../components/bill/MeetingReadingForm';
import RateChangeWarning from '../../components/bill/RateChangeWarning';

export default function BillDetail() {
  const { id, billId } = useParams<{ id: string; billId: string }>();
  const navigate = useNavigate();
  const [rateWarning, setRateWarning] = useState<{
    current_bill_rates: { electricity_rate: number; water_rate: number };
    new_rates: { electricity_rate: number; water_rate: number };
  } | null>(null);

  const { data: bill, isLoading, error } = useBill(billId!);
  const confirmBill = useConfirmBill();
  const recomputeBill = useRecomputeBill();

  const handleConfirm = () => {
    confirmBill.mutate(
      { id: billId! },
      {
        onSuccess: () => setRateWarning(null),
        onError: (error: any) => {
          const data = error?.response?.data;
          // Check if it's a rate change warning
          if (data?.warning) {
            setRateWarning({
              current_bill_rates: data.current_bill_rates,
              new_rates: data.new_rates,
            });
          }
        },
      },
    );
  };

  const handleRecompute = () => {
    recomputeBill.mutate(billId!, {
      onSuccess: () => setRateWarning(null),
    });
  };

  const handleForceConfirm = () => {
    confirmBill.mutate({ id: billId!, force: true }, { onSuccess: () => setRateWarning(null) });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }
  if (error || !bill) {
    return (
      <div className="alert alert-error">
        <span>Bill not found.</span>
      </div>
    );
  }

  const isDraft = bill.status === 'DRAFT';

  return (
    <div>
      {/* Header */}
      <PageHeader
        title={`Bill — ${bill.billing_month}`}
        subtitle={bill.unit?.unit_name}
        action={
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/units/${id}`)}>
            ← Back to Unit
          </button>
        }
      />

      {/* Status Badge */}
      <div className="flex items-center gap-3 mb-6">
        <StatusBadge status={bill.status} />
        {bill.tenant && (
          <span className="text-sm text-base-content/60">
            {bill.tenant.tenant_name} · {bill.tenant.person_count} person(s)
          </span>
        )}
      </div>

      {/* Rate Change Warning */}
      {rateWarning && (
        <div className="mb-6">
          <RateChangeWarning
            currentRates={rateWarning.current_bill_rates}
            newRates={rateWarning.new_rates}
            onRecompute={handleRecompute}
            onForceConfirm={handleForceConfirm}
            isLoading={recomputeBill.isPending || confirmBill.isPending}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Meter Readings (only for DRAFT) */}
        {isDraft && <MeterReadingForm bill={bill} />}

        {/* Right — Bill Breakdown */}
        <div className={isDraft ? '' : 'lg:col-span-2'}>
          <BillBreakdown bill={bill} />
        </div>
      </div>
      {/* Confirm Button — only for DRAFT */}
      {isDraft && (
        <div className="flex justify-end mt-6">
          <button className="btn btn-success" onClick={handleConfirm} disabled={confirmBill.isPending}>
            {confirmBill.isPending ? <span className="loading loading-spinner loading-sm" /> : '✅ Confirm Bill'}
          </button>
        </div>
      )}

      {/* Confirmed message */}
      {!isDraft && (
        <div className="alert alert-success mt-6">
          <span>✅ This bill has been confirmed and locked on {new Date(bill.confirmed_at!).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
