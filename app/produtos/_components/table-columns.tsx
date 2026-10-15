"use client";

import { Badge } from "@/app/_components/ui/badge";
import { dataTableFeatures } from "@/app/_components/ui/data-table-config";
import type { Product } from "@/app/generated/prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { CircleIcon } from "lucide-react";

type ProductTableRow = Pick<Product, "id" | "name" | "stock"> & {
  price: string;
};

const columnHelper =
  createColumnHelper<typeof dataTableFeatures, ProductTableRow>();



export const productTableColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Produto",
  }),
  columnHelper.accessor("price", {
    header: "Valor unitário",
  }),
  columnHelper.accessor("stock", {
    header: "Estoque",
  }),
  columnHelper.display({
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const inStock = row.original.stock > 0;
      const label = inStock ? "Em estoque" : "Fora de estoque";

      return (
        <Badge
          variant={inStock ? "default" : "outline"}
          className="gap-1.5"
        >
          <CircleIcon
            size={14}
            className={
              inStock
                ? "fill-primary-foreground"
                : "fill-destructive-foreground"
            }
          />
          {label}
        </Badge>
      );
    },
  }),
]);