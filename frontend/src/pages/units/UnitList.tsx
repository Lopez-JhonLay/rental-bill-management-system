import { useState } from 'react';

import { useUnits } from '../../hooks/useUnitActions';

import PageHeader from '../../components/shared/PageHeader';
import UnitCard from '../../components/unit/UnitCard';
import AddUnitModal from '../../components/unit/AddUnitModal';

import { HouseHeart } from 'lucide-react';

export default function UnitsList() {
  const [showModal, setShowModal] = useState(false);
  const { data: units, isLoading, error } = useUnits();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Failed to load units. Please refresh the page.</span>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Units"
        subtitle={`${units?.length ?? 0} unit${units?.length !== 1 ? 's' : ''} total`}
        action={
          <button className="btn btn-soft btn-primary" onClick={() => setShowModal(true)}>
            + Add Unit
          </button>
        }
      />

      {/* Empty State */}
      {units?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-base-content/50">
          <span className="text-6xl">
            <HouseHeart size={100} />
          </span>
          <p className="text-lg font-medium">No units yet</p>
          <p className="text-sm">Add your first unit to get started</p>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            + Add Unit
          </button>
        </div>
      )}

      {/* Units Grid */}
      {units && units.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      )}
      {/* Add Unit Modal */}
      {showModal && <AddUnitModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
