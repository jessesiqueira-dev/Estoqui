"use client";

import { Badge } from "@/app/_components/ui/badge";
import type { Product as PrismaProduct } from "@/app/generated/prisma/client";
import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import { CircleIcon } from "lucide-react";

export type ProductTableRow = Omit<PrismaProduct, "price"> & {
  price: number;
  status: "IN_STOCK" | "OUT_OF_STOCK";
};

const getStatusLabel = (status: string) => {
  if (status === "IN_STOCK") {
    return "Em estoque";
  }
  return "Fora de estoque";
};

export const productTableColumns: LegacyColumnDef<ProductTableRow>[] = [
  {
    accessorKey: "name",
    header: "Produto",
  },
  {
    accessorKey: "price",
    header: "Valor unitário",
  },
  {
    accessorKey: "stock",
    header: "Estoque",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const product = row.original;
      const label = getStatusLabel(product.status);
      return (
        <Badge
          variant={label === "Em estoque" ? "default" : "outline"}
          className="gap-1.5"
        >
          <CircleIcon
            size={14}
            className={`${label === "Em estoque" ? "fill-primary-foreground" : "fill-destructive-foreground"}`}
          />
          {label}
        </Badge>
      );
    },
  },
];
