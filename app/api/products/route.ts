import { db } from "@/app/_lib/prisma";
import { upsertProductSchema } from "@/app/_actions/product/upsert-product/schema";

export async function GET() {
  const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json(products.map((product) => ({ ...product, price: Number(product.price) })));
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = upsertProductSchema.safeParse(body);
  if (!parsed.success) return Response.json({ message: "Dados inválidos.", errors: parsed.error.flatten() }, { status: 400 });
  const product = await db.product.create({ data: { name: parsed.data.name, price: parsed.data.price.replace(",", "."), stock: Number(parsed.data.stock) } });
  return Response.json({ ...product, price: Number(product.price) }, { status: 201 });
}
