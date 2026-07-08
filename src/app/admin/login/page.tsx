"use client";

import { useState } from "react";
import { useAdminLogin } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Hexagon, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const { mutate: login, isPending, error } = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-indigo-500 flex items-center justify-center mx-auto mb-4">
            <Hexagon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg font-bold text-zinc-100">BookNGo</h1>
          <p className="text-sm text-zinc-500 mt-1">Administration</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-lg border border-zinc-800 p-5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-zinc-300">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="admin@bookngo.tn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm focus:border-indigo-500/50 focus:ring-indigo-500/20"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-zinc-300">Mot de passe</label>
            <div className="relative">
              <Input
                id="password"
                type={show ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm focus:border-indigo-500/50 focus:ring-indigo-500/20 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              Email ou mot de passe incorrect.
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-10 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}