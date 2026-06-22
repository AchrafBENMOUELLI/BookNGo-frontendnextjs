import { api } from "@/lib/axios";
import { LoginFormData, RegisterFormData } from "@/schemas/auth.schema";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const res = await api.post("/login", data);
    return res.data;
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const res = await api.post("/register", data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/logout");
  },

  getMe: async (): Promise<AuthUser> => {
    const res = await api.get("/me");
    return res.data;
  },
};
