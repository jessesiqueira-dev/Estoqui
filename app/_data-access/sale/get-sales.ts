import "server-only";

import { db } from "@/app/_lib/prisma";

export const getSales = async () => {
  const sales = await db.sale.findMany({ include: { saleProducts: { include: { product: true } } }, orderBy: { date: "desc" } });
  return sales.map((sale) => ({
    id: sale.id,
    date: sale.date,
    products: sale.saleProducts.map(({ product, productId, quantity, unitPrice }) => ({ productId, name: product.name, quantity, unitPrice: Number(unitPrice) })),
    totalProducts: sale.saleProducts.reduce((sum, line) => sum + line.quantity, 0),
    totalAmount: sale.saleProducts.reduce((sum, line) => sum + line.quantity * Number(line.unitPrice), 0),
  }));
};
