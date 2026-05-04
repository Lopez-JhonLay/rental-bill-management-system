import { Coins, Zap, Droplets, Home } from 'lucide-react';
import type { Bill } from '../../types';

type BillBreakdownProps = {
  bill: Bill;
};

export default function BillBreakdown({ bill }: BillBreakdownProps) {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <div className="flex items-center gap-2 mb-4">
          <Coins className="w-5 h-5" />
          <h3 className="font-bold text-base">Bill Breakdown</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Item</th>
                <th>Computation</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Electricity */}
              <tr>
                <td className="font-medium">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Electricity</span>
                  </div>
                </td>
                <td className="text-base-content/60 text-sm">
                  ({Number(bill.current_kwh)} - {Number(bill.previous_kwh)}) kwh × ₱{Number(bill.electricity_rate)}/kwh
                </td>
                <td className="text-right font-medium">₱{Number(bill.electricity_charge).toLocaleString()}</td>
              </tr>

              {/* Water */}
              <tr>
                <td className="font-medium">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    <span>Water</span>
                  </div>
                </td>
                <td className="text-base-content/60 text-sm">
                  {bill.tenant?.person_count} person(s) × ₱{Number(bill.water_rate)}/person
                </td>
                <td className="text-right font-medium">₱{Number(bill.water_charge).toLocaleString()}</td>
              </tr>

              {/* Rent */}
              <tr>
                <td className="font-medium">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    <span>Rent</span>
                  </div>
                </td>
                <td className="text-base-content/60 text-sm">Fixed monthly rent</td>
                <td className="text-right font-medium">₱{Number(bill.rent_charge).toLocaleString()}</td>
              </tr>
            </tbody>

            {/* Total */}
            <tfoot>
              <tr className="border-t-2 border-base-300">
                <td colSpan={2} className="font-bold text-base">
                  Total Amount
                </td>
                <td className="text-right font-bold text-lg text-primary">
                  ₱{Number(bill.total_amount).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Confirmed timestamp */}
        {bill.confirmed_at && (
          <p className="text-xs text-base-content/50 mt-2">
            Confirmed on {new Date(bill.confirmed_at).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
