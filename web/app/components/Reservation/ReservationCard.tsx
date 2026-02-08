import { useState } from "react";
import { Service } from "@/app/(pages)/admin/components/Table";
import ReservationModal from "./ReservationModal";
import { ReserveType } from "@/app/lib/utils/requests/event.request";
import styles from "./ReservationCard.module.css";

interface ReservationCardProps {
  id: string;
  eventDate: string;
  bookingDate: string;
  totalPrice: number;
  paidPrice: number;
  type: ReserveType;
  services: Service[];
  details: any;
}

export default function ReservationCard({ id, eventDate, bookingDate, totalPrice, paidPrice, type, services, details }: ReservationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFullyPaid = paidPrice >= totalPrice;

  return (
    <>
      <div className={styles.card} onClick={() => setIsModalOpen(true)}>
        <div className={styles.cardHeader}>
          <span className={styles.eventDate}>
            {new Date(eventDate).toLocaleDateString('pt-BR')}
          </span>
          <span className={`${styles.badge} ${styles[type.replace(" ", "")]}`}>
            {type}
          </span>
        </div>

        <div className={styles.cardBody}>
          <p className={styles.bookingInfo}>Reserva feita em: {bookingDate}</p>
          <div className={styles.priceContainer}>
            <div className={styles.priceItem}>
              <span>Total:</span>
              <strong>R$ {totalPrice.toFixed(2)}</strong>
            </div>
            <div className={`${styles.priceItem} ${isFullyPaid ? styles.paid : styles.pending}`}>
              <span>Pago:</span>
              <strong>R$ {paidPrice.toFixed(2)}</strong>
            </div>
          </div>
        </div>
        
        <div className={styles.cardFooter}>
          <small>Clique para detalhes, editar ou cancelar</small>
        </div>
      </div>

      {isModalOpen && (
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
      )}
    </>
  );
}