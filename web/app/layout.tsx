import type { Metadata } from "next";
import { FeedbackProvider } from "./hooks/feedback/feedbackContext";
import Feedback from "./components/Feedbacks/Feedback";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://simonefestas.vercel.app"),
  title: "Simone Festas",
  description: "Decorações modernas, kits personalizados e tudo para tornar sua celebração inesquecível.",
  keywords: ["simone", "simone festas", "simone festas e personalizados", "simone parnaiba"],
  robots: "index, follow",
  openGraph: {
    title: "Simone Festas - Website",
    description: "Transformamos sua festa com kits personalizados e decorações modernas.",
    url: "https://simonefestas.vercel.app/home",
    siteName: "Simone Festas",
    images: [
      {
        url: "./assets/icons/banner.png",
        width: 1200,
        height: 630,
        alt: "Logo Simone Festas"
      }
    ],
    locale: "pt_BR",
    type: "website"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <FeedbackProvider>
          <Feedback />
            <Header />
            {children}
            <Footer />
        </FeedbackProvider>
      </body>
    </html>
  );
}
