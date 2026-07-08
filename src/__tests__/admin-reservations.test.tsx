import { render, screen } from "@testing-library/react";
import AdminReservationsPage from "@/app/admin/reservations/page";
import "@testing-library/jest-dom";

const mockUpdate = jest.fn();
const mockDelete = jest.fn();

const mockReservations = [
  {
    id: 1,
    etat: "confirmee",
    prix: 350,
    date_arrivee: "2026-07-10",
    date_depart: "2026-07-15",
    hotel: { nom: "Le Palace" },
    user: { name: "Alice", email: "alice@test.tn" },
  },
  {
    id: 2,
    etat: "en_attente",
    prix: 200,
    date_arrivee: "2026-08-01",
    date_depart: "2026-08-05",
    hotel: { nom: "Medina" },
    user: { name: "Bob", email: "bob@test.tn" },
  },
];

jest.mock("@/hooks/useAdmin", () => ({
  useAdminReservations: () => ({ data: mockReservations, isLoading: false }),
  useAdminUpdateReservation: () => ({ mutate: mockUpdate }),
  useAdminDeleteReservation: () => ({ mutate: mockDelete, isPending: false }),
}));

describe("AdminReservationsPage", () => {
  it("renders the page title and count", () => {
    render(<AdminReservationsPage />);
    expect(screen.getByText("Réservations")).toBeInTheDocument();
    expect(screen.getByText("2 réservations")).toBeInTheDocument();
  });

  it("renders all reservations", () => {
    render(<AdminReservationsPage />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Le Palace")).toBeInTheDocument();
    expect(screen.getByText("Medina")).toBeInTheDocument();
  });

  it("shows loading skeletons", () => {
    jest.mock("@/hooks/useAdmin", () => ({
      useAdminReservations: () => ({ data: null, isLoading: true }),
      useAdminUpdateReservation: () => ({ mutate: mockUpdate }),
      useAdminDeleteReservation: () => ({ mutate: mockDelete, isPending: false }),
    }));
    const { container } = render(<AdminReservationsPage />);
    expect(container.querySelector(".bg-zinc-800")).toBeInTheDocument();
  });
});