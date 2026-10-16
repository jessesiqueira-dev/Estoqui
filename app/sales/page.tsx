import { Suspense } from "react";
import { getProducts } from "@/app/_data-access/product/get-products";
import { getSales } from "@/app/_data-access/sale/get-sales";
import { SalesList } from "./_components/sales-list";

async function SalesData() {
  const [products, sales] = await Promise.all([getProducts(), getSales()]);
  return (
    <SalesList
      products={products.map((product) => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        price: Number(product.price),
      }))}
      sales={sales}
    />
  );
}

export default function SalesPage() {
  return (
    <main className="min-h-screen min-w-0 flex-1 bg-background px-8 py-7">
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-primary">Vendas</span>
          <h1 className="text-xl font-semibold">Gestão de vendas</h1>
        </div>
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-muted-foreground">
              Carregando vendas...
            </div>
          }
        >
          <SalesData />
        </Suspense>
      </div>
    </main>
  );
}
