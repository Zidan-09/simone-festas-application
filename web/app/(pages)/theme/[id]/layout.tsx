
export default function ThemeModalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      {children}
    </main>
  );
}