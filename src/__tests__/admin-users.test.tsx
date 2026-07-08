import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminUsersPage from "@/app/admin/users/page";
import "@testing-library/jest-dom";

const mockCreate = jest.fn();
const mockDelete = jest.fn();

const mockUsers = [
  { id: 1, name: "Alice", email: "alice@test.tn", role: "admin", created_at: "2026-01-15" },
  { id: 2, name: "Bob", email: "bob@test.tn", role: "user", created_at: "2026-03-20" },
];

jest.mock("@/hooks/useAdmin", () => ({
  useAdminUsers: () => ({ data: mockUsers, isLoading: false }),
  useAdminCreateUser: () => ({ mutate: mockCreate, isPending: false }),
  useAdminDeleteUser: () => ({ mutate: mockDelete, isPending: false }),
}));

describe("AdminUsersPage", () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockCreate.mockImplementation((_data, { onSuccess } = {}) => onSuccess?.());
  });

  it("renders the page title and count", () => {
    render(<AdminUsersPage />);
    expect(screen.getByText("Utilisateurs")).toBeInTheDocument();
    expect(screen.getByText("2 comptes")).toBeInTheDocument();
  });

  it("renders all users", () => {
    render(<AdminUsersPage />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("alice@test.tn")).toBeInTheDocument();
    expect(screen.getByText("bob@test.tn")).toBeInTheDocument();
  });

  it("shows create user form when toggled", () => {
    render(<AdminUsersPage />);
    fireEvent.click(screen.getByText("Ajouter"));
    expect(screen.getByText("Nouvel utilisateur")).toBeInTheDocument();
    expect(screen.getByText("Créer l'utilisateur")).toBeInTheDocument();
  });

  it("submits new user", async () => {
    render(<AdminUsersPage />);
    fireEvent.click(screen.getByText("Ajouter"));
    fireEvent.change(screen.getByPlaceholderText("John Doe"), { target: { value: "Charlie" } });
    fireEvent.change(screen.getByPlaceholderText("john@exemple.com"), { target: { value: "charlie@test.tn" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "pass123" } });
    fireEvent.click(screen.getByText("Créer l'utilisateur"));
    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Charlie", email: "charlie@test.tn", password: "pass123" }),
        expect.any(Object)
      )
    );
  });

  it("shows loading skeletons", () => {
    jest.mock("@/hooks/useAdmin", () => ({
      useAdminUsers: () => ({ data: null, isLoading: true }),
      useAdminCreateUser: () => ({ mutate: mockCreate, isPending: false }),
      useAdminDeleteUser: () => ({ mutate: mockDelete, isPending: false }),
    }));
    const { container } = render(<AdminUsersPage />);
    const skeletons = container.querySelectorAll('[class*="bg-zinc-800"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});