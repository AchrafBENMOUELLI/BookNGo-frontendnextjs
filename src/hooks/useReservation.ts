import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reservationService } from "@/services/reservation.service";
import { Reservation } from "@/schemas/reservation.schema";
import { useAuthStore } from "@/stores/auth.store";

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Reservation>) => reservationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
    },
  });
}

export function useMyReservations() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["my-reservations", user?.id],
    queryFn: () => reservationService.getMyReservations(user!.id),
    enabled: !!user,
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reservationService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
    },
  });
}
