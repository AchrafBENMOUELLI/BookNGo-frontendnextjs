"use client";

import { useAdminHotels, useAdminDeleteHotel } from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Trash2, Plus, Star, MapPin, Building2 } from "lucide-react";
import Link from "next/link";

const starBadge = cva(
  "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded border",
  {
    variants: {
      level: {
        1: "bg-zinc-800 text-zinc-400 border-zinc-700",
        2: "bg-zinc-800 text-zinc-400 border-zinc-700",
        3: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        4: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        5: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      },
    },
    defaultVariants: { level: 3 },
  }
);

export default function AdminHotelsPage() {
  const { data: hotels, isLoading } = useAdminHotels();
  const { mutate: deleteHotel, isPending: isDeleting } = useAdminDeleteHotel();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-7 w-44 bg-zinc-800" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg bg-zinc-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Hôtels</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{hotels?.length ?? 0} établissements</p>
        </div>
        <Link
          href="/admin/hotels/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </Link>
      </div>

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              {["Hôtel", "Adresse", "Catégorie", "Prix/nuit", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {hotels?.map((hotel: any) => (
              <tr key={hotel.id} className="group hover:bg-zinc-800/20 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{hotel.nom}</p>
                      {hotel.email && <p className="text-xs text-zinc-500">{hotel.email}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>{hotel.adresse}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className={cn(starBadge({ level: Number(hotel.categorie) as 1 | 2 | 3 | 4 | 5 }))}>
                    <Star className="w-3 h-3 fill-current" />
                    {hotel.categorie}
                  </div>
                </td>
                <td className="px-5 py-3 text-sm font-semibold text-zinc-200 tabular-nums">{hotel.prix_unitaire} TND</td>
                <td className="px-5 py-3 text-right">
                  <button
                    disabled={isDeleting}
                    onClick={() => deleteHotel(hotel.id)}
                    className="p-1.5 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}