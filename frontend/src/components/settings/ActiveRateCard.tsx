import type { RateSetting } from '../../types';

type ActiveRateCardProps = {
  rate: RateSetting;
};

export default function ActiveRateCard({ rate }: ActiveRateCardProps) {
  return (
    <div className="card bg-primary text-primary-content">
      <div className="card-body">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">⚙️</span>
          <h3 className="font-bold text-lg">Current Active Rate</h3>
          <span className="badge badge-outline ml-auto">Active</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-primary-content/10 rounded-lg p-4 text-center">
            <p className="text-primary-content/70 text-sm mb-1">⚡ Electricity</p>
            <p className="text-2xl font-bold">₱{Number(rate.electricity_rate).toLocaleString()}</p>
            <p className="text-primary-content/70 text-xs mt-1">per KWH</p>
          </div>

          <div className="bg-primary-content/10 rounded-lg p-4 text-center">
            <p className="text-primary-content/70 text-sm mb-1">💧 Water</p>
            <p className="text-2xl font-bold">₱{Number(rate.water_rate).toLocaleString()}</p>
            <p className="text-primary-content/70 text-xs mt-1">per person</p>
          </div>
        </div>

        <p className="text-primary-content/60 text-xs mt-3">
          Effective from{' '}
          {new Date(rate.effective_from).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}
