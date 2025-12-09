import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";

export default function ThemesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}