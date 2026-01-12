import Image from "next/image";
import styles from "./ThemeSection.module.css";
import { Theme } from "@/app/hooks/themes/useThemes";

interface ThemeSectionProps {
  title: string,
  themes: Theme[]
};

export default function ThemeSection({ title, themes }: ThemeSectionProps) {
  if (!themes || themes.length === 0) return null;

  return (
    <section className={styles.themeSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.themeGrid}>
        {themes.map((theme) => (
          <div key={theme.id} className={styles.themeCard}>
            <div className={styles.imageWrapper}>
              <Image
                src={theme.mainImage}
                alt={theme.name}
                className={styles.themeImage}
                fill
              />
              <div className={styles.themeOverlay}>
                <p className={styles.themeLabel}>{theme.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};