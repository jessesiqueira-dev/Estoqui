import { DashboardSummary } from "./_components/dashboard-summary";

export default function HomePage() {
  return (
    <main className="min-h-screen min-w-0 flex-1 bg-background px-5 py-7 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-primary">Visão geral</span>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <DashboardSummary />
      </div>
    </main>
  );
}
