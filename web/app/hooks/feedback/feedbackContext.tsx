"use client";

import { createContext, useContext, useState } from "react";

type FeedbackType = "success" | "error" | "info";

type FeedbackState = {
  message: string;
  type: FeedbackType;
  visible: boolean;
};

type FeedbackContextType = {
  feedback: FeedbackState;
  showFeedback: (message: string, type?: FeedbackType) => void;
  hideFeedback: () => void;
};

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [feedback, setFeedback] = useState<FeedbackState>({
    message: "",
    type: "info",
    visible: false,
  });

  function showFeedback(message: string, type: FeedbackType = "info") {
    setFeedback({ message, type, visible: true });

    setTimeout(() => {
      setFeedback((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }

  function hideFeedback() {
    setFeedback((prev) => ({ ...prev, visible: false }));
  }

  return (
    <FeedbackContext.Provider value={{ feedback, showFeedback, hideFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback deve ser usado dentro do FeedbackProvider");
  }
  return context;
}