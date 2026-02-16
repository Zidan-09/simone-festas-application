"use client";
import { ThemeCategory } from "@/app/types";
import styles from "./ThemeTag.module.css";

const TagColors: Record<ThemeCategory, string> = {
  "ADULTS": "adult",
  "HOLIDAYS": "holiday",
  "KIDS": "kids",
  "SPECIAL_EVENTS": "se"
}

interface ThemeTagProps {
  category: ThemeCategory;
}

export default function ThemeTag({ category }: ThemeTagProps) {
  return (
    <div className={`${styles.tag} ${styles[TagColors[category]]}`}>
      <span className={styles.name}>{category}</span>
    </div>
  );
}