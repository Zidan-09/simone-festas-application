"use client";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";
import styles from "./CreateUpdateTheme.module.css";

interface CreateUpdateThemeProps {
  onClose: () => void;
  refetch: () => void;
  initialData?: any;
}

export default function CreateUpdateTheme({ onClose, refetch, initialData }: CreateUpdateThemeProps) {
  const isEdit = !!initialData;

  const { showFeedback } = useFeedback();
}