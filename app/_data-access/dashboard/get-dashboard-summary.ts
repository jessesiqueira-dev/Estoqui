import "server-only";

import { db } from "@/app/_lib/prisma";

export const getDashboardSummary = async () => {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const startOfNextYear = new Date(currentYear + 1, 0, 1);
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfDay);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  const [productCount, saleCount, stock, allTimeLines, monthlyLines, todayLines, bestSellers] = await Promise.all([
    db.product.count(),
    db.sale.count(),
    db.product.aggregate({ _sum: { stock: true } }),
    db.saleProduct.findMany({ select: { unitPrice: true, quantity: true } }),
    db.saleProduct.findMany({
      where: { sale: { date: { gte: startOfYear, lt: startOfNextYear } } },
      select: { unitPrice: true, quantity: true, sale: { select: { date: true } } },
    }),
    db.saleProduct.findMany({ where: { sale: { date: { gte: startOfDay, lt: startOfTomorrow } } }, select: { unitPrice: true, quantity: true } }),
    db.saleProduct.groupBy({ by: ["productId"], _sum: { quantity: true }, orderBy: { _sum: { quantity: "desc" } }, take: 5 }),
  ]);
  const products = bestSellers.length
    ? await db.product.findMany({
        where: { id: { in: bestSellers.map((item) => item.productId) } },
        select: { id: true, name: true, stock: true, price: true },
      })
    : [];
  const monthlyRevenue = Array.from({ length: 12 }, (_, month) => ({
    month,
    revenue: monthlyLines.reduce((sum, line) => {
      if (line.sale.date.getMonth() !== month) return sum;
      return sum + Number(line.unitPrice) * line.quantity;
    }, 0),
  }));

  return {
    productCount,
    saleCount,
    unitsInStock: stock._sum.stock ?? 0,
    revenue: allTimeLines.reduce((sum, line) => sum + Number(line.unitPrice) * line.quantity, 0),
    todayRevenue: todayLines.reduce((sum, line) => sum + Number(line.unitPrice) * line.quantity, 0),
    monthlyRevenue,
    bestSellers: bestSellers.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return {
        name: product?.name ?? "Produto removido",
        price: product ? Number(product.price) : 0,
        stock: product?.stock ?? 0,
        quantity: item._sum.quantity ?? 0,
      };
    }),
  };
};
