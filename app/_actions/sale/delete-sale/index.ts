"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/app/_lib/safe-action";
import { db } from "@/app/_lib/prisma";
import { deleteSaleSchema } from "./schema";

export const deleteSaleAction = actionClient
  .schema(deleteSaleSchema)
  .action(async ({ parsedInput: { id } }) => {
    await db.$transaction(async (transaction) => {
      const sale = await transaction.sale.findUnique({ where: { id }, include: { saleProducts: true } });
      if (!sale) throw new Error("Venda não encontrada.");
      for (const line of sale.saleProducts) {
        await transaction.product.update({ where: { id: line.productId }, data: { stock: { increment: line.quantity } } });
      }
      await transaction.sale.delete({ where: { id } });
    });
    revalidatePath("/sales");
    revalidatePath("/products");
    revalidatePath("/");
  });
