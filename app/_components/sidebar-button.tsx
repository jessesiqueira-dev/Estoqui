
"use client";

import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";

interface SidebarButtonProps {
  href: string;
  children: ReactNode;
}

const SidebarButton = ({ href, children }: SidebarButtonProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={`h-11 w-full justify-start gap-3 px-3 ${isActive ? "font-semibold" : "text-muted-foreground"}`}
      asChild
    >
      <Link href={href} aria-current={isActive ? "page" : undefined}>
        {children}
      </Link>
    </Button>
  );
};

export default SidebarButton;
