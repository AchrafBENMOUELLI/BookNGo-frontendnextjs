import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: "blue" | "orange" | "green" | "red";
}

const iconVariants = cva("p-3 rounded-xl", {
  variants: {
    color: {
      blue:   "bg-blue-100 text-blue-600",
      orange: "bg-orange-100 text-orange-600",
      green:  "bg-green-100 text-green-600",
      red:    "bg-red-100 text-red-600",
    },
  },
  defaultVariants: { color: "blue" },
});

const valueVariants = cva("text-2xl font-bold mt-0.5", {
  variants: {
    color: {
      blue:   "text-blue-600",
      orange: "text-orange-600",
      green:  "text-green-600",
      red:    "text-red-600",
    },
  },
  defaultVariants: { color: "blue" },
});

export function StatsCard({ title, value, icon, color = "blue" }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={cn(iconVariants({ color }))}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className={cn(valueVariants({ color }))}>{value}</p>
      </div>
    </div>
  );
}
