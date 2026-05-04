import type { RateSetting } from '../../types';

type RateHistoryRowProps = {
  rate: RateSetting;
  isActive: boolean;
};

export default function RateHistoryRow({ rate, isActive }: RateHistoryRowProps) {
  return (
    <tr className={isActive ? 'bg-primary/5' : ''}>
      <td>
        <div className="flex items-center gap-2">
          {new Date(rate.effective_from).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {isActive && <span className="badge badge-primary badge-sm">Active</span>}
        </div>
      </td>
      <td className="font-medium">₱{Number(rate.electricity_rate).toLocaleString()}/kwh</td>
      <td className="font-medium">₱{Number(rate.water_rate).toLocaleString()}/person</td>
    </tr>
  );
}
