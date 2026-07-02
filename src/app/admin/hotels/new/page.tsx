"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminCreateHotel } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

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
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvel Hôtel</h1>
          <p className="text-gray-400 text-sm">Ajouter un nouvel hôtel au catalogue</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-gray-700 font-medium">Nom de l'hôtel</Label>
            <Input
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              placeholder="Hôtel Le Palace"
              className="h-11 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-gray-700 font-medium">Adresse</Label>
            <Input
              value={form.adresse}
              onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              placeholder="Avenue Habib Bourguiba, Tunis"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-gray-700 font-medium">Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="contact@hotel.tn"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium">Catégorie</Label>
              <Select value={form.categorie} onValueChange={(val) => setForm({ ...form, categorie: val })}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <SelectItem key={s} value={String(s)}>{"⭐".repeat(s)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium">Prix / nuit (TND)</Label>
              <Input
                type="number"
                value={form.prix_unitaire}
                onChange={(e) => setForm({ ...form, prix_unitaire: e.target.value })}
                placeholder="200"
                className="h-11 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-gray-700 font-medium">URL Photo principale</Label>
            <Input
              value={form.photos}
              onChange={(e) => setForm({ ...form, photos: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="h-11 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium"
            disabled={isPending}
          >
            {isPending ? "Création en cours..." : "Créer l'hôtel"}
          </Button>
        </form>
      </div>
    </div>
  );
}
