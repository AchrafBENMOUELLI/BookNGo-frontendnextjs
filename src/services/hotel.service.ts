import { api } from "@/lib/axios";
import { PaginatedHotels, Hotel } from "@/schemas/hotel.schema";

export interface HotelFilters {
  search?: string;
  categorie?: number | string;
  page?: number;
  per_page?: number;
}

export const hotelService = {
 getAll: async (filters: HotelFilters = {}): Promise<PaginatedHotels> => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.categorie) params.append("categorie", String(filters.categorie));
    if (filters.page) params.append("page", String(filters.page));
    params.append("per_page", String(filters.per_page ?? 9));

    const res = await api.get(`/hotels?${params.toString()}`);

    return {
      data: res.data.data,
      current_page: res.data.meta.current_page,
      last_page: res.data.meta.last_page,
      per_page: res.data.meta.per_page,
      total: res.data.meta.total,
    };
  },

  getById: async (id: number): Promise<Hotel> => {
    const res = await api.get(`/hotels/${id}`);
    return res.data.data;
  },
};
