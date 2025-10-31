import TopNavigation from '../components/TopNavigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-900">
      <TopNavigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
