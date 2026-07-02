import { z } from "zod";

export const reservationSchema = z.object({
  id: z.number().optional(),
  id_hotel: z.number(),
  id_user: z.number(),
  date_arrivee: z.string(),
  date_depart: z.string(),
  nombre_adultes: z.number(),
  nombre_enfants: z.number(),
  etat: z.string().optional(),
  formule: z.string().nullable().optional(),
  prix: z.number(),
  nbr_chambre: z.number(),
});

export const reservationFormSchema = z
  .object({
    date_arrivee:    z.string().min(1, "Date d'arrivée requise"),
    date_depart:     z.string().min(1, "Date de départ requise"),
    nombre_adultes:  z.number().min(1, "Au moins 1 adulte"),
    nombre_enfants:  z.number().min(0),
    formule:         z.string().optional(),
    nbr_chambre:     z.number().min(1, "Au moins 1 chambre"),
  })
  .refine((data) => new Date(data.date_depart) > new Date(data.date_arrivee), {
    message: "La date de départ doit être après la date d'arrivée",
    path: ["date_depart"],
  });

export type Reservation = z.infer<typeof reservationSchema>;
export type ReservationFormData = z.infer<typeof reservationFormSchema>;
