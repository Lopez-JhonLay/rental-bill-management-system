// src/pages/bills/BillDetail.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
      {/* Back Button */}
      <button onClick={() => navigate(`/units/${id}`)} className="btn btn-ghost btn-sm gap-1 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Unit
      </button>

      {/* Header */}
      <PageHeader title={`Bill — ${bill.billing_month}`} subtitle={bill.unit?.unit_name} />

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
          <button className="btn btn-success gap-2" onClick={handleConfirm} disabled={confirmBill.isPending}>
            {confirmBill.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirm Bill
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
