"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Theme } from "@/app/hooks/themes/useThemes";
import Image from "next/image";
import Loading from "@/app/components/Loading/Loading";
import ThemeSection from "../../themes/components/ThemeSection";
import config from "@/app/config-api.json";
import styles from "./Theme.module.css";

export default function ThemeModal() {
  const [theme, setTheme] = useState<Theme>();
  const [others, setOthers] = useState<Theme[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<string>();
  const allImages = theme ? [theme.mainImage, ...theme.images.map(img => img.url)] : [];

  const params = useParams();

  useEffect(() => {
    async function getTheme() {
      setLoading(true);

      try {
        const res = await fetch(
          `${config.api_url}/theme/${params.id}`
        ).then(res => res.json());

        if (!res.success) throw new Error(res.message);

        const theme: Theme = res.data;

        setTheme(theme);
        setActiveImage(theme.mainImage);

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    }

    getTheme();

  }, [params.id]);

  useEffect(() => {
    async function getOthers() {
      if (!theme) return;

      setLoading(true);

      try {
        const res = await fetch(
          `${config.api_url}/theme/category/${theme.category}`
        ).then(res => res.json());

        if (!res.success) throw new Error(res.message);

        setOthers(res.data);

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    }

    getOthers();

  }, [theme]);

  if (loading) return (
    <div className={styles.loadingContainer}>
      <Loading />
    </div>
  )

  return (
    <main className={styles.container}>
      {theme && others && (
        <>
          <div className={styles.themeCard}>
            <div className={styles.themeContainer}>
              <div className={styles.nameContainer}>
                <h2 className={styles.name}>{theme.name}</h2>

                <h3 className={styles.category}>{theme.category}</h3>
              </div>

              <div className={styles.imageContainer}>
                <Image
                  src={activeImage ?? theme.mainImage}
                  alt="primary-image"
                  width={1980}
                  height={1980}
                  className={styles.themeImage}
                />

                <div className={styles.secundaryImagesContainer}>
                  {allImages.filter(img => img !== activeImage).map((img, idx) => {
                    return (
                      <div
                        key={idx}
                        className={styles.secondaryImageWrapper}
                      >
                        <Image
                          src={img}
                          alt="secondary-image"
                          className={styles.secondaryImage}
                          onClick={() => {
                            setActiveImage(img);
                          }}
                          fill
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <hr className={styles.divisor} />

            <ThemeSection
              title="Mais temas da mesma categoria"
              themes={others.filter(t => t.id !== params.id)}
            />
          </div>
        </>
      )}
    </main>
  )
}