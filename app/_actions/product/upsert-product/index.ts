"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/app/_lib/safe-action";
import { db } from "@/app/_lib/prisma";
import { upsertProductSchema } from "./schema";

export const upsertProductAction = actionClient
  .schema(upsertProductSchema)
  .action(async ({ parsedInput: { id, name, price, stock } }) => {
    const data = { name, price: price.replace(",", "."), stock: Number(stock) };
    if (id) await db.product.update({ where: { id }, data });
    else await db.product.create({ data });
    revalidatePath("/products");
    revalidatePath("/");
  });
