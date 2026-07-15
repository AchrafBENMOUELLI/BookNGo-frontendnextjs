"use client";

import { useState } from "react";
import { useAdminFormules, useAdminCreateFormule, useAdminDeleteFormule } from "@/hooks/useAdmin";
import { useAdminHotels } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, X, Tag, Building2, Percent, CalendarDays, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminFormulesPage() {
  const { data: formules, isLoading } = useAdminFormules();
  const { data: hotels } = useAdminHotels();
  const { mutate: createFormule, isPending: isCreating } = useAdminCreateFormule();
  const { mutate: deleteFormule, isPending: isDeleting } = useAdminDeleteFormule();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    hotel_id: "",
    formule: "",
    type_chambre: "",
    prix_chambre: "",
    prix_formule: "",
    promotion: "0",
    periode_debut: "",
    periode_fin: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createFormule(
      {
        hotel_id: Number(form.hotel_id),
        formule: form.formule,
        type_chambre: form.type_chambre || null,
        prix_chambre: form.prix_chambre ? Number(form.prix_chambre) : null,
        prix_formule: Number(form.prix_formule),
        promotion: form.promotion ? Number(form.promotion) : 0,
        periode_debut: form.periode_debut || null,
        periode_fin: form.periode_fin || null,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setForm({ hotel_id: "", formule: "", type_chambre: "", prix_chambre: "", prix_formule: "", promotion: "0", periode_debut: "", periode_fin: "" });
        },
      }
    );
  };

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
          <h1 className="text-xl font-bold text-zinc-100">Formules tarifaires</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{formules?.length ?? 0} formules</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            showForm
              ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          )}
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Fermer" : "Ajouter"}
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
          <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-zinc-800">
            <div className="w-7 h-7 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <p className="text-sm font-medium text-zinc-200">Nouvelle formule</p>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-zinc-300">Hôtel</Label>
              <Select value={form.hotel_id} onValueChange={(val) => setForm({ ...form, hotel_id: val })}>
                <SelectTrigger className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 text-sm">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-zinc-900 border-zinc-700">
                  {hotels?.map((h: any) => (
                    <SelectItem key={h.id} value={String(h.id)} className="text-zinc-200 focus:bg-zinc-800 focus:text-zinc-100">{h.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-zinc-300">Formule</Label>
              <Input
                value={form.formule}
                onChange={(e) => setForm({ ...form, formule: e.target.value })}
                placeholder="Demi Pension"
                className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-zinc-300">Type chambre</Label>
              <Input
                value={form.type_chambre}
                onChange={(e) => setForm({ ...form, type_chambre: e.target.value })}
                placeholder="Suite"
                className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-zinc-300">Prix chambre</Label>
              <Input
                type="number"
                value={form.prix_chambre}
                onChange={(e) => setForm({ ...form, prix_chambre: e.target.value })}
                placeholder="200 TND"
                className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-zinc-300">Prix formule</Label>
              <Input
                type="number"
                value={form.prix_formule}
                onChange={(e) => setForm({ ...form, prix_formule: e.target.value })}
                placeholder="150 TND"
                className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-zinc-300">Promotion %</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.promotion}
                onChange={(e) => setForm({ ...form, promotion: e.target.value })}
                placeholder="10"
                className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-zinc-300">Période début</Label>
              <Input
                type="date"
                value={form.periode_debut}
                onChange={(e) => setForm({ ...form, periode_debut: e.target.value })}
                className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-zinc-300">Période fin</Label>
              <Input
                type="date"
                value={form.periode_fin}
                onChange={(e) => setForm({ ...form, periode_fin: e.target.value })}
                className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 text-sm"
              />
            </div>
            <div className="col-span-2 pt-1">
              <button
                type="submit"
                disabled={isCreating}
                className="w-full h-9 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCreating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Création...</> : "Créer la formule"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              {["Hôtel", "Formule", "Type chambre", "Prix", "Promotion", "Période", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {formules?.map((f: any) => (
              <tr key={f.id} className="group hover:bg-zinc-800/20 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="text-sm text-zinc-200">{f.hotel?.nom ?? "—"}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm font-medium text-zinc-200">{f.formule}</td>
                <td className="px-5 py-3 text-sm text-zinc-400">{f.type_chambre ?? "—"}</td>
                <td className="px-5 py-3">
                  {f.promotion > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm line-through text-zinc-500">{f.prix_formule}</span>
                      <span className="text-sm font-semibold text-emerald-400">{f.prix_avec_promotion}</span>
                      <span className="text-xs text-zinc-500">TND</span>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-zinc-200">{f.prix_formule} TND</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {f.promotion > 0 ? (
                    <div className="flex items-center gap-1 text-xs text-emerald-400">
                      <Percent className="w-3 h-3" />
                      {f.promotion}%
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-600">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-3 h-3 shrink-0" />
                    {f.periode_debut ? new Date(f.periode_debut).toLocaleDateString("fr-FR") : "—"}
                    <span className="text-zinc-700">→</span>
                    {f.periode_fin ? new Date(f.periode_fin).toLocaleDateString("fr-FR") : "—"}
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    disabled={isDeleting}
                    onClick={() => deleteFormule(f.id)}
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
