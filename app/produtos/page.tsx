import { Suspense } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "../_components/ui/button";
import { DataTable } from "../_components/ui/data-table";
import { getProducts } from "../_data-acess/product/get-products";
import { productTableColumns } from "./_components/table-columns";

async function ProductsTable() {
  const products = await getProducts();

  const productsForTable = products.map(({ id, name, price, stock }) => ({
    id,
    name,
    price: price.toString(),
    stock,
  }));

  return <DataTable columns={productTableColumns} data={productsForTable} />;
}

const ProductsPage = () => {
  return (
    <div className="m-8 w-full space-y-8 rounded-lg bg-white p-8">
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">
            Gestão de Produtos
          </span>
          <h2 className="text-xl font-semibold">Produtos</h2>
        </div>

        <Button className="gap-2">
          <PlusIcon size={20} />
          Novo produto
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="py-8 text-center text-sm text-slate-500">
            Carregando produtos...
          </div>
        }
      >
        <ProductsTable />
      </Suspense>
    </div>
  );
};

export default ProductsPage;