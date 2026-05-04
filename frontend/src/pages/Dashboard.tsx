import { useAuth } from '../context/AuthContext';
import { useUnits } from '../hooks/useUnitActions';
import { useBills } from '../hooks/useBillActions';
import { Home, FileText, CheckCircle, Settings, Coins, ReceiptText } from 'lucide-react';

import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/dashboard/StatCard';
import BillRow from '../components/shared/BillRow';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: units, isLoading: unitsLoading } = useUnits();
  const { data: bills, isLoading: billsLoading } = useBills();

  // Compute stats from data
  const totalUnits = units?.length ?? 0;
  const occupiedUnits = units?.filter((u) => u.tenant).length ?? 0;
  const vacantUnits = totalUnits - occupiedUnits;
  const draftBills = bills?.filter((b) => b.status === 'DRAFT').length ?? 0;
  const confirmedBills = bills?.filter((b) => b.status === 'CONFIRMED').length ?? 0;

  // Total collectibles from DRAFT bills
  const totalCollectibles =
    bills?.filter((b) => b.status === 'DRAFT').reduce((sum, b) => sum + Number(b.total_amount), 0) ?? 0;

  // Recent bills — latest 5
  const recentBills = bills?.slice(0, 5) ?? [];

  const isLoading = unitsLoading || billsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0]}!`}
        subtitle="Here's your rental portfolio overview"
      />
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Home className="w-6 h-6" />}
          label="Total Units"
          value={totalUnits}
          description={`${occupiedUnits} occupied · ${vacantUnits} vacant`}
          color="primary"
        />
        <StatCard
          icon={<FileText className="w-6 h-6" />}
          label="Pending Bills"
          value={draftBills}
          description="Awaiting confirmation"
          color="warning"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Confirmed Bills"
          value={confirmedBills}
          description="Locked and finalized"
          color="success"
        />
        <StatCard
          icon={<Coins className="w-6 h-6" />}
          label="Total Collectibles"
          value={`₱${totalCollectibles.toLocaleString()}`}
          description="From pending bills"
          color="primary"
        />
      </div>

      {/* Recent Bills */}
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <ReceiptText className="w-5 h-5" />
            <h3 className="font-bold text-base">Recent Bills</h3>
          </div>

          {recentBills.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2 text-base-content/50">
              <ReceiptText className="w-12 h-12" />
              <p className="text-sm">No bills generated yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Electricity</th>
                    <th>Water</th>
                    <th>Rent</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBills.map((bill) => (
                    <BillRow key={bill.id} bill={bill} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div
          className="card bg-base-100 border border-base-300 hover:border-primary transition-colors cursor-pointer"
          onClick={() => (window.location.href = '/units')}
        >
          <div className="card-body items-center text-center">
            <Home className="w-10 h-10 text-primary" />
            <p className="font-medium">Manage Units</p>
            <p className="text-xs text-base-content/50">Add or view your rental units</p>
          </div>
        </div>

        <div
          className="card bg-base-100 border border-base-300 hover:border-warning transition-colors cursor-pointer"
          onClick={() => (window.location.href = '/units')}
        >
          <div className="card-body items-center text-center">
            <ReceiptText className="w-10 h-10 text-warning" />
            <p className="font-medium">Generate Bills</p>
            <p className="text-xs text-base-content/50">Create monthly bills for tenants</p>
          </div>
        </div>

        <div
          className="card bg-base-100 border border-base-300 hover:border-success transition-colors cursor-pointer"
          onClick={() => (window.location.href = '/settings/rates')}
        >
          <div className="card-body items-center text-center">
            <Settings className="w-10 h-10 text-success" />
            <p className="font-medium">Rate Settings</p>
            <p className="text-xs text-base-content/50">Manage electricity and water rates</p>
          </div>
        </div>
      </div>
    </div>
  );
}
