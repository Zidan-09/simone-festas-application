"use client";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";
import styles from "./Feedback.module.css";

export default function Feedback() {
  const { feedback } = useFeedback();

  if (!feedback.visible) return null;

  return (
    <div className={`${styles.feedback} ${styles[feedback.type]}`}>
      <p className={styles.message}>{feedback.message}</p>
      <p></p>
    </div>
  )
}