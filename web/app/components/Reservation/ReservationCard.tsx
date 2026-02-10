import { Address, ReserveType } from "@/app/lib/utils/requests/event.request";
import type { ItemFormated, Service, Kit, Table, EventStatus } from "@/app/types";
import styles from "./ReservationCard.module.css";

interface ReservationCardProps {
  id: string;
  type: ReserveType;
  eventDate: string;
  address: Address;
  status: EventStatus;
  bookingDate: string;
  totalPrice: number;
  paidPrice: number;
  services: Service[];
  details: ItemFormated[] | Kit | Table;
}

export default function ReservationCard({ id, type, eventDate, address, status, bookingDate, totalPrice, paidPrice, services, details }: ReservationCardProps) {
  const friendlyReserveType: Record<ReserveType, string> = {
    "ITEMS": "Aluguel de Itens",
    "KIT": "Kit Temático",
    "TABLE": "Mesa Posta"
  };

  const friendlyEventStatus: Record<EventStatus, { label: string, color: string }> = {
    "CANCELED": { label: "Cancelado", color: "red" },
    "COMPLETED": { label: "Completado", color: "blue" },
    "CONFIRMED": { label: "Confirmado", color: "green" },
    "IN_PROGRESS": { label: "Acontecendo", color: "lime" },
    "PENDING": { label: "Esperando", color: "orange" },
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

    return `${date.getDate()} de ${friendlyMonths[date.getMonth()]} de ${date.getFullYear()}`;
  }

  const isFullyPaid = paidPrice >= totalPrice;

  return (
    <>
      <div className={styles.card} key={id}>
        <div className={styles.initialData}>
          <h2 className={styles.reserveType}>{friendlyReserveType[type]}</h2>
          <p className={styles.eventDate}>{formatDate(eventDate)}</p>

          <p className={styles.bookingAt}>{formatDate(bookingDate)}</p>
        </div>

        <div>
          <p>{address.city}</p>
          <p>{address.neighborhood}</p>
          <p>{address.street}</p>
          <p>{address.number}</p>
          <p>{address.complement}</p>
        </div>

        <div>
          <p className={`${styles.statusCard} ${styles[friendlyEventStatus[status].color]}`}>{friendlyEventStatus[status].label}</p>
        </div>

        <div>
          <p>{totalPrice}</p>

          {isFullyPaid ? "" : (
            <p>{paidPrice}</p>
          )}
        </div>

        <div>
          {services.map((s, idx) => (
            <p key={idx}>{s.name}</p>
          ))}
        </div>

        <div>
          {details.toString()}
        </div>

      </div>
    </>
  );
}