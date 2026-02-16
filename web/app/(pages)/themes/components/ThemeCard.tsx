import { useRouter } from "next/navigation";
import Image from "next/image";
import ThemeTag from "@/app/components/ThemeTag/ThemeTag";
import { ThemeCategory } from "@/app/lib/utils/theme/themeCategory";
import styles from "./ThemeCard.module.css";

interface ThemeCardProps {
  id: string;
  name: string;
  urlImage: string;
  category: ThemeCategory;
};

export default function ThemeCard({ id, name, urlImage, category }: ThemeCardProps) {
  const router = useRouter();

  return (
    <div
      className={styles.themeCard}
      onClick={() => {
        router.push(`/theme/${id}`);
      }}  
    >
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

        <div className={styles.tagWrapper}>
          <ThemeTag category={category} />
        </div>
      </div>
    </div>
  )
};