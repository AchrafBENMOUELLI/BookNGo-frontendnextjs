"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminCreateHotel } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";

export default function AdminNewHotelPage() {
  const router = useRouter();
  const { mutate: createHotel, isPending } = useAdminCreateHotel();

  const [form, setForm] = useState({
    nom: "", adresse: "", email: "", categorie: "3", prix_unitaire: "", photos: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHotel(
      { ...form, prix_unitaire: Number(form.prix_unitaire), photos: form.photos ? [form.photos] : null },
      { onSuccess: () => router.push("/admin/hotels") }
    );
  };

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-zinc-400" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Nouvel hôtel</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Ajouter un établissement</p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
        <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-zinc-800">
          <div className="w-7 h-7 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <p className="text-sm font-medium text-zinc-200">Informations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-zinc-300">Nom</Label>
            <Input
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              placeholder="Hôtel Le Palace"
              className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm focus:border-indigo-500/50 focus:ring-indigo-500/20"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-zinc-300">Adresse</Label>
            <Input
              value={form.adresse}
              onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              placeholder="Avenue Habib Bourguiba, Tunis"
              className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm focus:border-indigo-500/50 focus:ring-indigo-500/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-zinc-300">Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="contact@hotel.tn"
              className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm focus:border-indigo-500/50 focus:ring-indigo-500/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-zinc-300">Catégorie</Label>
              <Select value={form.categorie} onValueChange={(val) => setForm({ ...form, categorie: val })}>
                <SelectTrigger className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-zinc-900 border-zinc-700">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <SelectItem key={s} value={String(s)} className="text-zinc-200 focus:bg-zinc-800 focus:text-zinc-100">{"⭐".repeat(s)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-zinc-300">Prix / nuit</Label>
              <Input
                type="number"
                value={form.prix_unitaire}
                onChange={(e) => setForm({ ...form, prix_unitaire: e.target.value })}
                placeholder="200 TND"
                className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm focus:border-indigo-500/50 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-zinc-300">Photo</Label>
            <Input
              value={form.photos}
              onChange={(e) => setForm({ ...form, photos: e.target.value })}
              placeholder="https://..."
              className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm focus:border-indigo-500/50 focus:ring-indigo-500/20"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-9 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isPending}
            >
              {isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Création...</> : "Créer l'hôtel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}