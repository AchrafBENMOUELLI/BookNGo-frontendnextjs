import { useAdminStore } from "@/stores/admin.store";
import { act } from "@testing-library/react";

const mockAdmin = { id: 1, name: "Admin", email: "admin@test.tn", role: "admin" };

beforeEach(() => {
  useAdminStore.setState({ admin: null, token: null, isAuthenticated: false });
  localStorage.clear();
  document.cookie = "";
});

describe("useAdminStore", () => {
  it("starts with no auth", () => {
    const state = useAdminStore.getState();
    expect(state.admin).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("setAuth stores admin and token", () => {
    act(() => useAdminStore.getState().setAuth(mockAdmin, "token-123"));

    const state = useAdminStore.getState();
    expect(state.admin).toEqual(mockAdmin);
    expect(state.token).toBe("token-123");
    expect(state.isAuthenticated).toBe(true);
    expect(localStorage.getItem("admin_token")).toBe("token-123");
  });

  it("clearAuth removes everything", () => {
    act(() => useAdminStore.getState().setAuth(mockAdmin, "token-123"));
    act(() => useAdminStore.getState().clearAuth());

    const state = useAdminStore.getState();
    expect(state.admin).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem("admin_token")).toBeNull();
  });
});