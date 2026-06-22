"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const linkVariants = cva(
  "text-sm font-medium transition-colors duration-200",
  {
    variants: {
      active: {
        true: "text-primary border-b-2 border-primary pb-0.5",
        false: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: { active: false },
  }
);

const links = [
  { label: "Home", href: "/" },
  { label: "Hotels", href: "/hotels" },
  { label: "Destinations", href: "/destinations" },
  { label: "Deals", href: "/deals" },
];

export function NavbarLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(linkVariants({ active: pathname === link.href }))}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
