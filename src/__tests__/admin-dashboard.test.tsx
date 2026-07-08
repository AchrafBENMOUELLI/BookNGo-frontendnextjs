import { render, screen } from "@testing-library/react";
import AdminDashboard from "@/app/admin/page";
import "@testing-library/jest-dom";

const mockStats = {
  total_hotels: 10,
  total_reservations: 50,
  total_users: 100,
  revenue_total: 25000,
  reservations_en_attente: 15,
  reservations_confirmees: 30,
  reservations_annulees: 5,
  recent_reservations: [
    {
      id: 1,
      etat: "confirmee",
      prix: 350,
      date_arrivee: "2026-07-10",
      date_depart: "2026-07-15",
      hotel: { nom: "Le Palace" },
      user: { name: "Alice" },
    },
  ],
};

let mockLoading = false;

jest.mock("@/hooks/useAdmin", () => ({
  useAdminStats: () => ({ data: mockStats, isLoading: mockLoading }),
}));

describe("AdminDashboard", () => {
  it("renders stats cards", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("25000 TND")).toBeInTheDocument();
  });

  it("renders reservation status sections", () => {
    render(<AdminDashboard />);
    expect(screen.getAllByText("En attente").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Confirmée")).toBeInTheDocument();
    expect(screen.getAllByText("Annulées").length).toBeGreaterThanOrEqual(1);
  });

  it("renders recent reservations", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Réservations récentes")).toBeInTheDocument();
    expect(screen.getByText("Le Palace")).toBeInTheDocument();
  });

  it("renders chart section headings", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Répartition des réservations")).toBeInTheDocument();
    const overviewElements = screen.getAllByText("Vue d'ensemble");
    expect(overviewElements.length).toBe(2);
  });

  it("shows loading skeletons", () => {
    mockLoading = true;
    const { container } = render(<AdminDashboard />);
    const skeletons = container.querySelectorAll(".bg-zinc-800");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});