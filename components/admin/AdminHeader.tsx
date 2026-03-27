"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Products",
  "/admin/inventory": "Inventory",
  "/admin/orders": "Orders",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Admin";

  return (
    <header className="h-16 bg-[#111111] border-b border-[#1e1e1e] flex items-center justify-between px-6 shrink-0">
      <h1 className="text-white font-bold text-lg">{title}</h1>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-[#888] text-sm">admin@hypsoul.in</span>
      </div>
    </header>
  );
}
