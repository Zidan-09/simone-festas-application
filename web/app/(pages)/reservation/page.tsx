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
        <p className={styles.emptyText}>
          Você precisa estar logado para visualizar suas reservas.
        </p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Minhas Reservas</h1>
          <p className={styles.heroSubtitle}>
            Aqui estão todos os eventos que você já agendou conosco 💖
          </p>
        </div>

        <div className={styles.heroBackground}>
          <div className={styles.heroOverlay} />
        </div>
      </section>

      <section className={styles.reservationsSection}>
        {reservations.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Nenhuma reserva encontrada</h2>
            <p>
              Quando você fizer sua primeira reserva, ela aparecerá aqui ✨
            </p>
          </div>
        ) : (
          <div className={styles.reservationsGrid}>
            {reservations.map(reserve => (
              <div key={reserve.id} className={styles.reservationCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.reserveType}>
                    {reserve.reserveType}
                  </span>
                  <span className={styles.eventDate}>
                    {new Date(reserve.eventDate).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <p>
                    <strong>Total:</strong>{" "}
                    R$ {reserve.totalPrice.toFixed(2)}
                  </p>
                  <p>
                    <strong>Pago:</strong>{" "}
                    R$ {reserve.totalPaid.toFixed(2)}
                  </p>

                  {reserve.services?.length > 0 && (
                    <div className={styles.services}>
                      <strong>Serviços:</strong>
                      <ul>
                        {reserve.services.map(service => (
                          <li key={service.id}>
                            {service.name} — R$ {service.price.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
