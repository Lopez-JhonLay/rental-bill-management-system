import type { ReactNode } from 'react';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-base-100">
        {/* Mobile header with hamburger */}
        <div className="lg:hidden sticky top-0 z-30 bg-base-100 border-b border-base-300 px-4 py-3">
          <button onClick={toggleSidebar} className="btn btn-ghost btn-sm btn-square" aria-label="Toggle menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
