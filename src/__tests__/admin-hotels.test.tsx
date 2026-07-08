import { render, screen } from "@testing-library/react";
import AdminHotelsPage from "@/app/admin/hotels/page";
import "@testing-library/jest-dom";

const mockDelete = jest.fn();
const mockHotels = [
  { id: 1, nom: "Le Palace", adresse: "Tunis", email: "palace@test.tn", categorie: "5", prix_unitaire: 350 },
  { id: 2, nom: "Medina", adresse: "Sfax", email: null, categorie: "3", prix_unitaire: 150 },
];

let mockLoading = false;

jest.mock("@/hooks/useAdmin", () => ({
  useAdminHotels: () => ({ data: mockHotels, isLoading: mockLoading }),
  useAdminDeleteHotel: () => ({ mutate: mockDelete, isPending: false }),
}));

describe("AdminHotelsPage", () => {
  it("renders the page title and count", () => {
    render(<AdminHotelsPage />);
    expect(screen.getByText("Hôtels")).toBeInTheDocument();
    expect(screen.getByText("2 établissements")).toBeInTheDocument();
  });

  it("renders all hotels in the table", () => {
    render(<AdminHotelsPage />);
    expect(screen.getByText("Le Palace")).toBeInTheDocument();
    expect(screen.getByText("Medina")).toBeInTheDocument();
  });

  it("renders hotel details", () => {
    render(<AdminHotelsPage />);
    expect(screen.getByText("350 TND")).toBeInTheDocument();
    expect(screen.getByText("150 TND")).toBeInTheDocument();
    expect(screen.getByText("palace@test.tn")).toBeInTheDocument();
  });

  it("has a link to add new hotel", () => {
    render(<AdminHotelsPage />);
    expect(screen.getByText("Ajouter").closest("a")).toHaveAttribute("href", "/admin/hotels/new");
  });

  it("shows loading skeletons", () => {
    mockLoading = true;
    const { container } = render(<AdminHotelsPage />);
    const skeletons = container.querySelectorAll('[class*="bg-zinc-800"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});