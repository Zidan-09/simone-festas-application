"use client";
import { useThemes } from '@/app/hooks/themes/useThemes';
import { useSearch } from '@/app/hooks/search/useSearch';
import Image from 'next/image';
import SearchBar from "@/app/components/Search/SearchBar";
import ThemeSection from './components/ThemeSection';
import banner from "@/app/assets/images/theme-banner.png";
import Loading from '@/app/components/Loading/Loading';
import config from "@/app/config-api.json";
import { Theme } from '@/app/hooks/themes/useThemes';
import styles from './Themes.module.css';

export default function ThemesPage() {
  const { kids, adults, specialEvents, holidays } = useThemes();
  const { searching, results, search } = useSearch<Theme>(`${config.api_url}/theme/search`);
  const loading =
  kids.length === 0 &&
  adults.length === 0 &&
  specialEvents.length === 0 &&
  holidays.length === 0;

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Explore nossos Temas</h1>
          <SearchBar onSearch={search} />
        </div>

        <div className={styles.heroCarousel}>
          <div className={styles.heroOverlay}></div>
          <Image
            src={banner}
            alt="Themes banner"
            fill
            priority
            className={styles.heroImage}
          />
        </div>
      </section>

      {searching ? (
        <section className={styles.search}>
          {results.length > 0 ? (
            results.map((theme) => (
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
            ))
          ) : (
            <Loading />
          )}
        </section>
      ) : (
        <section className={styles.themes}>
          {loading ? (
            <Loading />
          ) : (
            <div>
              <ThemeSection title="👶🏻 Temas Infantis" themes={kids} />
              <ThemeSection title="👨🏻 Temas Adultos" themes={adults} />
              <ThemeSection title="🎓 Temas de Eventos Especiais" themes={specialEvents} />
              <ThemeSection title="🎄 Temas Festivos" themes={holidays} />
            </div>
          )}
        </section>
      )}
    </main>
  );
}