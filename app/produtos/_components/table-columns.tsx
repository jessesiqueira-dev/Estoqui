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
      const label = inStock ? "Em estoque" : "Esgotado";

      return (
        <Badge
          variant={inStock ? "secondary" : "outline"}
          className={
            inStock
              ? "gap-1.5 border-transparent"
              : "gap-1.5 border-transparent bg-muted text-muted-foreground"
          }
        >
          <CircleIcon
            size={14}
            className={
              inStock
                ? "fill-primary text-primary"
                : "fill-muted-foreground text-muted-foreground"
            }
          />
          {label}
        </Badge>
      );
    },
  }),
]);
