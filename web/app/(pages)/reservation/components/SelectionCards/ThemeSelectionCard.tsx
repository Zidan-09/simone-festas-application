import Image from "next/image";
import type { Theme } from "@/app/types";
import styles from "./ThemeSelectionCard.module.css";

interface ThemeSelectionCardProps {
  theme: Theme;
}

export default function ThemeSelectionCard({ theme }: ThemeSelectionCardProps) {
  return (
    <div className={styles.theme}>
      <div className={styles.themeImageWrapper}>
        <Image src={theme.mainImage} alt="theme" className={styles.themeImage} fill sizes="(max-width: 768px) 100vw, 300px" />
      </div>

      <div className={styles.info}>
        <span className={styles.themeName}>{theme.name}</span>
        <h3 className={styles.themeCategory}>{theme.category}</h3>
      </div>
    </div>
  )
}