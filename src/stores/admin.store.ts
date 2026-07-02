import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AdminState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (admin: AdminUser, token: string) => void;
  clearAuth: () => void;
}

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      setAuth: (admin, token) => {
        localStorage.setItem("admin_token", token);
        setCookie("admin_token", token);
        set({ admin, token, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem("admin_token");
        deleteCookie("admin_token");
        set({ admin: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "admin-storage",
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
