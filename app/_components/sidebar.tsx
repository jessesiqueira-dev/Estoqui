
import {
  PackageIcon,
  LayoutGridIcon,
  ShoppingBasketIcon,
} from "lucide-react";
import SidebarButton from "./sidebar-button";

const Sidebar = () => {
  return (
    <div className="min-h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="px-6 py-6">
        <h1 className="text-3xl font-bold tracking-wide text-primary">ESTOQUI</h1>
      </div>

      <nav className="flex flex-col gap-1 px-2">
        <SidebarButton href="/">
          <LayoutGridIcon size={20} />
          Dashboard
        </SidebarButton>

        <SidebarButton href="/products">
          <PackageIcon size={20} />
          Produtos
        </SidebarButton>

        <SidebarButton href="/sales">
          <ShoppingBasketIcon size={20} />
          Vendas
        </SidebarButton>
      </nav>
    </div>
  );
};

export default Sidebar;
