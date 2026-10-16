"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteSaleAction } from "@/app/_actions/sale/delete-sale";
import { upsertSaleAction } from "@/app/_actions/sale/upsert-sale";
import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/_components/ui/dialog";
import { formatCurrency } from "@/app/_helpers/currency";

type ProductOption = { id: string; name: string; stock: number; price: number };
type Sale = Awaited<ReturnType<typeof import("@/app/_data-access/sale/get-sales").getSales>>[number];

export function SalesList({ products, sales }: { products: ProductOption[]; sales: Sale[] }) {
  const [open, setOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [selection, setSelection] = useState<Record<string, number>>({});
  const router = useRouter();
  const create = useAction(upsertSaleAction, { onSuccess: () => { setSelection({}); setEditingSale(null); setOpen(false); router.refresh(); } });
  const remove = useAction(deleteSaleAction, { onSuccess: () => router.refresh() });
  const selected = Object.entries(selection).filter(([, quantity]) => quantity > 0);
  const total = selected.reduce((sum, [id, quantity]) => sum + (products.find((product) => product.id === id)?.price ?? 0) * quantity, 0);

  return <div className="space-y-4">
    <div className="flex justify-end">
      <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) { setEditingSale(null); setSelection({}); } }}>
        <Button className="gap-2" onClick={() => { setEditingSale(null); setSelection({}); setOpen(true); }}><Plus size={16} />Nova venda</Button>
        {open && <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editingSale ? "Editar venda" : "Nova venda"}</DialogTitle><DialogDescription>Selecione os produtos e quantidades. O estoque será atualizado ao finalizar.</DialogDescription></DialogHeader>
          <div className="max-h-80 space-y-3 overflow-y-auto py-2">
            {products.map((product) => <label key={product.id} className="flex items-center justify-between gap-4 rounded-md border border-border p-3 text-sm">
              <span className="min-w-0"><span className="block truncate font-medium">{product.name}</span><span className="text-muted-foreground">{formatCurrency(product.price)} · estoque {product.stock}</span></span>
              <input aria-label={`Quantidade de ${product.name}`} className="h-9 w-20 rounded-md border border-input bg-background px-2" type="number" min="0" max={product.stock + (editingSale?.products.find((item) => item.productId === product.id)?.quantity ?? 0)} value={selection[product.id] ?? 0} onChange={(event) => setSelection((current) => ({ ...current, [product.id]: Math.max(0, Number(event.target.value)) }))} />
            </label>)}
            {products.length === 0 && <p className="text-sm text-muted-foreground">Cadastre produtos com estoque para registrar uma venda.</p>}
          </div>
          <p className="text-right text-sm font-semibold">Total: {formatCurrency(total)}</p>
          {create.result.serverError && <p className="text-sm text-destructive" role="alert">{create.result.serverError}</p>}
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button disabled={selected.length === 0 || create.isExecuting} onClick={() => create.execute({ id: editingSale?.id, products: selected.map(([id, quantity]) => ({ id, quantity })) })}>{create.isExecuting ? <LoaderCircle className="animate-spin" /> : editingSale ? "Salvar venda" : "Finalizar venda"}</Button></DialogFooter>
        </DialogContent>}
      </Dialog>
    </div>
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-muted text-left text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Produtos</th><th className="px-4 py-3 font-medium">Unidades</th><th className="px-4 py-3 font-medium">Valor total</th><th className="px-4 py-3 font-medium">Data</th><th className="px-4 py-3 font-medium">Ações</th></tr></thead>
        <tbody>{sales.map((sale) => <tr key={sale.id} className="border-t border-border"><td className="px-4 py-3">{sale.products.map((product) => `${product.name} (${product.quantity})`).join(" · ")}</td><td className="px-4 py-3">{sale.totalProducts}</td><td className="px-4 py-3">{formatCurrency(sale.totalAmount)}</td><td className="px-4 py-3">{new Intl.DateTimeFormat("pt-BR").format(sale.date)}</td><td className="px-4 py-3"><Button variant="ghost" size="icon" aria-label="Editar venda" onClick={() => { setEditingSale(sale); setSelection(Object.fromEntries(sale.products.map((product) => [product.productId, product.quantity]))); setOpen(true); }}><Pencil size={16} /></Button><Button variant="ghost" size="icon" aria-label="Excluir venda" disabled={remove.isExecuting} onClick={() => { if (window.confirm("Excluir esta venda e devolver os itens ao estoque?")) remove.execute({ id: sale.id }); }}><Trash2 size={16} /></Button></td></tr>)}
          {sales.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">Nenhuma venda cadastrada.</td></tr>}</tbody>
      </table></div>
    </div>
  </div>;
}
