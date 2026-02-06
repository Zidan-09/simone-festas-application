import styles from "./ThemeSection.module.css";
import { Theme } from "@/app/hooks/themes/useThemes";
import ThemeCard from "./ThemeCard";

interface ThemeSectionProps {
  title: string,
  themes: Theme[]
};

export default function ThemeSection({ title, themes }: ThemeSectionProps) {
  if (!themes || themes.length === 0) return null;

  return (
    <section className={styles.themeSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.themeContainer}>
        {themes.map((theme, idx) => (
          <ThemeCard
            id={theme.id}
            key={idx}
            name={theme.name}
            urlImage={theme.mainImage}
          />
        ))}
      </div>
    </section>
  );
};