import "server-only";

import { db } from "@/app/_lib/prisma";

export const getDashboardSummary = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfDay);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  const [productCount, saleCount, stock, lines, todayLines, bestSellers] = await Promise.all([
    db.product.count(),
    db.sale.count(),
    db.product.aggregate({ _sum: { stock: true } }),
    db.saleProduct.findMany({ select: { unitPrice: true, quantity: true } }),
    db.saleProduct.findMany({ where: { sale: { date: { gte: startOfDay, lt: startOfTomorrow } } }, select: { unitPrice: true, quantity: true } }),
    db.saleProduct.groupBy({ by: ["productId"], _sum: { quantity: true }, orderBy: { _sum: { quantity: "desc" } }, take: 5 }),
  ]);
  const products = bestSellers.length ? await db.product.findMany({ where: { id: { in: bestSellers.map((item) => item.productId) } }, select: { id: true, name: true } }) : [];
  return {
    productCount,
    saleCount,
    unitsInStock: stock._sum.stock ?? 0,
    revenue: lines.reduce((sum, line) => sum + Number(line.unitPrice) * line.quantity, 0),
    todayRevenue: todayLines.reduce((sum, line) => sum + Number(line.unitPrice) * line.quantity, 0),
    bestSellers: bestSellers.map((item) => ({ name: products.find((product) => product.id === item.productId)?.name ?? "Produto removido", quantity: item._sum.quantity ?? 0 })),
  };
};
