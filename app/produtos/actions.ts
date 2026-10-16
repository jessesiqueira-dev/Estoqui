"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/app/_lib/prisma";

type ProductActionState = {
  success: boolean;
  message: string;
};

export async function createProductAction(
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const rawName = formData.get("name");
  const rawPrice = formData.get("price");
  const rawStock = formData.get("stock");

  const name = typeof rawName === "string" ? rawName.trim() : "";
  const priceInput = typeof rawPrice === "string" ? rawPrice.trim() : "";
  const stockInput = typeof rawStock === "string" ? rawStock.trim() : "";
  const normalizedPrice = priceInput.replace(",", ".");

  if (!name) {
    return { success: false, message: "Informe o nome do produto." };
  }

  if (name.length > 120) {
    return {
      success: false,
      message: "O nome do produto deve ter até 120 caracteres.",
    };
  }

  if (!/^\d+(\.\d{1,2})?$/.test(normalizedPrice)) {
    return {
      success: false,
      message: "Informe um preço válido com até duas casas decimais.",
    };
  }

  if (Number(normalizedPrice) <= 0) {
    return { success: false, message: "O preço deve ser maior que zero." };
  }

  if (!/^\d+$/.test(stockInput)) {
    return {
      success: false,
      message: "O estoque deve ser um número inteiro igual ou maior que zero.",
    };
  }

  const stock = Number(stockInput);
  if (!Number.isSafeInteger(stock)) {
    return { success: false, message: "Informe uma quantidade válida." };
  }

  try {
    await db.product.create({
      data: {
        name,
        price: normalizedPrice,
        stock,
      },
    });
  } catch {
    return {
      success: false,
      message: "Não foi possível cadastrar o produto. Tente novamente.",
    };
  }

  revalidatePath("/produtos");
  return { success: true, message: "Produto cadastrado com sucesso." };
}
