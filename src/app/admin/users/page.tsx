"use client";

import { useState } from "react";
import { useAdminUsers, useAdminCreateUser, useAdminDeleteUser } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, X, Shield, User, Mail, CalendarDays, Loader2 } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const roleBadge = cva(
  "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded border",
  {
    variants: {
      role: {
        admin: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        user: "bg-zinc-800 text-zinc-400 border-zinc-700",
      },
    },
    defaultVariants: { role: "user" },
  }
);

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
          <h1 className="text-xl font-bold text-zinc-100">Utilisateurs</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{users?.length ?? 0} comptes</p>
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
              <User className="w-3.5 h-3.5" />
            </div>
            <p className="text-sm font-medium text-zinc-200">Nouvel utilisateur</p>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-zinc-300">Nom</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-zinc-300">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@exemple.com"
                className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-zinc-300">Mot de passe</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-zinc-300">Rôle</Label>
              <Select value={form.role} onValueChange={(val) => setForm({ ...form, role: val })}>
                <SelectTrigger className="h-9 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 pt-1">
              <button
                type="submit"
                disabled={isCreating}
                className="w-full h-9 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCreating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Création...</> : "Créer l'utilisateur"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              {["Utilisateur", "Email", "Rôle", "Inscription", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users?.map((user: any) => (
              <tr key={user.id} className="group hover:bg-zinc-800/20 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                        user.role === "admin" ? "bg-indigo-500/10 text-indigo-400" : "bg-zinc-800 text-zinc-400"
                      )}
                    >
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <p className="text-sm font-medium text-zinc-200">{user.name}</p>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                    <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    {user.email}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className={cn(roleBadge({ role: user.role }))}>
                    {user.role === "admin" ? (
                      <><Shield className="w-3 h-3" /> Admin</>
                    ) : (
                      <><User className="w-3 h-3" /> Utilisateur</>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                    {new Date(user.created_at).toLocaleDateString("fr-FR")}
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    disabled={isDeleting || user.role === "admin"}
                    onClick={() => deleteUser(user.id)}
                    className="p-1.5 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
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