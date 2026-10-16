import { Suspense } from "react";
import { connection } from "next/server";
import {
  Boxes,
  CircleDollarSign,
  Package,
  ShoppingBasket,
  Wallet,
} from "lucide-react";
import { getDashboardSummary } from "@/app/_data-access/dashboard/get-dashboard-summary";
import { formatCurrency } from "@/app/_helpers/currency";

const monthLabels = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

async function DashboardSummaryContent() {
  await connection();
  const summary = await getDashboardSummary();
  const metrics = [
    {
      label: "Receita total",
      value: formatCurrency(summary.revenue),
      icon: Wallet,
      className: "xl:col-span-3",
    },
    {
      label: "Receita hoje",
      value: formatCurrency(summary.todayRevenue),
      icon: CircleDollarSign,
      className: "xl:col-span-3",
    },
    {
      label: "Vendas totais",
      value: summary.saleCount.toLocaleString("pt-BR"),
      icon: ShoppingBasket,
      className: "xl:col-span-2",
    },
    {
      label: "Total em estoque",
      value: summary.unitsInStock.toLocaleString("pt-BR"),
      icon: Boxes,
      className: "xl:col-span-2",
    },
    {
      label: "Produtos",
      value: summary.productCount.toLocaleString("pt-BR"),
      icon: Package,
      className: "xl:col-span-2",
    },
  ];
  const maxRevenue = Math.max(...summary.monthlyRevenue.map((item) => item.revenue));
  const axisValues = maxRevenue > 0
    ? [maxRevenue, maxRevenue * 0.75, maxRevenue * 0.5, maxRevenue * 0.25, 0]
    : [0, 0, 0, 0, 0];

  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {metrics.map(({ label, value, icon: Icon, className }) => (
          <article
            key={label}
            className={`rounded-xl border border-border bg-card p-5 ${className}`}
          >
            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
              <Icon aria-hidden="true" size={17} />
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid items-stretch gap-4 xl:grid-cols-3">
        <article className="rounded-xl border border-border bg-card p-5 xl:col-span-2">
          <div>
            <h2 className="text-sm font-semibold">Receita</h2>
            <p className="mt-1 text-xs text-muted-foreground">Este ano</p>
          </div>

          <div
            role="img"
            aria-label={`Receita mensal de ${new Date().getFullYear()}`}
            className="mt-5 grid min-h-64 grid-cols-[auto_1fr] gap-3"
          >
            <div
              aria-hidden="true"
              className="flex flex-col justify-between pb-7 text-[10px] text-muted-foreground"
            >
              {axisValues.map((value, index) => (
                <span key={index}>{formatCurrency(value)}</span>
              ))}
            </div>

            <div className="relative grid grid-cols-12 gap-1.5 sm:gap-2">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 bottom-7 flex flex-col justify-between"
              >
                {axisValues.map((_, index) => (
                  <span key={index} className="border-t border-dashed border-border" />
                ))}
              </div>
              {summary.monthlyRevenue.map((item) => {
                const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                return (
                  <div
                    key={item.month}
                    className="z-10 flex h-full min-w-0 flex-col items-center justify-end gap-2"
                  >
                    <div className="flex min-h-0 w-full flex-1 items-end justify-center">
                      <span
                        aria-hidden="true"
                        title={`${monthLabels[item.month]}: ${formatCurrency(item.revenue)}`}
                        className="w-full max-w-8 rounded-t-md bg-primary transition-[height]"
                        style={{ height: `${height}%`, minHeight: item.revenue > 0 ? "4px" : 0 }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground sm:text-[10px]">
                      {monthLabels[item.month]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <ul className="sr-only">
            {summary.monthlyRevenue.map((item) => (
              <li key={item.month}>
                {monthLabels[item.month]}: {formatCurrency(item.revenue)}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Produtos mais vendidos</h2>
          {summary.bestSellers.length ? (
            <ol className="mt-3 divide-y divide-border">
              {summary.bestSellers.map((item, index) => (
                <li key={`${item.name}-${index}`} className="py-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${item.stock > 0 ? "bg-primary" : "bg-muted-foreground"}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${item.stock > 0 ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {item.stock > 0 ? "Em estoque" : "Sem estoque"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-start justify-between gap-3 text-xs">
                    <span className="min-w-0 truncate font-medium">{item.name}</span>
                    <span className="shrink-0 font-medium">
                      {item.quantity.toLocaleString("pt-BR")} vendidos
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatCurrency(item.price)}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              As vendas registradas aparecerão aqui.
            </p>
          )}
        </article>
      </section>
    </div>
  );
}

export function DashboardSummary() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-muted-foreground">
          Carregando indicadores...
        </div>
      }
    >
      <DashboardSummaryContent />
    </Suspense>
  );
}
