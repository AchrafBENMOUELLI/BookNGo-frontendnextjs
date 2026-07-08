import { render, screen, fireEvent } from "@testing-library/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminStore } from "@/stores/admin.store";
import "@testing-library/jest-dom";

const mockPush = jest.fn();
const mockClearAuth = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/admin",
  useRouter: () => ({ push: mockPush }),
}));

const mockAdmin = { id: 1, name: "Admin", email: "admin@test.tn", role: "admin" };

beforeEach(() => {
  mockPush.mockClear();
  mockClearAuth.mockClear();
  useAdminStore.setState({ admin: mockAdmin, token: "tok", isAuthenticated: true, clearAuth: mockClearAuth });
});

describe("AdminSidebar", () => {
  it("renders all navigation links", () => {
    render(<AdminSidebar />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Hôtels")).toBeInTheDocument();
    expect(screen.getByText("Réservations")).toBeInTheDocument();
    expect(screen.getByText("Utilisateurs")).toBeInTheDocument();
  });

  it("shows admin name and email", () => {
    render(<AdminSidebar />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("admin@test.tn")).toBeInTheDocument();
  });

  it("calls clearAuth and redirects on logout", () => {
    render(<AdminSidebar />);
    fireEvent.click(screen.getByText("Déconnexion"));
    expect(mockClearAuth).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/admin/login");
  });
});