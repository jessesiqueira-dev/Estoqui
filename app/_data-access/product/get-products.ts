import "server-only";
import { db } from "@/app/_lib/prisma";
import type { Product } from "@/app/generated/prisma/client";

export const getProducts = async (): Promise<Product[]> =>
  db.product.findMany({});
