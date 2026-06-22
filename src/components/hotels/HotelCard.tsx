import { Hotel } from "@/schemas/hotel.schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const firstPhoto = hotel.photos?.[0] ?? null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {firstPhoto ? (
          <Image
            src={firstPhoto}
            alt={hotel.nom}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-orange-100">
            <span className="text-4xl">🏨</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-yellow-600 gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {hotel.categorie}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-base leading-tight line-clamp-1">
            {hotel.nom}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {hotel.adresse}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          {hotel.prix_unitaire ? (
            <div>
              <span className="text-lg font-bold text-primary">
                {hotel.prix_unitaire} TND
              </span>
              <span className="text-xs text-muted-foreground"> / night</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Prix sur demande</span>
          )}
          <Button size="sm" asChild>
            <Link href={`/hotels/${hotel.id}`}>Voir</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
