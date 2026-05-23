import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
     
      {/* Main content */}
      <main className="flex-1 bg-background text-foreground">{children}</main>
    </div>
  );
}
