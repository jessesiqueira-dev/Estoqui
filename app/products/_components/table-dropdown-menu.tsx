"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { deleteProductAction } from "@/app/_actions/product/delete-product";
import { upsertProductAction } from "@/app/_actions/product/upsert-product";
import { upsertProductSchema, type UpsertProductInput } from "@/app/_actions/product/upsert-product/schema";
import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/_components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type ProductRow = { id: string; name: string; price: string; stock: number };

export function ProductActions({ product }: { product: ProductRow }) {
  const [open, setOpen] = useState(false);
  const [removeError, setRemoveError] = useState("");
  const router = useRouter();
  const form = useForm<UpsertProductInput>({ resolver: zodResolver(upsertProductSchema), defaultValues: { id: product.id, name: product.name, price: product.price, stock: String(product.stock) } });
  const save = useAction(upsertProductAction, { onSuccess: () => { setOpen(false); router.refresh(); } });
  const remove = useAction(deleteProductAction, { onSuccess: () => { setRemoveError(""); router.refresh(); }, onError: ({ error }) => setRemoveError(error.serverError ?? "Não foi possível excluir o produto.") });
  const submit = form.handleSubmit((values) => save.execute(values));

  return <div className="flex items-center gap-1">
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" aria-label={`Editar ${product.name}`} onClick={() => { form.reset({ id: product.id, name: product.name, price: product.price, stock: String(product.stock) }); setOpen(true); }}><Pencil size={16} /></Button>
      <DialogContent>
        <DialogHeader><DialogTitle>Editar produto</DialogTitle><DialogDescription>Atualize as informações do produto.</DialogDescription></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Nome do produto" error={form.formState.errors.name?.message}><input className="h-10 w-full rounded-md border border-input bg-background px-3" {...form.register("name")} /></Field>
          <Field label="Valor unitário" error={form.formState.errors.price?.message}><input inputMode="decimal" className="h-10 w-full rounded-md border border-input bg-background px-3" {...form.register("price")} /></Field>
          <Field label="Estoque" error={form.formState.errors.stock?.message}><input type="number" min="0" step="1" className="h-10 w-full rounded-md border border-input bg-background px-3" {...form.register("stock")} /></Field>
          {save.result.serverError && <p className="text-sm text-destructive" role="alert">{save.result.serverError}</p>}
          <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit" disabled={save.isExecuting}>{save.isExecuting ? <LoaderCircle className="animate-spin" /> : "Salvar alterações"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    <Button variant="ghost" size="icon" aria-label={`Excluir ${product.name}`} disabled={remove.isExecuting} onClick={() => { if (window.confirm(`Excluir ${product.name}? Produtos que aparecem em vendas registradas não podem ser excluídos.`)) remove.execute({ id: product.id }); }}><Trash2 size={16} /></Button>
    {removeError && <span className="max-w-40 text-xs text-destructive" role="alert">{removeError}</span>}
  </div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block space-y-2 text-sm font-medium">{label}{children}{error && <span className="block font-normal text-destructive">{error}</span>}</label>;
}
