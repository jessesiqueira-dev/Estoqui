import { z } from "zod";

export const upsertSaleSchema = z.object({
  id: z.string().uuid().optional(),
  products: z.array(z.object({ id: z.string().uuid(), quantity: z.number().int().positive() })).min(1, "Adicione ao menos um produto.").refine((products) => new Set(products.map(({ id }) => id)).size === products.length, "Não repita produtos na mesma venda."),
});

export type UpsertSaleInput = z.infer<typeof upsertSaleSchema>;
