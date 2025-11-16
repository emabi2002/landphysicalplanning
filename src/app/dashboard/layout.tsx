import { Sidebar } from '@/components/layout/sidebar';
import { NotificationCenter } from '@/components/notifications/notification-center';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {/* Notification Bell - Top Right */}
        <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-8 py-3 flex justify-end">
          <NotificationCenter />
        </div>
        {children}
      </main>
    </div>
  );
}
