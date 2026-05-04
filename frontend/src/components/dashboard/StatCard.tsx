type StatCardProps = {
  icon: string;
  label: string;
  value: string | number;
  description?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
};

export default function StatCard({ icon, label, value, description, color = 'primary' }: StatCardProps) {
  const colorMap = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  };

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base-content/60 text-sm">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${colorMap[color]}`}>{value}</p>
            {description && <p className="text-base-content/50 text-xs mt-1">{description}</p>}
          </div>
          <span className="text-4xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
