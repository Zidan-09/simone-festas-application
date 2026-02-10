import { useState } from "react";
import { Address, ReserveType } from "@/app/lib/utils/requests/event.request";
import { Theme } from "@/app/hooks/themes/useThemes";
import ReservationModal from "./ReservationModal";
import styles from "./ReservationCard.module.css";

type EventStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED" | "POSTPONED";

type ItemVariant = {
  id: string;
  itemId: string;
  variant: string | null;
  image: string | null;
  quantity: number;
  keyWords: string[];
}

type Service = {
  id: string;
  name: string;
  price: number;
}

type Kit = {
  kitType: string;
  tables: ItemVariant;
  theme: Theme;
  items: ItemVariant[];
}

type Table = {
  colorTone: ItemVariant;
  numberOfPeople: number;
}

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
  details: ItemVariant[] | Kit | Table;
}

export default function ReservationCard({ id, type, eventDate, address, status, bookingDate, totalPrice, paidPrice, services, details }: ReservationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className={styles.card} onClick={() => setIsModalOpen(true)}>
        <div className={styles.initialData}>
          <h2 className={styles.reserveType}>{friendlyReserveType[type]}</h2>
          <p className={styles.eventDate}>{formatDate(eventDate)}</p>
        </div>

        <div>
          <p>Local:</p>
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

      </div>

      {/* {isModalOpen && (
        <ReservationModal 
          id={id}
          eventDate={eventDate}
          bookingDate={bookingDate}
          totalPrice={totalPrice}
          paidPrice={paidPrice}
          type={type}
          services={services}
          details={details}
          onClose={() => setIsModalOpen(false)} 
        />
      )} */}
    </>
  );
}