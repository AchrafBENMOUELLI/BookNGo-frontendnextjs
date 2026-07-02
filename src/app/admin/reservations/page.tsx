"use client";

import {
  useAdminReservations,
  useAdminUpdateReservation,
  useAdminDeleteReservation,
} from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const etatBadge = cva("text-xs font-semibold px-2.5 py-1 rounded-full border", {
  variants: {
    etat: {
      en_attente: "bg-yellow-50 text-yellow-700 border-yellow-200",
      confirmee:  "bg-green-50  text-green-700  border-green-200",
      annulee:    "bg-red-50    text-red-700    border-red-200",
    },
  },
  defaultVariants: { etat: "en_attente" },
});

const etatLabels: Record<string, string> = {
  en_attente: "En attente",
  confirmee:  "Confirmée",
  annulee:    "Annulée",
};

export default function AdminReservationsPage() {
  const { data: reservations, isLoading } = useAdminReservations();
  const { mutate: updateStatus } = useAdminUpdateReservation();
  const { mutate: deleteReservation, isPending: isDeleting } = useAdminDeleteReservation();

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
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Réservations</h1>
        <p className="text-gray-400 text-sm mt-1">{reservations?.length ?? 0} réservations au total</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Client", "Hôtel", "Dates", "Prix", "Statut", "Actions"].map((h) => (
                <th key={h} className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reservations?.map((r: any) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-800">{r.user?.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.user?.email}</p>
                </td>
                <td className="px-6 py-4 font-medium text-gray-700">{r.hotel?.nom}</td>
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {new Date(r.date_arrivee).toLocaleDateString("fr-FR")}
                  <span className="mx-1 text-gray-300">→</span>
                  {new Date(r.date_depart).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4 font-bold text-gray-800">{r.prix} TND</td>
                <td className="px-6 py-4">
                  <Select
                    value={r.etat}
                    onValueChange={(val) => updateStatus({ id: r.id, etat: val })}
                  >
                    <SelectTrigger className="w-36 h-8 rounded-lg border-gray-200 text-xs">
                      <div className={cn(etatBadge({ etat: r.etat }))}>
                        {etatLabels[r.etat]}
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="confirmee">Confirmée</SelectItem>
                      <SelectItem value="annulee">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-6 py-4">
                  <button
                    disabled={isDeleting}
                    onClick={() => deleteReservation(r.id)}
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
