import { useState } from 'react';
import { ReceiptText, Plus } from 'lucide-react';
import type { Bill } from '../../types';
import BillRow from '../shared/BillRow';
import GenerateBillModal from './GenarateBillModal';

interface BillHistoryCardProps {
  unitId: string;
  bills: Bill[];
  hasTenant: boolean;
}

export default function BillHistoryCard({ unitId, bills, hasTenant }: BillHistoryCardProps) {
  const [showGenerateBill, setShowGenerateBill] = useState(false);

  return (
    <>
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ReceiptText className="w-5 h-5" />
              <h3 className="font-bold text-base">Bill History</h3>
            </div>
            {hasTenant && (
              <button className="btn btn-primary btn-soft btn-sm gap-1" onClick={() => setShowGenerateBill(true)}>
                <Plus className="w-4 h-4" />
                Generate Bill
              </button>
            )}
          </div>

          {/* Bills Table */}
          {bills && bills.length > 0 ? (
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <BillRow key={bill.id} bill={bill} showActions={true} />
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

      {/* Generate Bill Modal */}
      {showGenerateBill && <GenerateBillModal unitId={unitId} onClose={() => setShowGenerateBill(false)} />}
    </>
  );
}
