"use client";

import { useMyReservations, useCancelReservation } from "@/hooks/useReservation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, BedDouble, Users, MapPin } from "lucide-react";
import Link from "next/link";

const etatConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  en_attente: { label: "En attente", variant: "secondary" },
  confirmee: { label: "Confirmée", variant: "default" },
  annulee: { label: "Annulée", variant: "destructive" },
};

export default function MyReservationsPage() {
  const { data: reservations, isLoading } = useMyReservations();
  const { mutate: cancel, isPending: isCancelling } = useCancelReservation();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Mes Réservations</h1>
        <p className="text-muted-foreground">
          {reservations?.length ?? 0} réservation(s) trouvée(s)
        </p>
      </div>

      {!reservations || reservations.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-muted-foreground text-lg">Aucune réservation pour le moment.</p>
          <Button asChild>
            <Link href="/hotels">Parcourir les hôtels</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => {
            const etat = etatConfig[reservation.etat ?? "en_attente"];
            const nights = Math.ceil(
              (new Date(reservation.date_depart).getTime() -
                new Date(reservation.date_arrivee).getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <Card key={reservation.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Left info */}
                    <div className="space-y-3 flex-1">
                      {/* Hotel name */}
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-lg">
                          {(reservation as any).hotel?.nom ?? "Hôtel"}
                        </h2>
                        <Badge variant={etat.variant}>{etat.label}</Badge>
                      </div>

                      {/* Address */}
                      {(reservation as any).hotel?.adresse && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {(reservation as any).hotel.adresse}
                        </p>
                      )}

                      {/* Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CalendarDays className="w-4 h-4 shrink-0" />
                          <span>
                            {new Date(reservation.date_arrivee).toLocaleDateString("fr-FR")}
                            {" → "}
                            {new Date(reservation.date_depart).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BedDouble className="w-4 h-4 shrink-0" />
                          <span>{reservation.nbr_chambre} chambre(s) · {nights} nuit(s)</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4 shrink-0" />
                          <span>
                            {reservation.nombre_adultes} adulte(s)
                            {reservation.nombre_enfants > 0 && `, ${reservation.nombre_enfants} enfant(s)`}
                          </span>
                        </div>
                      </div>

                      {/* Formule */}
                      {reservation.formule && reservation.formule !== "none" && (
                        <p className="text-sm text-muted-foreground">
                          Formule: <span className="font-medium text-foreground">{reservation.formule}</span>
                        </p>
                      )}
                    </div>

                    {/* Right — price + action */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <p className="text-2xl font-bold text-primary">
                        {reservation.prix} TND
                      </p>
                      {reservation.etat !== "annulee" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          disabled={isCancelling}
                          onClick={() => cancel(reservation.id!)}
                        >
                          Annuler
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
