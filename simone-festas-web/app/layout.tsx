import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const myFont = localFont({
  src: [
    {
      path: "../public/fonts/Fredoka-VariableFont_wdth,wght.ttf",
      weight: "400",
      style: "normal",
    }
  ],
  variable: "--my-font",
});

export const metadata: Metadata = {
  title: "Simone Festas",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={myFont.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
