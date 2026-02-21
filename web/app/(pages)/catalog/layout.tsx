
export default function CatalogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      {children}
    </main>
  )
}