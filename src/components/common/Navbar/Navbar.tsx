import Link from "next/link";
import { NavbarLinks } from "./NavbarLinks";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary tracking-tight">
              Tunisie<span className="text-orange-500">Booking</span>
            </span>
          </Link>

          {/* Nav Links */}
          <NavbarLinks />

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
