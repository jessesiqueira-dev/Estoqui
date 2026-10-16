"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { createProductAction } from "../actions";

type ProductActionState = {
  success: boolean;
  message: string;
};

const initialState: ProductActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30";

function ProductForm({ onCreated }: { onCreated: () => void }) {
  const [state, formAction, pending] = useActionState(
    createProductAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) onCreated();
  }, [onCreated, state.success]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="product-name" className="text-sm font-medium">
          Nome do produto
        </label>
        <input
          id="product-name"
          name="name"
          type="text"
          maxLength={120}
          autoComplete="off"
          placeholder="Ex.: Cimento CP II 50 kg"
          className={inputClassName}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="product-price" className="text-sm font-medium">
          Valor unitário
        </label>
        <input
          id="product-price"
          name="price"
          type="text"
          inputMode="decimal"
          placeholder="Ex.: 38,90"
          className={inputClassName}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="product-stock" className="text-sm font-medium">
          Estoque inicial
        </label>
        <input
          id="product-stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          placeholder="Ex.: 40"
          className={inputClassName}
          required
        />
      </div>

      {state.message && !state.success && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={pending}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar produto"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const closeAfterCreate = useCallback(() => setOpen(false), []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon size={20} />
          Novo produto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar um produto ao estoque.
          </DialogDescription>
        </DialogHeader>
        <ProductForm onCreated={closeAfterCreate} />
      </DialogContent>
    </Dialog>
  );
}
