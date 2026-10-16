"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/app/_lib/safe-action";
import { db } from "@/app/_lib/prisma";
import { upsertSaleSchema } from "./schema";

export const upsertSaleAction = actionClient
  .schema(upsertSaleSchema)
  .action(async ({ parsedInput: { products, id } }) => {
    await db.$transaction(async (transaction) => {
      if (id) {
        const previous = await transaction.sale.findUnique({ where: { id }, include: { saleProducts: true } });
        if (!previous) throw new Error("Venda não encontrada.");
        for (const line of previous.saleProducts) {
          await transaction.product.update({ where: { id: line.productId }, data: { stock: { increment: line.quantity } } });
        }
        await transaction.sale.delete({ where: { id } });
      }
      const rows = await Promise.all(products.map(({ id }) => transaction.product.findUnique({ where: { id } })));
      const missing = rows.some((product) => !product);
      if (missing) throw new Error("Um dos produtos selecionados não está mais cadastrado.");
      for (let index = 0; index < products.length; index += 1) {
        if (products[index].quantity > rows[index]!.stock) throw new Error(`Estoque insuficiente para ${rows[index]!.name}.`);
      }
      const sale = await transaction.sale.create({ data: { ...(id ? { id } : {}), date: new Date() } });
      for (let index = 0; index < products.length; index += 1) {
        const selected = products[index];
        const product = rows[index]!;
        const stockUpdate = await transaction.product.updateMany({ where: { id: product.id, stock: { gte: selected.quantity } }, data: { stock: { decrement: selected.quantity } } });
        if (stockUpdate.count === 0) throw new Error(`Estoque insuficiente para ${product.name}.`);
        await transaction.saleProduct.create({ data: { saleId: sale.id, productId: product.id, quantity: selected.quantity, unitPrice: product.price } });
      }
    });
    revalidatePath("/sales");
    revalidatePath("/products");
    revalidatePath("/");
  });
