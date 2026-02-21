import type { Metadata } from "next";
import "./globals.css";
import { FeedbackProvider } from "./hooks/feedback/feedbackContext";
import Feedback from "./components/Feedbacks/Feedback";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

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
          <Feedback />
            <Header />
            {children}
            <Footer />
        </FeedbackProvider>
      </body>
    </html>
  );
}
