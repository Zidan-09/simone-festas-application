"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Theme } from "@/app/hooks/themes/useThemes";
import Loading from "@/app/components/Loading/Loading";
import config from "@/app/config-api.json";
import styles from "./Theme.module.css";

export default function ThemeModal() {
  const [theme, setTheme] = useState<Theme>();
  const [others, setOthers] = useState<Theme[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams();

  useEffect(() => {
    async function getTheme() {
      setLoading(true);

      try {
        const res = await fetch(
          `${config.api_url}/theme/${params.id}`
        ).then(res => res.json());

        if (!res.success) throw new Error(res.message);

        setTheme(res.data);

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
          `${config.api_url}/theme/category/${theme.type}`
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
    <Loading />
  )

  return (
    <main className={styles.container}>
      {theme && others && (
        <>
          <div className={styles.themeCard}>
            
          </div>
        </>
      )}
    </main>
  )
}