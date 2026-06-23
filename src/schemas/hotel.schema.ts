import { z } from "zod";

export const formuleTarifSchema = z.object({
  id: z.number(),
  hotel_id: z.number(),
  formule: z.string(),
  type_chambre: z.string().nullable(),
  prix_chambre: z.number().nullable(),
  prix_formule: z.number(),
  promotion: z.number().nullable(),
  prix_avec_promotion: z.number().nullable(),
  periode_debut: z.string().nullable(),
  periode_fin: z.string().nullable(),
  duree_periode: z.number().nullable(),
});

export const hotelSchema = z.object({
  id: z.number(),
  nom: z.string(),
  categorie: z.string().nullable(),
  adresse: z.string(),
  email: z.string().nullable(),
  photos: z.array(z.string()).nullable(),
  prix_unitaire: z.number().nullable(),
  formules: z.array(formuleTarifSchema).optional(), // ← properly typed now
});

export const paginatedHotelsSchema = z.object({
  data: z.array(hotelSchema),
  current_page: z.number(),
  last_page: z.number(),
  per_page: z.number(),
  total: z.number(),
});

export type FormuleTarif = z.infer<typeof formuleTarifSchema>;
export type Hotel = z.infer<typeof hotelSchema>;
export type PaginatedHotels = z.infer<typeof paginatedHotelsSchema>;
