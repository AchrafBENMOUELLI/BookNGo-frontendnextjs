import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: "indigo" | "teal" | "emerald" | "red";
}

const box = cva(
  "rounded-lg bg-zinc-900 border border-zinc-800 p-4 transition-all hover:border-zinc-700",
  {
    variants: {
      color: {
        indigo: "",
        teal: "",
        emerald: "",
        red: "",
      },
    },
    defaultVariants: { color: "indigo" },
  }
);

const iconBox = cva("w-9 h-9 rounded-lg flex items-center justify-center", {
  variants: {
    color: {
      indigo: "bg-indigo-500/10 text-indigo-400",
      teal: "bg-teal-500/10 text-teal-400",
      emerald: "bg-emerald-500/10 text-emerald-400",
      red: "bg-red-500/10 text-red-400",
    },
  },
  defaultVariants: { color: "indigo" },
});

export function StatsCard({ title, value, icon, color = "indigo" }: StatsCardProps) {
  return (
    <div className={cn(box({ color }))}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs text-zinc-500">{title}</p>
          <p className="text-xl font-semibold text-zinc-100">{value}</p>
        </div>
        <div className={cn(iconBox({ color }))}>{icon}</div>
      </div>
    </div>
  );
}