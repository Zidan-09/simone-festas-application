import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simone Festas",
  description: "Um site pra Simone não endoidar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
