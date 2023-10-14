export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="h-screen content-center">{children}</main>;
}
