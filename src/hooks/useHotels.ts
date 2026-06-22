import { useQuery } from "@tanstack/react-query";
import { hotelService, HotelFilters } from "@/services/hotel.service";

export function useHotels(filters: HotelFilters = {}) {
  return useQuery({
    queryKey: ["hotels", filters],
    queryFn: () => hotelService.getAll(filters),
    placeholderData: (prev) => prev,
  });
}

export function useHotel(id: number) {
  return useQuery({
    queryKey: ["hotel", id],
    queryFn: () => hotelService.getById(id),
    enabled: !!id,
  });
}
