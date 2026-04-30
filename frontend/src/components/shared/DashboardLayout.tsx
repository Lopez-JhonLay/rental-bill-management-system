import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — fixed on the left */}
      <Sidebar />

      {/* Main content — scrollable */}
      <main className="flex-1 overflow-y-auto bg-base-100">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
