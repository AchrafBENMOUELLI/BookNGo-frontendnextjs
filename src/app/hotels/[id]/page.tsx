"use client";

import { useParams, useRouter } from "next/navigation";
import { useHotel } from "@/hooks/useHotels";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Star, Mail, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function HotelDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: hotel, isLoading } = useHotel(Number(id));

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Hôtel introuvable.
      </div>
    );
  }

  const photos = hotel.photos ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux hôtels
      </Button>

      {/* Main photo */}
      <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden bg-gray-100 mb-4">
        {photos[0] ? (
          <Image
            src={photos[0]}
            alt={hotel.nom}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-orange-100">
            <span className="text-7xl">🏨</span>
          </div>
        )}
      </div>

      {/* Extra photos */}
      {photos.length > 1 && (
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {photos.slice(1).map((photo, i) => (
            <div
              key={i}
              className="relative h-20 w-32 shrink-0 rounded-lg overflow-hidden"
            >
              <Image
                src={photo}
                alt={`${hotel.nom} ${i + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{hotel.nom}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {hotel.adresse}
            </p>
            {hotel.email && (
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <Mail className="w-4 h-4" />
                {hotel.email}
              </p>
            )}
          </div>
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1 shrink-0">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {"⭐".repeat(Number(hotel.categorie))}
          </Badge>
        </div>

        {/* Formules */}
        {hotel.formules && hotel.formules.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-3">Formules disponibles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hotel.formules.map((f) => (
                <div key={f.id} className="border rounded-lg p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{f.formule}</p>
                    {f.promotion && f.promotion > 0 && (
                      <Badge className="bg-green-100 text-green-700">
                        -{f.promotion}%
                      </Badge>
                    )}
                  </div>
                  {f.type_chambre && (
                    <p className="text-sm text-muted-foreground">{f.type_chambre}</p>
                  )}
                  <div className="flex items-center gap-2">
                    {f.promotion && f.promotion > 0 ? (
                      <>
                        <p className="text-sm line-through text-muted-foreground">
                          {f.prix_formule} TND
                        </p>
                        <p className="text-primary font-bold">
                          {f.prix_avec_promotion} TND
                        </p>
                      </>
                    ) : (
                      <p className="text-primary font-bold">{f.prix_formule} TND</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing & Book */}
        <div className="border rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">À partir de</p>
            {hotel.prix_unitaire ? (
              <p className="text-3xl font-bold text-primary">
                {hotel.prix_unitaire}{" "}
                <span className="text-base font-normal text-muted-foreground">
                  TND / nuit
                </span>
              </p>
            ) : (
              <p className="text-muted-foreground">Prix sur demande</p>
            )}
          </div>
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
            onClick={() => router.push(`/hotels/${hotel.id}/reserve`)}
          >
            Réserver
          </Button>
        </div>
      </div>
    </div>
  );
}
