import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Download } from 'lucide-react';
import type { Bill } from '../../types';
import StatusBadge from './StatusBadge';
import DownloadBillModal from '../bill/DownloadBillModal';

type BillRowProps = {
  bill: Bill;
  showActions?: boolean;
};

export default function BillRow({ bill, showActions = false }: BillRowProps) {
  const navigate = useNavigate();
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDownloadModal(true);
  };

  return (
    <>
      <tr className="hover cursor-pointer" onClick={() => navigate(`/units/${bill.unit_id}/bills/${bill.id}`)}>
        <td className="font-medium">{bill.billing_month}</td>
        <td>₱{Number(bill.electricity_charge).toLocaleString()}</td>
        <td>₱{Number(bill.water_charge).toLocaleString()}</td>
        <td>₱{Number(bill.rent_charge).toLocaleString()}</td>
        <td className="font-bold">₱{Number(bill.total_amount).toLocaleString()}</td>
        <td>
          <StatusBadge status={bill.status} />
        </td>
        {showActions && (
          <td>
            <button className="btn btn-ghost btn-xs gap-1" onClick={handleDownload} title="Download bill">
              <Download className="w-3 h-3" />
            </button>
          </td>
        )}
      </tr>

      {/* Download Modal */}
      {showDownloadModal && <DownloadBillModal bill={bill} onClose={() => setShowDownloadModal(false)} />}
    </>
  );
}
