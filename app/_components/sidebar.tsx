
import {
  PackageIcon,
  LayoutGridIcon,
  ShoppingBasketIcon,
} from "lucide-react";
import SidebarButton from "./sidebar-button";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white">
      <div className="px-8 py-6">
        <h1 className="text-2xl font-bold">ESTOQUI</h1>
      </div>

      <nav className="flex flex-col gap-2 p-2">
        <SidebarButton href="/">
          <LayoutGridIcon size={20} />
          Dashboard
        </SidebarButton>

        <SidebarButton href="/produtos">
          <PackageIcon size={20} />
          Produtos
        </SidebarButton>

        <SidebarButton href="/vendas">
          <ShoppingBasketIcon size={20} />
          Vendas
        </SidebarButton>
      </nav>
    </div>
  );
};

export default Sidebar;
