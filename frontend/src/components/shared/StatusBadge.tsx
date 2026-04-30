import type { BillStatus } from '../../types';

type StatusBadgeProps = {
  status: BillStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge badge-sm font-medium ${status === 'CONFIRMED' ? 'badge-success' : 'badge-warning'}`}>
      {status}
    </span>
  );
}
