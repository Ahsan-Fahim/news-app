import Navbar from "@/components/nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen content-center">
      <Navbar />
      {children}
    </main>
  );
}
