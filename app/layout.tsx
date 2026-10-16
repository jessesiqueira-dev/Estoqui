import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./_components/sidebar";

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
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
