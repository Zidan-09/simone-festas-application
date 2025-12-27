"use client";
import { useThemes } from '@/app/hooks/themes/useThemes';
import { useSearch } from '@/app/hooks/search/useSearch';
import Image from 'next/image';
import SearchBar from "@/app/components/Search/SearchBar";
import ThemeSection from './components/ThemeSection';
import banner from "@/app/assets/images/theme-banner.png";
import config from "@/app/config-api.json";
import styles from './Themes.module.css';

export default function ThemesPage() {
  const { kids, adults, specialEvents, holidays } = useThemes();
  const { searching, results, search } = useSearch<any>(`${config.api_url}/theme/search`);

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
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      </section>

      {searching ? (
        <section className={styles.search}>
          {results.length > 0 ? (
            results.map((theme) => <div key={theme.id}>{theme.title}</div>)
          ) : (
            <div className={styles.searchWrapper}>
              <p className={styles.searchWarning}>Nenhum tema encontrado :(</p>
            </div>
          )}
        </section>
      ) : (
        <section className={styles.themes}>
          <ThemeSection title="👶🏻 Temas Infantis" themes={kids} />
          <ThemeSection title="👨🏻 Temas Adultos" themes={adults} />
          <ThemeSection title="🎓 Temas de Eventos Especiais" themes={specialEvents} />
          <ThemeSection title="🎄 Temas Festivos" themes={holidays} />
        </section>
      )}
    </main>
  );
}