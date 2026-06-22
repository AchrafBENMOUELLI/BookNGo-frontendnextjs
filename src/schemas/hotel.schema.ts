import { z } from "zod";

export const hotelSchema = z.object({
  id: z.number(),
  nom: z.string(),
  categorie: z.number().min(1).max(5),
  adresse: z.string(),
  email: z.string().nullable(),
  photos: z.array(z.string()).nullable(),
  prix_unitaire: z.number().nullable(),
  formules: z.array(z.any()).optional(),
});

export const paginatedHotelsSchema = z.object({
  data: z.array(hotelSchema),
  current_page: z.number(),
  last_page: z.number(),
  per_page: z.number(),
  total: z.number(),
});

export type Hotel = z.infer<typeof hotelSchema>;
export type PaginatedHotels = z.infer<typeof paginatedHotelsSchema>;
