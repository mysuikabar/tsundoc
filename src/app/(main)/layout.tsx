export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b px-6 py-4">
        <h1 className="text-lg font-bold">tsundoc</h1>
        {/* TODO: auth check + navigation */}
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
