import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useAdminStore } from "@/stores/admin.store";
import { LoginFormData, RegisterFormData } from "@/schemas/auth.schema";

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (res) => {
      useAdminStore.getState().clearAuth();
      setAuth(res.user, res.token);
      router.push("/");
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: (res) => {
      useAdminStore.getState().clearAuth();
      setAuth(res.user, res.token);
      router.push("/");
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      useAdminStore.getState().clearAuth();
      clearAuth();
      router.push("/login");
    },
  });
}
