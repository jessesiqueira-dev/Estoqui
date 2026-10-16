
import { Suspense } from "react";
import { DataTable } from "../_components/ui/data-table";
import { getProducts } from "../_data-access/product/get-products";
import { productTableColumns } from "./_components/table-columns";
import { CreateProductButton } from "./_components/create-product-button";

const ProductsTable = async () => {
  const products = await getProducts();

  const productsForTable = products.map(
    ({ id, name, price, stock }) => ({
      id,
      name,
      price: price.toString(),
      stock,
    }),
  );

  return (
    <DataTable
      columns={productTableColumns}
      data={productsForTable}
    />
  );
};

const ProductsPage = () => {
  return (
    <main className="min-h-screen min-w-0 flex-1 bg-background px-8 py-7">
      <div className="space-y-6">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-primary">
              Produtos
            </span>
            <h1 className="text-xl font-semibold">Gestão de produtos</h1>
          </div>

          <CreateProductButton />
        </div>

        <Suspense
          fallback={
            <div className="py-8 text-center text-sm text-muted-foreground">
              Carregando produtos...
            </div>
          }
        >
          <ProductsTable />
        </Suspense>
      </div>
    </main>
  );
};

export default ProductsPage;
