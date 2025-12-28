import type { Metadata } from "next";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./globals.css";
import { FeedbackProvider } from "./hooks/feedback/feedbackContext";
import Feedback from "./components/Feedbacks/Feedback";

export const metadata: Metadata = {
  title: "Simone Festas"
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
          <Header />
          <Feedback />
          {children}
          <Footer />
        </FeedbackProvider>
      </body>
    </html>
  );
}
