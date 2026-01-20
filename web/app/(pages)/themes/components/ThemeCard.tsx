import Image from "next/image";
import styles from "./ThemeCard.module.css";

interface ThemeCardProps {
  id: string;
  name: string;
  urlImage: string;
};

export default function ThemeCard({ id, name, urlImage }: ThemeCardProps) {
  return (
    <div key={id} className={styles.themeCard}>
      <div className={styles.imageWrapper}>
        <Image
          src={urlImage}
          alt={name}
          className={styles.themeImage}
          fill
        />
        <div className={styles.themeOverlay}>
          <p className={styles.themeLabel}>{name}</p>
        </div>
      </div>
    </div>
  )
};