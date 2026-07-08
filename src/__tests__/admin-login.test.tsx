import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminLoginPage from "@/app/admin/login/page";
import "@testing-library/jest-dom";

const mockMutate = jest.fn();
let mockError: Error | null = null;
let mockPending = false;

jest.mock("@/hooks/useAdmin", () => ({
  useAdminLogin: () => ({ mutate: mockMutate, isPending: mockPending, error: mockError }),
}));

describe("AdminLoginPage", () => {
  beforeEach(() => {
    mockMutate.mockClear();
    mockError = null;
    mockPending = false;
  });

  it("renders the login form", () => {
    render(<AdminLoginPage />);
    expect(screen.getByText("BookNGo")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByText("Se connecter")).toBeInTheDocument();
  });

  it("calls login mutation on submit", async () => {
    render(<AdminLoginPage />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@test.tn" } });
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "password" } });
    fireEvent.click(screen.getByText("Se connecter"));
    await waitFor(() => expect(mockMutate).toHaveBeenCalledWith({ email: "admin@test.tn", password: "password" }));
  });

  it("shows error message when login fails", () => {
    mockError = new Error("fail");
    render(<AdminLoginPage />);
    expect(screen.getByText("Email ou mot de passe incorrect.")).toBeInTheDocument();
  });

  it("shows loading state while pending", () => {
    mockPending = true;
    render(<AdminLoginPage />);
    expect(screen.getByText("Connexion...")).toBeDisabled();
  });
});