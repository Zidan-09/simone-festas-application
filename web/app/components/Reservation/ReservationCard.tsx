"use client";
import type { EventStatus, ReserveType, EventFormated } from "@/app/types";
import { formatPrice } from "@/app/utils";
import styles from "./ReservationCard.module.css";

interface ReservationCardProps {
  event: EventFormated;
}

export default function ReservationCard({ event }: ReservationCardProps) {
  const { id, reserveType, eventDate, status, totalPrice, totalPaid } = event;

  const friendlyReserveType: Record<ReserveType, string> = {
    "ITEMS": "Itens",
    "KIT": "Kit Temático",
    "TABLE": "Mesa Posta"
  };

  const friendlyEventStatus: Record<EventStatus, { label: string, color: string }> = {
    "CANCELED": { label: "Cancelado", color: "red" },
    "COMPLETED": { label: "Completado", color: "blue" },
    "CONFIRMED": { label: "Confirmada", color: "green" },
    "IN_PROGRESS": { label: "Acontecendo", color: "lime" },
    "PENDING": { label: "Aguardando Confirmação", color: "orange" },
    "POSTPONED": { label: "Adiado", color: "yellow" }
  }

  const friendlyMonths: Record<number, string> = {
    0: "Janeiro",
    1: "Fevereiro",
    2: "Março",
    3: "Abril",
    4: "Maio",
    5: "Junho",
    6: "Julho",
    7: "Agosto",
    8: "Setembro",
    9: "Outubro",
    10: "Novembro",
    11: "Dezembro",
  }

  function formatDate(isoDate: string): string {
    const date = new Date(isoDate);

    return `${date.getDate()}/${friendlyMonths[date.getMonth()]}/${date.getFullYear()}`;
  }

  return (
    <>
      <div className={styles.card} key={id}>
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>{friendlyReserveType[reserveType]}</h2>
          <div className={`${styles.statusCard} ${styles[friendlyEventStatus[status].color]}`}>
            <p className={styles.status}>{friendlyEventStatus[status].label}</p>
          </div>
        </div>

        <p className={styles.label}>📅 Data: <span>{formatDate(eventDate)}</span></p>
        <p className={styles.label}>💰 Valor: <span>{formatPrice(totalPrice)}</span> ({formatPrice(totalPaid)} pagos)</p>
    
        <button className={styles.button}>Mais Detalhes</button>
      </div>
    </>
  );
}