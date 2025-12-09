
export default function ItensLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  )
}