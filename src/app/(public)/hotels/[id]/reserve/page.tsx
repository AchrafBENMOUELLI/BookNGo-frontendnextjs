"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useHotel } from "@/hooks/useHotels";
import { useCreateReservation } from "@/hooks/useReservation";
import { useAuthStore } from "@/stores/auth.store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationFormSchema, ReservationFormData } from "@/schemas/reservation.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CalendarDays, Users, BedDouble } from "lucide-react";

export default function ReservePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: hotel, isLoading } = useHotel(Number(id));
  const { mutate: createReservation, isPending, error } = useCreateReservation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      nombre_adultes: 1,
      nombre_enfants: 0,
      nbr_chambre: 1,
    },
  });

  const dateArrivee = watch("date_arrivee");
  const dateDepart = watch("date_depart");
  const nbrChambre = watch("nbr_chambre") || 1;

  const nights =
    dateArrivee && dateDepart
      ? Math.max(
          0,
          Math.ceil(
            (new Date(dateDepart).getTime() - new Date(dateArrivee).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const [selectedFormuleId, setSelectedFormuleId] = useState("none");

  const selectedFormule = hotel?.formules?.find((f: any) => f.id === Number(selectedFormuleId));

  const formulePrice = selectedFormule
    ? (selectedFormule.promotion > 0 ? selectedFormule.prix_avec_promotion : selectedFormule.prix_formule) * nights
    : 0;

  const basePrice = hotel?.prix_unitaire ?? 0;
  const totalPrice = basePrice * nights * nbrChambre + formulePrice;

  const onSubmit = (data: ReservationFormData) => {
    if (!user || !hotel) return;

    createReservation(
      {
        id_user: user.id,
        id_hotel: hotel.id,
        date_arrivee: data.date_arrivee,
        date_depart: data.date_depart,
        nombre_adultes: data.nombre_adultes,
        nombre_enfants: data.nombre_enfants,
        formule: selectedFormule ? selectedFormule.formule : null,
        nbr_chambre: data.nbr_chambre,
        prix: totalPrice,
        etat: "en_attente",
      },
      {
        onSuccess: () => router.push("/my-reservations"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!hotel) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Button>

      <h1 className="text-2xl font-bold mb-2">Réserver — {hotel.nom}</h1>
      <p className="text-muted-foreground mb-8">{hotel.adresse}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Dates du séjour
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Date d'arrivée</Label>
              <Input type="date" min={today} {...register("date_arrivee")} />
              {errors.date_arrivee && (
                <p className="text-sm text-red-500">{errors.date_arrivee.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Date de départ</Label>
              <Input
                type="date"
                min={dateArrivee || today}
                {...register("date_depart")}
              />
              {errors.date_depart && (
                <p className="text-sm text-red-500">{errors.date_depart.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Guests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4" />
              Voyageurs
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Adultes</Label>
              <Input
                type="number"
                min={1}
                {...register("nombre_adultes", { valueAsNumber: true })}
              />
              {errors.nombre_adultes && (
                <p className="text-sm text-red-500">{errors.nombre_adultes.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Enfants</Label>
              <Input
                type="number"
                min={0}
                {...register("nombre_enfants", { valueAsNumber: true })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Room & Formula */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BedDouble className="w-4 h-4" />
              Chambres & Formule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Nombre de chambres</Label>
              <Input
                type="number"
                min={1}
                {...register("nbr_chambre", { valueAsNumber: true })}
              />
              {errors.nbr_chambre && (
                <p className="text-sm text-red-500">{errors.nbr_chambre.message}</p>
              )}
            </div>

            {hotel.formules && hotel.formules.length > 0 && (
              <div className="space-y-1">
                <Label>Formule</Label>
                <Select value={selectedFormuleId} onValueChange={(val) => setSelectedFormuleId(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une formule" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-white border-zinc-200">
                    <SelectItem value="none" className="text-zinc-600 focus:bg-zinc-100">Sans formule</SelectItem>
                    {hotel.formules.map((f: any) => (
                      <SelectItem key={f.id} value={String(f.id)} className="text-zinc-700 focus:bg-zinc-100">
                        {f.formule} —{" "}
                        {f.promotion > 0
                          ? f.prix_avec_promotion
                          : f.prix_formule}{" "}
                        TND / nuit
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {basePrice} TND × {nights} nuit(s) × {nbrChambre} chambre(s)
              </span>
              <span>{basePrice * nights * nbrChambre} TND</span>
            </div>
            {selectedFormule && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Formule {selectedFormule.formule} × {nights} nuit(s)
                </span>
                <span>{formulePrice} TND</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{totalPrice} TND</span>
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-red-500 text-center">
            Ces dates ne sont pas disponibles pour cet hôtel.
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          size="lg"
          disabled={isPending || nights === 0}
        >
          {isPending ? "Réservation en cours..." : `Confirmer — ${totalPrice} TND`}
        </Button>
      </form>
    </div>
  );
}
