"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminStore } from "@/stores/admin.store";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Hotel, CalendarCheck, Users, LogOut } from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Hôtels", href: "/admin/hotels", icon: Hotel },
  { label: "Réservations", href: "/admin/reservations", icon: CalendarCheck },
  { label: "Utilisateurs", href: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, clearAuth } = useAdminStore();

  return (
    <aside className="fixed left-0 top-0 z-50 w-64 h-screen bg-gray-900 flex flex-col shadow-xl">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white tracking-tight">
            Tunisia<span className="text-orange-500">Book</span>
          </span>
          <span className="text-[10px] font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
            Admin
          </span>
        </div>
        {admin && (
          <p className="text-gray-500 text-xs mt-2 truncate">{admin.email}</p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-gray-500")} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {admin?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium truncate">{admin?.name}</p>
            <p className="text-gray-500 text-xs truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={() => { clearAuth(); router.push("/admin/login"); }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
