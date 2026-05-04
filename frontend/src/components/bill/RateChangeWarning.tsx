type RateChangeWarningProps = {
  currentRates: {
    electricity_rate: number;
    water_rate: number;
  };
  newRates: {
    electricity_rate: number;
    water_rate: number;
  };
  onRecompute: () => void;
  onForceConfirm: () => void;
  isLoading: boolean;
};

export default function RateChangeWarning({
  currentRates,
  newRates,
  onRecompute,
  onForceConfirm,
  isLoading,
}: RateChangeWarningProps) {
  return (
    <div className="alert alert-warning flex flex-col items-start gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚠️</span>
        <span className="font-bold">Rate has changed since this bill was generated</span>
      </div>

      {/* Rate comparison */}
      <div className="grid grid-cols-2 gap-4 w-full text-sm">
        <div className="bg-base-100 rounded-lg p-3">
          <p className="font-medium mb-1">Bill was generated with:</p>
          <p>⚡ ₱{currentRates.electricity_rate}/kwh</p>
          <p>💧 ₱{currentRates.water_rate}/person</p>
        </div>
        <div className="bg-base-100 rounded-lg p-3">
          <p className="font-medium mb-1">Current active rate:</p>
          <p>⚡ ₱{newRates.electricity_rate}/kwh</p>
          <p>💧 ₱{newRates.water_rate}/person</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 w-full">
        <button className="btn btn-primary btn-sm flex-1" onClick={onRecompute} disabled={isLoading}>
          {isLoading ? <span className="loading loading-spinner loading-xs" /> : '🔄 Recompute with new rate'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onForceConfirm} disabled={isLoading}>
          Confirm anyway
        </button>
      </div>
    </div>
  );
}
