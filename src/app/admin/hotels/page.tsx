"use client";

import { useAdminHotels, useAdminDeleteHotel } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Plus, Star } from "lucide-react";
import Link from "next/link";

export default function AdminHotelsPage() {
  const { data: hotels, isLoading } = useAdminHotels();
  const { mutate: deleteHotel, isPending: isDeleting } = useAdminDeleteHotel();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hôtels</h1>
          <p className="text-gray-400 text-sm mt-1">{hotels?.length ?? 0} hôtels au total</p>
        </div>
        <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl gap-2">
          <Link href="/admin/hotels/new">
            <Plus className="w-4 h-4" />
            Ajouter un hôtel
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Nom</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Adresse</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Catégorie</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Prix/nuit</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {hotels?.map((hotel: any) => (
              <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-800">{hotel.nom}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{hotel.adresse}</td>
                <td className="px-6 py-4">
                  <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1 font-medium">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {hotel.categorie} étoiles
                  </Badge>
                </td>
                <td className="px-6 py-4 font-bold text-gray-800">{hotel.prix_unitaire} TND</td>
                <td className="px-6 py-4">
                  <button
                    disabled={isDeleting}
                    onClick={() => deleteHotel(hotel.id)}
                    className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
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
