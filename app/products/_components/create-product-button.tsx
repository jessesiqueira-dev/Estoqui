"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogTrigger } from "@/app/_components/ui/dialog";
import { UpsertDialogContent } from "./upsert-dialog-content";

export function CreateProductButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon size={20} />
          Novo produto
        </Button>
      </DialogTrigger>
      {open && <UpsertDialogContent onCreated={() => setOpen(false)} />}
    </Dialog>
  );
}
