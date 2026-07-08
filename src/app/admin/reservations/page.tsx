"use client";

import {
  useAdminReservations,
  useAdminUpdateReservation,
  useAdminDeleteReservation,
} from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, CalendarDays, Building2 } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeEtat = cva(
  "inline-flex items-center text-xs font-medium px-2 py-1 rounded border",
  {
    variants: {
      etat: {
        en_attente: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        confirmee: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        annulee: "bg-red-500/10 text-red-400 border-red-500/20",
      },
    },
    defaultVariants: { etat: "en_attente" },
  }
);

const etatLabels: Record<string, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  annulee: "Annulée",
};

export default function AdminReservationsPage() {
  const { data: reservations, isLoading } = useAdminReservations();
  const { mutate: updateStatus } = useAdminUpdateReservation();
  const { mutate: deleteReservation, isPending: isDeleting } = useAdminDeleteReservation();

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
      <div>
        <h1 className="text-xl font-bold text-zinc-100">Réservations</h1>
        <p className="text-sm text-zinc-500 mt-0.5">{reservations?.length ?? 0} réservations</p>
      </div>

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              {["Client", "Hôtel", "Dates", "Montant", "Statut", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {reservations?.map((r: any) => (
              <tr key={r.id} className="group hover:bg-zinc-800/20 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-bold shrink-0">
                      {r.user?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{r.user?.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{r.user?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                    <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>{r.hotel?.nom}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                    <CalendarDays className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="tabular-nums">{new Date(r.date_arrivee).toLocaleDateString("fr-FR")}</span>
                    <span className="text-zinc-700">-</span>
                    <span className="tabular-nums">{new Date(r.date_depart).toLocaleDateString("fr-FR")}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm font-semibold text-zinc-200 tabular-nums">{r.prix} TND</td>
                <td className="px-5 py-3">
                  <Select value={r.etat} onValueChange={(val) => updateStatus({ id: r.id, etat: val })}>
                    <SelectTrigger className="w-[130px] h-7 rounded bg-zinc-800 border-zinc-700 text-xs">
                      <div className={cn(badgeEtat({ etat: r.etat }))}>{etatLabels[r.etat]}</div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="confirmee">Confirmée</SelectItem>
                      <SelectItem value="annulee">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    disabled={isDeleting}
                    onClick={() => deleteReservation(r.id)}
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