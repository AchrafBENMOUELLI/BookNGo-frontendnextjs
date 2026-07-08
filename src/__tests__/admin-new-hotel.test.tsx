import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminNewHotelPage from "@/app/admin/hotels/new/page";
import "@testing-library/jest-dom";

const mockCreate = jest.fn();
const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock("@/hooks/useAdmin", () => ({
  useAdminCreateHotel: () => ({ mutate: mockCreate, isPending: false }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: mockBack, push: mockPush }),
}));

describe("AdminNewHotelPage", () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockCreate.mockImplementation((_data, { onSuccess }) => onSuccess && onSuccess());
  });

  it("renders the form", () => {
    render(<AdminNewHotelPage />);
    expect(screen.getByText("Nouvel hôtel")).toBeInTheDocument();
    expect(screen.getByText("Créer l'hôtel")).toBeInTheDocument();
  });

  it("submits the form with correct data", async () => {
    render(<AdminNewHotelPage />);
    fireEvent.change(screen.getByPlaceholderText("Hôtel Le Palace"), { target: { value: "Test Hotel" } });
    fireEvent.change(screen.getByPlaceholderText("200 TND"), { target: { value: "300" } });
    fireEvent.click(screen.getByText("Créer l'hôtel"));
    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ nom: "Test Hotel", prix_unitaire: 300 }),
        expect.any(Object)
      )
    );
  });

  it("calls router.back on back button click", () => {
    render(<AdminNewHotelPage />);
    fireEvent.click(screen.getByRole("button", { name: "" }));
    expect(mockBack).toHaveBeenCalled();
  });
});