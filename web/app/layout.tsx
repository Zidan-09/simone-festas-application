import type { Metadata } from "next";
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
          <Feedback />
          {children}
        </FeedbackProvider>
      </body>
    </html>
  );
}
