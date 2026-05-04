import { Settings, Zap, Droplets, Calendar } from 'lucide-react';
import type { RateSetting } from '../../types';

type ActiveRateCardProps = {
  rate: RateSetting;
};

export default function ActiveRateCard({ rate }: ActiveRateCardProps) {
  return (
    <div className="card bg-base-100 border-2 border-success shadow-lg">
      <div className="card-body">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Current Active Rate</h3>
              <p className="text-xs text-base-content/60">Applied to all new bills</p>
            </div>
          </div>
          <div className="badge badge-success gap-1">
            <div className="w-2 h-2 rounded-full bg-success-content animate-pulse" />
            Active
          </div>
        </div>

        {/* Rate Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Electricity Rate */}
          <div className="bg-linear-to-br from-warning/5 to-warning/10 border border-warning/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-warning" />
              </div>
              <span className="text-sm font-medium text-base-content/70">Electricity</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-warning">₱{Number(rate.electricity_rate).toLocaleString()}</span>
            </div>
            <p className="text-xs text-base-content/50 mt-1">per kilowatt-hour (KWH)</p>
          </div>

          {/* Water Rate */}
          <div className="bg-linear-to-br from-info/5 to-info/10 border border-info/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-info/20 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-info" />
              </div>
              <span className="text-sm font-medium text-base-content/70">Water</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-info">₱{Number(rate.water_rate).toLocaleString()}</span>
            </div>
            <p className="text-xs text-base-content/50 mt-1">per person per month</p>
          </div>
        </div>

        {/* Effective Date */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-base-300">
          <Calendar className="w-4 h-4 text-base-content/40" />
          <p className="text-sm text-base-content/60">
            Effective from{' '}
            <span className="font-medium text-base-content">
              {new Date(rate.effective_from).toLocaleDateString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
