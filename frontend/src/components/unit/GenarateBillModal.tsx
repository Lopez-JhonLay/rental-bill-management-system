import { useState } from 'react';
import { Loader2, FileText } from 'lucide-react';
import { useCreateBill } from '../../hooks/useBillActions';
import { useNavigate } from 'react-router';

interface GenerateBillModalProps {
  unitId: string;
  onClose: () => void;
}

export default function GenerateBillModal({ unitId, onClose }: GenerateBillModalProps) {
  const navigate = useNavigate();

  // Default billing month to current month
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [form, setForm] = useState({
    billing_month: currentMonth,
    current_kwh: '' as string | number,
  });

  const createBill = useCreateBill();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBill.mutate(
      {
        unit_id: unitId,
        billing_month: form.billing_month,
        current_kwh: Number(form.current_kwh) || 0,
      },
      {
        onSuccess: (bill) => {
          onClose();
          // Navigate directly to the bill page
          navigate(`/units/${unitId}/bills/${bill.id}`);
        },
      },
    );
  };

  // Extract error message
  const getErrorMessage = () => {
    const error = createBill.error as any;
    return error?.response?.data?.message || 'Failed to generate bill';
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Generate Bill</h3>
        {createBill.isError && (
          <div className="alert alert-error mb-4">
            <span>{getErrorMessage()}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="form-control">
            <div className="label pb-1">
              <span className="label-text">Billing Month</span>
            </div>
            <input
              type="month"
              name="billing_month"
              className="input input-bordered w-full"
              value={form.billing_month}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-control">
            <div className="label pb-1">
              <span className="label-text">Current KWH Reading</span>
            </div>
            <input
              type="number"
              name="current_kwh"
              placeholder="e.g. 1380"
              className="input input-bordered w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={form.current_kwh}
              onChange={handleChange}
              min={0}
              required
            />
          </label>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-soft btn-primary gap-2" disabled={createBill.isPending}>
              {createBill.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Bill
                </>
              )}
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
