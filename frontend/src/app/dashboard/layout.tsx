import TopHeader from '@/components/TopHeader';
import BottomNav from '@/components/BottomNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      <TopHeader />
      <main className="pb-20 pt-2">{children}</main>
      <BottomNav />
    </div>
  );
}
