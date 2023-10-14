export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen content-center">
      <div>{children}</div>
    </main>
  );
}
