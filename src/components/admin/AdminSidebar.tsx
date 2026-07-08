"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminStore } from "@/stores/admin.store";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { LayoutDashboard, Hotel, CalendarCheck, Users, LogOut, Hexagon } from "lucide-react";

const navItem = cva(
  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150",
  {
    variants: {
      active: {
        true: "bg-indigo-500/10 text-indigo-400",
        false: "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50",
      },
    },
    defaultVariants: { active: false },
  }
);

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
    <aside className="fixed left-0 top-0 z-50 w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col">
      <div className="px-5 py-5 border-b border-zinc-800">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Hexagon className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-zinc-100">BookNGo</span>
        </Link>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link key={link.href} href={link.href} className={cn(navItem({ active: isActive }))}>
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-800">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs font-bold shrink-0">
            {admin?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate leading-tight">{admin?.name ?? "Admin"}</p>
            <p className="text-xs text-zinc-500 truncate leading-tight">{admin?.email ?? ""}</p>
          </div>
        </div>
        <button
          onClick={() => { useAuthStore.getState().clearAuth(); clearAuth(); router.push("/admin/login"); }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}