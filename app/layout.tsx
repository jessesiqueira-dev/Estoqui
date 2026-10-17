import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Sidebar from "./_components/sidebar";
import { Toaster } from "./_components/ui/toaster";

export const metadata: Metadata = {
  title: "Estoqui",
  description: "Gestão simples de produtos e estoque.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <div className="flex h-full">
          <Suspense
            fallback={
              <aside
                aria-hidden="true"
                className="min-h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar"
              />
            }
          >
            <Sidebar />
          </Suspense>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
