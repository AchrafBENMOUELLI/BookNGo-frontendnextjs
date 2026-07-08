import { Navbar } from "@/components/common/Navbar/Navbar";
import { Footer } from "@/components/common/Footer/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}