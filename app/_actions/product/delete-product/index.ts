"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/app/_lib/safe-action";
import { db } from "@/app/_lib/prisma";
import { deleteProductSchema } from "./schema";

export const deleteProductAction = actionClient
  .schema(deleteProductSchema)
  .action(async ({ parsedInput: { id } }) => {
    const salesHistory = await db.saleProduct.count({ where: { productId: id } });
    if (salesHistory > 0) throw new Error("Este produto aparece em vendas registradas e não pode ser excluído.");
    await db.product.delete({ where: { id } });
    revalidatePath("/products");
    revalidatePath("/");
  });
