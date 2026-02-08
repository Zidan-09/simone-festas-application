import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";

export default function ThemeModalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}