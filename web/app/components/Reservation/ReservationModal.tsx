import type { Service, ReserveType } from "@/app/types";
import styles from "./ReservationModal.module.css";

interface ReservationModalProps {
  id: string;
  eventDate: string;
  bookingDate: string;
  totalPrice: number;
  paidPrice: number;
  type: ReserveType;
  services: Service[];
  details: any;
  onClose: () => void;
}

export default function ReservationModal({ id, eventDate, bookingDate, totalPrice, paidPrice, type, services, details, onClose }: ReservationModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        <h2>Detalhes da Reserva</h2>
        <hr />

        <div className={styles.grid}>
          <section>
            <h4>Informações Gerais</h4>
            <p><strong>Data do Evento:</strong> {eventDate}</p>
            <p><strong>Serviços:</strong> {services.join(", ")}</p>
          </section>

          <section>
            <h4>Detalhes da {type}</h4>
            {type === "ITEMS" && (
              <ul>
                {details.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {type === "KIT" && (
              <div className={styles.kitDetails}>
                <p>Tipo: {details.kitType}</p>
                <p>Mesas: {details.tableSet}</p>
                <p>Tema: {details.theme}</p>
                <p>Itens inclusos: {details.items.join(", ")}</p>
              </div>
            )}

            {type === "TABLE" && (
              <div>
                <p>Tonalidade: {details.tonality}</p>
                <p>Pessoas: {details.guestsQuantity}</p>
              </div>
            )}
          </section>
        </div>

        <div className={styles.actions}>
          <button className={styles.editBtn}>Editar Reserva</button>
          <button className={styles.cancelBtn}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}