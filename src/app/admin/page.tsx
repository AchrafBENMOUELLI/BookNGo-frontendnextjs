"use client";

import { useAdminStats } from "@/hooks/useAdmin";
import { StatsCard } from "@/components/admin/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Hotel, CalendarCheck, Users, DollarSign,
  Clock, CheckCircle, XCircle,
  PieChart, BarChart3,
} from "lucide-react";
import {
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
  BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const statBox = cva("rounded-lg border bg-zinc-900 p-4 flex items-center gap-3", {
  variants: {
    color: { amber: "border-zinc-800", emerald: "border-zinc-800", red: "border-zinc-800" },
  },
  defaultVariants: { color: "amber" },
});

const statIcon = cva("w-9 h-9 rounded-lg flex items-center justify-center", {
  variants: {
    color: { amber: "bg-amber-500/10 text-amber-400", emerald: "bg-emerald-500/10 text-emerald-400", red: "bg-red-500/10 text-red-400" },
  },
  defaultVariants: { color: "amber" },
});

const statValue = cva("text-lg font-semibold", {
  variants: {
    color: { amber: "text-amber-400", emerald: "text-emerald-400", red: "text-red-400" },
  },
  defaultVariants: { color: "amber" },
});

const badgeEtat = cva("inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded border", {
  variants: {
    etat: {
      en_attente: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      confirmee: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      annulee: "bg-red-500/10 text-red-400 border-red-500/20",
    },
  },
  defaultVariants: { etat: "en_attente" },
});

const etatLabels: Record<string, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  annulee: "Annulée",
};

const COLORS = ["#f59e0b", "#10b981", "#ef4444"];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-44 bg-zinc-800" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg bg-zinc-800" />)}
        </div>
      </div>
    );
  }

  const pieData = [
    { name: "En attente", value: stats?.reservations_en_attente ?? 0 },
    { name: "Confirmées", value: stats?.reservations_confirmees ?? 0 },
    { name: "Annulées", value: stats?.reservations_annulees ?? 0 },
  ];

  const barData = [
    { name: "Hôtels", value: stats?.total_hotels ?? 0, fill: "#6366f1" },
    { name: "Réservations", value: stats?.total_reservations ?? 0, fill: "#14b8a6" },
    { name: "Utilisateurs", value: stats?.total_users ?? 0, fill: "#10b981" },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Vue d'ensemble</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Hôtels" value={stats?.total_hotels ?? 0} icon={<Hotel className="w-4 h-4" />} color="indigo" />
        <StatsCard title="Réservations" value={stats?.total_reservations ?? 0} icon={<CalendarCheck className="w-4 h-4" />} color="teal" />
        <StatsCard title="Utilisateurs" value={stats?.total_users ?? 0} icon={<Users className="w-4 h-4" />} color="emerald" />
        <StatsCard title="Revenu" value={`${stats?.revenue_total ?? 0} TND`} icon={<DollarSign className="w-4 h-4" />} color="red" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "En attente", value: stats?.reservations_en_attente ?? 0, color: "amber" as const, icon: Clock },
          { label: "Confirmées", value: stats?.reservations_confirmees ?? 0, color: "emerald" as const, icon: CheckCircle },
          { label: "Annulées", value: stats?.reservations_annulees ?? 0, color: "red" as const, icon: XCircle },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={cn(statBox({ color: item.color }))}>
              <div className={cn(statIcon({ color: item.color }))}><Icon className="w-4 h-4" /></div>
              <div>
                <p className="text-xs text-zinc-500">{item.label}</p>
                <p className={cn(statValue({ color: item.color }))}>{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-medium text-zinc-200">Répartition des réservations</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RePieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "13px" }}
                itemStyle={{ color: "#e4e4e7" }}
              />
            </RePieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-zinc-400">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[idx] }} />
                {item.name}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-medium text-zinc-200">Vue d'ensemble</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <ReBarChart data={barData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "13px" }}
                itemStyle={{ color: "#e4e4e7" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-200">Réservations récentes</h2>
          <span className="text-xs text-zinc-500">5 dernières</span>
        </div>
        <div className="divide-y divide-zinc-800">
          {!stats?.recent_reservations?.length && (
            <p className="text-center text-zinc-500 py-10 text-sm">Aucune réservation récente.</p>
          )}
          {stats?.recent_reservations?.map((r: any) => (
            <div key={r.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-bold shrink-0">
                  {r.hotel?.nom?.[0] ?? "H"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{r.hotel?.nom}</p>
                  <p className="text-xs text-zinc-500 truncate">
                    {r.user?.name}
                    <span className="mx-1.5 text-zinc-700">→</span>
                    {new Date(r.date_arrivee).toLocaleDateString("fr-FR")}
                    <span className="mx-1 text-zinc-700">-</span>
                    {new Date(r.date_depart).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className={cn(badgeEtat({ etat: r.etat ?? "en_attente" }))}>
                  {etatLabels[r.etat ?? "en_attente"]}
                </div>
                <span className="text-sm font-semibold text-zinc-200 tabular-nums w-20 text-right">{r.prix} TND</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}