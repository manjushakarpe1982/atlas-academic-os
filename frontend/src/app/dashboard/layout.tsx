import BottomNav from "../_components/BottomNav";
import TopHeader from "../_components/TopHeader";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      <TopHeader />
      <main className="pb-20 pt-2">{children}</main>
      <BottomNav />
    </div>
  );
}

// $env:Path += ";C:\Program Files\nodejs\"