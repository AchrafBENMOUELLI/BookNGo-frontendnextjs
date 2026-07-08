"use client";

import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Star, Shield } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-orange-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          {isAuthenticated && (
            <p className="text-orange-300 font-medium mb-3 text-sm tracking-wide uppercase">
              Welcome back, {user?.name} 👋
            </p>
          )}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Find your perfect stay <br />
            <span className="text-orange-400">across Tunisia</span>
          </h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto mb-10">
            From the medinas of Tunis to the beaches of Djerba — book with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/hotels">Browse Hotels</Link>
            </Button>
            {!isAuthenticated && (
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link href="/register">Create Account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <MapPin className="w-8 h-8 text-orange-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Top Destinations</h3>
            <p className="text-muted-foreground text-sm">Tunis, Sousse, Djerba, Hammamet and more.</p>
          </div>
          <div className="p-6">
            <Star className="w-8 h-8 text-orange-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Verified Reviews</h3>
            <p className="text-muted-foreground text-sm">Real reviews from real guests across Tunisia.</p>
          </div>
          <div className="p-6">
            <Shield className="w-8 h-8 text-orange-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Secure Booking</h3>
            <p className="text-muted-foreground text-sm">Your reservation is protected every step of the way.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
