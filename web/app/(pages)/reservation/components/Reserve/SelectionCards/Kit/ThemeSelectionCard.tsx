import Image from "next/image";
import type { Theme } from "@/app/types";
import ThemeTag from "@/app/components/ThemeTag/ThemeTag";
import styles from "./ThemeSelectionCard.module.css";

interface ThemeSelectionCardProps {
  theme: Theme;
  selected: string;
}

export default function ThemeSelectionCard({ theme, selected }: ThemeSelectionCardProps) {
  return (
    <div className={`${styles.themeCard} ${theme.id === selected ? styles.selected : ""}`}>
      <div className={styles.imageWrapper}>
        <Image
          src={theme.mainImage}
          alt="theme"
          className={styles.themeImage}
          fill 
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>

      <div className={styles.info}>
        <span className={styles.themeName}>{theme.name}</span>
      </div>

      <div className={styles.tagWrapper}>
        <ThemeTag category={theme.category} />
      </div>
    </div>
  )
}