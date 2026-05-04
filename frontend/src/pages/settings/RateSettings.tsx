import { useState } from 'react';
import { History, Settings, Loader2, Plus } from 'lucide-react';

import { useRates } from '../../hooks/useSettingsAction';

import PageHeader from '../../components/shared/PageHeader';
import ActiveRateCard from '../../components/settings/ActiveRateCard';
import RateHistoryRow from '../../components/settings/RateHistoryRow';
import AddRateModal from '../../components/settings/AddRateModal';

export default function RateSettings() {
  const [showModal, setShowModal] = useState(false);
  const { data: rates, isLoading, error } = useRates();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Failed to load rate settings.</span>
      </div>
    );
  }

  // Most recent rate is the active one (already ordered DESC from backend)
  const activeRate = rates?.[0];

  return (
    <div>
      <PageHeader
        title="Rate Settings"
        subtitle="Manage electricity and water rates"
        action={
          <button className="btn btn-soft btn-primary gap-1" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            New Rate
          </button>
        }
      />

      {/* No rates yet */}
      {!activeRate && (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-base-content/50">
          <Settings className="w-16 h-16" />
          <p className="text-lg font-medium">No rates configured yet</p>
          <p className="text-sm">Add your first rate to start generating bills</p>
          <button className="btn btn-primary btn-sm gap-1" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Add Rate
          </button>
        </div>
      )}

      {activeRate && (
        <div className="flex flex-col gap-6">
          {/* Active Rate Card */}
          <ActiveRateCard rate={activeRate} />

          {/* Rate History Table */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5" />
                <h3 className="font-bold text-base">Rate History</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Effective From</th>
                      <th>Electricity Rate</th>
                      <th>Water Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates?.map((rate, index) => (
                      <RateHistoryRow key={rate.id} rate={rate} isActive={index === 0} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && <AddRateModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
