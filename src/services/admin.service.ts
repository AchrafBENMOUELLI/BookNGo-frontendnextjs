import { adminApi } from "@/lib/axios-admin";

export const adminService = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await adminApi.post("/login", { email, password });
    return res.data;
  },

  // Stats
  getStats: async () => {
    const res = await adminApi.get("/admin/stats");
    return res.data;
  },

  // Hotels
  getHotels: async () => {
    const res = await adminApi.get("/hotels");
    return res.data.data;
  },

  createHotel: async (data: any) => {
    const res = await adminApi.post("/admin/hotels", data);
    return res.data;
  },

  updateHotel: async (id: number, data: any) => {
    const res = await adminApi.put(`/admin/hotels/${id}`, data);
    return res.data;
  },

  deleteHotel: async (id: number) => {
    const res = await adminApi.delete(`/admin/hotels/${id}`);
    return res.data;
  },

  // Reservations
  getReservations: async () => {
    const res = await adminApi.get("/admin/reservations");
    return res.data.data;
  },

  updateReservationStatus: async (id: number, etat: string) => {
    const res = await adminApi.patch(`/admin/reservations/${id}`, { etat });
    return res.data;
  },

  deleteReservation: async (id: number) => {
    const res = await adminApi.delete(`/admin/reservations/${id}`);
    return res.data;
  },

  // Users
  getUsers: async () => {
    const res = await adminApi.get("/admin/users");
    return res.data.data;
  },

  createUser: async (data: any) => {
    const res = await adminApi.post("/admin/users", data);
    return res.data;
  },

  deleteUser: async (id: number) => {
    const res = await adminApi.delete(`/admin/users/${id}`);
    return res.data;
  },

  // Formules
  getFormules: async () => {
    const res = await adminApi.get("/formules-tarifs");
    return res.data.data;
  },

  createFormule: async (data: any) => {
    const res = await adminApi.post("/formules-tarifs", data);
    return res.data;
  },

  deleteFormule: async (id: number) => {
    const res = await adminApi.delete(`/formules-tarifs/${id}`);
    return res.data;
  },
};
