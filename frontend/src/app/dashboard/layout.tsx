import BottomNav from "../_components/BottomNav";
import TopHeader from "../_components/TopHeader";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screenrelative">
      <TopHeader />
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}

// $env:Path += ";C:\Program Files\nodejs\"