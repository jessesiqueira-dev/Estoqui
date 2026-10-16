"use client";

import { useAction } from "next-safe-action/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { upsertProductAction } from "@/app/_actions/product/upsert-product";
import {
  upsertProductSchema,
  type UpsertProductInput,
} from "@/app/_actions/product/upsert-product/schema";
import { Button } from "@/app/_components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";

const inputClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30";

export function UpsertDialogContent({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const form = useForm<UpsertProductInput>({
    resolver: zodResolver(upsertProductSchema),
    defaultValues: { name: "", price: "", stock: "" },
  });

  const { execute, isExecuting, result } = useAction(upsertProductAction, {
    onSuccess: () => {
      form.reset();
      onCreated();
    },
  });

  const onSubmit = form.handleSubmit((values) => execute(values));
  const actionError = result.serverError
    ? result.serverError
    : result.validationErrors
      ? "Confira os dados informados e tente novamente."
      : null;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo produto</DialogTitle>
        <DialogDescription>
          Preencha os dados para adicionar um produto ao estoque.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <label htmlFor="product-name" className="text-sm font-medium">
            Nome do produto
          </label>
          <input
            id="product-name"
            autoComplete="off"
            placeholder="Ex.: Cimento CP II 50 kg"
            className={inputClassName}
            aria-invalid={!!form.formState.errors.name}
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="product-price" className="text-sm font-medium">
            Valor unitário
          </label>
          <input
            id="product-price"
            inputMode="decimal"
            placeholder="Ex.: 38,90"
            className={inputClassName}
            aria-invalid={!!form.formState.errors.price}
            {...form.register("price")}
          />
          {form.formState.errors.price && (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.price.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="product-stock" className="text-sm font-medium">
            Estoque inicial
          </label>
          <input
            id="product-stock"
            type="number"
            min="0"
            step="1"
            placeholder="Ex.: 40"
            className={inputClassName}
            aria-invalid={!!form.formState.errors.stock}
            {...form.register("stock")}
          />
          {form.formState.errors.stock && (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.stock.message}
            </p>
          )}
        </div>

        {actionError && (
          <p role="alert" className="text-sm text-destructive">
            {actionError}
          </p>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isExecuting}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isExecuting}>
            {isExecuting ? (
              <>
                <LoaderCircle className="animate-spin" aria-hidden="true" />
                Salvando...
              </>
            ) : (
              "Salvar produto"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
