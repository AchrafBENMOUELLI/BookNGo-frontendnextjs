"use client";

import { useAdminStats } from "@/hooks/useAdmin";
import { StatsCard } from "@/components/admin/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Hotel, CalendarCheck, Users, DollarSign } from "lucide-react";

const etatConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  en_attente: { label: "En attente", variant: "secondary" },
  confirmee:  { label: "Confirmée",  variant: "default"   },
  annulee:    { label: "Annulée",    variant: "destructive"},
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Vue d'ensemble de BookNGo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Total Hôtels"    value={stats?.total_hotels ?? 0}        icon={<Hotel className="w-5 h-5" />}         color="blue"   />
        <StatsCard title="Réservations"    value={stats?.total_reservations ?? 0}   icon={<CalendarCheck className="w-5 h-5" />} color="orange" />
        <StatsCard title="Utilisateurs"    value={stats?.total_users ?? 0}          icon={<Users className="w-5 h-5" />}         color="green"  />
        <StatsCard title="Revenu Total"    value={`${stats?.revenue_total ?? 0} TND`} icon={<DollarSign className="w-5 h-5" />} color="red"    />
      </div>

      {/* Reservation Status */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "En attente",  value: stats?.reservations_en_attente ?? 0, color: "text-yellow-500", bg: "bg-yellow-50 border-yellow-100" },
          { label: "Confirmées",  value: stats?.reservations_confirmees  ?? 0, color: "text-green-500",  bg: "bg-green-50 border-green-100"   },
          { label: "Annulées",    value: stats?.reservations_annulees    ?? 0, color: "text-red-500",    bg: "bg-red-50 border-red-100"       },
        ].map((item) => (
          <div key={item.label} className={`rounded-2xl border p-6 text-center shadow-sm ${item.bg}`}>
            <p className={`text-4xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Réservations récentes</h2>
          <span className="text-xs text-gray-400">5 dernières</span>
        </div>
        <div className="divide-y divide-gray-50">
          {!stats?.recent_reservations?.length && (
            <p className="text-center text-gray-400 py-10 text-sm">
              Aucune réservation pour le moment.
            </p>
          )}
          {stats?.recent_reservations?.map((r: any) => {
            const etat = etatConfig[r.etat ?? "en_attente"];
            return (
              <div key={r.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <p className="font-medium text-sm text-gray-800">{r.hotel?.nom ?? "Hôtel"}</p>
                  <p className="text-xs text-gray-400">
                    {r.user?.name} · {new Date(r.date_arrivee).toLocaleDateString("fr-FR")} → {new Date(r.date_depart).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={etat.variant}>{etat.label}</Badge>
                  <p className="font-bold text-sm text-gray-800 min-w-[80px] text-right">{r.prix} TND</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
