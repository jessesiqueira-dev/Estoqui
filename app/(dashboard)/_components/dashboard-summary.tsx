import { Suspense } from "react";
import { connection } from "next/server";
import { getDashboardSummary } from "@/app/_data-access/dashboard/get-dashboard-summary";
import { formatCurrency } from "@/app/_helpers/currency";

async function DashboardSummaryContent() {
  await connection();
  const summary = await getDashboardSummary();
  const metrics = [
    ["Faturamento total", formatCurrency(summary.revenue)],
    ["Faturamento de hoje", formatCurrency(summary.todayRevenue)],
    ["Vendas realizadas", String(summary.saleCount)],
    ["Unidades em estoque", String(summary.unitsInStock)],
    ["Produtos cadastrados", String(summary.productCount)],
  ];

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(([label, value]) => (
          <article key={label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
          </article>
        ))}
      </section>
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Produtos mais vendidos</h2>
        {summary.bestSellers.length ? (
          <ol className="mt-4 divide-y divide-border">
            {summary.bestSellers.map((item, index) => (
              <li key={`${item.name}-${index}`} className="flex justify-between py-3 text-sm">
                <span>{index + 1}. {item.name}</span>
                <span className="text-muted-foreground">{item.quantity} un.</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">As vendas registradas aparecerão aqui.</p>
        )}
      </section>
    </>
  );
}

export function DashboardSummary() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Carregando indicadores...</div>}>
      <DashboardSummaryContent />
    </Suspense>
  );
}
