"use client";

import { useState } from "react";
import { useAdminUsers, useAdminCreateUser, useAdminDeleteUser } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, X, Shield, User } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const roleBadge = cva("inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border", {
  variants: {
    role: {
      admin: "bg-orange-50 text-orange-700 border-orange-200",
      user:  "bg-gray-100  text-gray-600   border-gray-200",
    },
  },
  defaultVariants: { role: "user" },
});

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();
  const { mutate: createUser, isPending: isCreating } = useAdminCreateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useAdminDeleteUser();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(form, {
      onSuccess: () => {
        setShowForm(false);
        setForm({ name: "", email: "", password: "", role: "user" });
      },
    });
  };

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
          <h1 className="text-2xl font-bold text-gray-800">Utilisateurs</h1>
          <p className="text-gray-400 text-sm mt-1">{users?.length ?? 0} utilisateurs au total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
            showForm
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
          )}
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Annuler" : "Ajouter"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Nouvel utilisateur</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium text-sm">Nom</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="h-10 rounded-xl" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium text-sm">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" className="h-10 rounded-xl" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium text-sm">Mot de passe</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="h-10 rounded-xl" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium text-sm">Rôle</Label>
              <Select value={form.role} onValueChange={(val) => setForm({ ...form, role: val })}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                disabled={isCreating}
                className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isCreating ? "Création..." : "Créer l'utilisateur"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Utilisateur", "Email", "Rôle", "Membre depuis", "Actions"].map((h) => (
                <th key={h} className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users?.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                <td className="px-6 py-4">
                  <div className={cn(roleBadge({ role: user.role }))}>
                    {user.role === "admin"
                      ? <><Shield className="w-3 h-3" /> Administrateur</>
                      : <><User className="w-3 h-3" /> Utilisateur</>
                    }
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(user.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4">
                  <button
                    disabled={isDeleting || user.role === "admin"}
                    onClick={() => deleteUser(user.id)}
                    className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
