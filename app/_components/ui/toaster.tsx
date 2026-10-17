"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

type ToastMessage = {
  title: string;
  description?: string;
};

type ToastItem = ToastMessage & { id: number };

const toastEventName = "estoqui:toast";

export function showToast(message: ToastMessage) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastMessage>(toastEventName, { detail: message }),
  );
}

export function Toaster() {
  const [toast, setToast] = useState<ToastItem | null>(null);

  useEffect(() => {
    let nextId = 0;
    let timeoutId: number | undefined;

    const handleToast = (event: Event) => {
      const message = (event as CustomEvent<ToastMessage>).detail;
      const id = ++nextId;
      setToast({ ...message, id });

      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setToast(null), 4000);
    };

    window.addEventListener(toastEventName, handleToast);
    return () => {
      window.removeEventListener(toastEventName, handleToast);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-[calc(100%-2rem)] max-w-sm">
      <div
        key={toast.id}
        role="status"
        aria-live="polite"
        className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-lg"
      >
        <CheckCircle2
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {toast.description}
            </p>
          )}
        </div>
        <button
          type="button"
          aria-label="Fechar notificação"
          className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setToast(null)}
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}
