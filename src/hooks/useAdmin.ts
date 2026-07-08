import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { useAdminStore } from "@/stores/admin.store";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

export function useAdminLogin() {
  const { setAuth } = useAdminStore();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      adminService.login(email, password),
    onSuccess: (res) => {
      if (res.user.role !== "admin") throw new Error("Not an admin");
      useAuthStore.getState().clearAuth();
      setAuth(res.user, res.token);
      router.push("/admin");
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.getStats(),
  });
}

export function useAdminHotels() {
  return useQuery({
    queryKey: ["admin-hotels"],
    queryFn: () => adminService.getHotels(),
  });
}

export function useAdminCreateHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminService.createHotel(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-hotels"] }),
  });
}

export function useAdminUpdateHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      adminService.updateHotel(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-hotels"] }),
  });
}

export function useAdminDeleteHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteHotel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-hotels"] }),
  });
}

export function useAdminReservations() {
  return useQuery({
    queryKey: ["admin-reservations"],
    queryFn: () => adminService.getReservations(),
  });
}

export function useAdminUpdateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, etat }: { id: number; etat: string }) =>
      adminService.updateReservationStatus(id, etat),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reservations"] }),
  });
}

export function useAdminDeleteReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteReservation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reservations"] }),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminService.getUsers(),
  });
}

export function useAdminCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminService.createUser(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useAdminDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}
