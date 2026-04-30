// src/components/units/UnitCard.tsx
import { useNavigate } from 'react-router';
import type { Unit } from '../../types';

type UnitCardProps = {
  unit: Unit;
};

export default function UnitCard({ unit }: UnitCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="card bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(`/units/${unit.id}`)}
    >
      <div className="card-body">
        {/* Unit Name */}
        <h3 className="card-title text-base">{unit.unit_name}</h3>

        {/* Tenant Info */}
        <div className="flex items-center gap-2 text-sm text-base-content/60">
          <span>👨‍👩‍👧</span>
          {unit.tenant ? (
            <span>
              {unit.tenant.tenant_name} · {unit.tenant.person_count} person{unit.tenant.person_count > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-warning">No tenant assigned</span>
          )}
        </div>

        {/* Monthly Rent */}
        <div className="flex items-center gap-2 text-sm text-base-content/60">
          <span>💰</span>
          <span>₱{unit.monthly_rent.toLocaleString()}/month</span>
        </div>

        {/* Footer */}
        <div className="card-actions justify-end mt-2">
          <button className="btn btn-primary btn-sm">View Details →</button>
        </div>
      </div>
    </div>
  );
}
