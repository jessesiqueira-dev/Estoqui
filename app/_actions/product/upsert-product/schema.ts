import { z } from "zod";

export const upsertProductSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Informe o nome do produto.").max(120),
  price: z.string().trim().regex(/^\d+(?:[.,]\d{1,2})?$/).refine((value) => Number(value.replace(",", ".")) > 0, "O preço deve ser maior que zero."),
  stock: z.string().trim().regex(/^\d+$/).refine((value) => Number.isSafeInteger(Number(value)), "Informe uma quantidade válida."),
});

export type UpsertProductInput = z.infer<typeof upsertProductSchema>;
