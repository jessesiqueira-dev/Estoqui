import { db } from "@/app/_lib/prisma";
import { z } from "zod";

const idSchema = z.string().uuid();

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return Response.json({ message: "ID inválido." }, { status: 400 });
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return Response.json({ message: "Produto não encontrado." }, { status: 404 });
  return Response.json({ ...product, price: Number(product.price) });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return Response.json({ message: "ID inválido." }, { status: 400 });
  const body: unknown = await request.json().catch(() => null);
  const parsed = z.object({ name: z.string().trim().min(1).max(120), price: z.coerce.number().positive(), stock: z.number().int().nonnegative() }).safeParse(body);
  if (!parsed.success) return Response.json({ message: "Dados inválidos.", errors: parsed.error.flatten() }, { status: 400 });
  try {
    const product = await db.product.update({ where: { id }, data: parsed.data });
    return Response.json({ ...product, price: Number(product.price) });
  } catch {
    return Response.json({ message: "Produto não encontrado." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return Response.json({ message: "ID inválido." }, { status: 400 });
  try {
    const salesHistory = await db.saleProduct.count({ where: { productId: id } });
    if (salesHistory > 0) return Response.json({ message: "Este produto aparece em vendas registradas e não pode ser excluído." }, { status: 409 });
    await db.product.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ message: "Produto não encontrado." }, { status: 404 });
  }
}
