"use client";
import Image from 'next/image';
import SearchBar from "@/app/components/Search/SearchBar";
import ThemeSection from './components/ThemeSection';
import styles from './Themes.module.css';
import { useThemes } from '@/app/hooks/themes/useThemes';

export default function ThemesPage() {
  const { kids, adults, specialEvents, holidays } = useThemes();

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Explore nossos Temas</h1>
          <SearchBar page="themes" />
        </div>

        <div className={styles.heroCarousel}>
          <div className={styles.heroOverlay}></div>
          <Image
            src="/images/banner-temas.jpg"
            alt="Themes banner"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      </section>

      <ThemeSection title="👶🏻 Temas Infantis" themes={kids} />
      <ThemeSection title="👨🏻 Temas Adultos" themes={adults} />
      <ThemeSection title="🎓 Temas de Eventos Especiais" themes={specialEvents} />
      <ThemeSection title="🎄 Temas Festivos" themes={holidays} />
    </main>
  );
}