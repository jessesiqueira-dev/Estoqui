import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Sidebar from "./_components/sidebar";

export const metadata: Metadata = {
  title: "Estoqui",
  description: "Sistema de controle de estoque",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full">
      <body
        className={`${inter.className} min-h-full bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        <div className="flex h-full gap-8">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
