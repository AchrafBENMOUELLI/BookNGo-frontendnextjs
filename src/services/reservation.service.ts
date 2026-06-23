import { api } from "@/lib/axios";
import { Reservation } from "@/schemas/reservation.schema";

export const reservationService = {
  create: async (data: Partial<Reservation>): Promise<Reservation> => {
    const res = await api.post("/reservations", data);
    return res.data.data;
  },

  getMyReservations: async (userId: number): Promise<Reservation[]> => {
    const res = await api.get(`/reservations?id_user=${userId}`);
    return res.data.data;
  },

  cancel: async (id: number): Promise<Reservation> => {
    const res = await api.patch(`/reservations/${id}`, { etat: "annulee" });
    return res.data.data;
  },
};
