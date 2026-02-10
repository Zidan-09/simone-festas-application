"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useLoadReservations } from "@/app/hooks/events/useLoadReservations";
import Loading from "@/app/components/Loading/Loading";
import config from "@/app/config-api.json";
import styles from "./Reservation.module.css";

export default function ReservationsPage() {
  const { reservations, loading } = useLoadReservations(true);
  const [logged, setLogged] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkLogin() {
      const res = await fetch(`${config.api_url}/auth/check`).then(res => res.json());
      setLogged(res.success);
    }
    checkLogin();
  }, []);

  if (logged === null || loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  if (!logged) {
    return (
      <main className={styles.container}>
        
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Suas Reservas</h2>
          <p className={styles.heroSubtitle}>Reserve a festa do seu jeito!</p>
        </div>

        <div className={styles.heroCarousel}>
          <div className={styles.heroOverlay}></div>
          <Image
            src={""}
            alt="Themes banner"
            fill
            priority
            className={styles.heroImage}
          />
        </div>
      </section>
    </main>
  );
}
