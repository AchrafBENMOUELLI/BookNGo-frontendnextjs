import { render, screen } from "@testing-library/react";
import { StatsCard } from "@/components/admin/StatsCard";
import { Hotel } from "lucide-react";
import "@testing-library/jest-dom";

describe("StatsCard", () => {
  it("renders title and value", () => {
    render(<StatsCard title="Hôtels" value={42} icon={<Hotel className="w-4 h-4" />} />);
    expect(screen.getByText("Hôtels")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders string values", () => {
    render(<StatsCard title="Revenu" value="1 200 TND" icon={<Hotel className="w-4 h-4" />} />);
    expect(screen.getByText("Revenu")).toBeInTheDocument();
    expect(screen.getByText("1 200 TND")).toBeInTheDocument();
  });

  it("renders with teal color variant", () => {
    const { container } = render(
      <StatsCard title="Test" value={0} icon={<Hotel className="w-4 h-4" />} color="teal" />
    );
    expect(container.querySelector(".bg-teal-500\\/10")).toBeTruthy();
  });
});