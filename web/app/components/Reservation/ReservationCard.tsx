"use client";
import { useState } from "react";
import type { EventStatus, ReserveType, EventFormated, Address, Kit, Table, ItemFormated } from "@/app/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatPrice } from "@/app/utils";

import ItemSelectionModal from "./ItemSelectionModal";

import config from "@/app/config-api.json";
import styles from "./ReservationCard.module.css";

interface ReservationCardProps {
  event: EventFormated;
  admin: boolean;
}

export default function ReservationCard({ event, admin }: ReservationCardProps) {
  const { id, reserveType, eventDate, status, totalPrice, totalPaid, service } = event;
  const [showMore, setShowMore] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<ItemFormated[]>(
    () => (event.reserve as Kit).items?.map(i => ({ ...i })) ?? []
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const address: Address = JSON.parse(String(event.address));

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

  function renderReserve() {
    switch (reserveType) {
      case "ITEMS":
        const items = event.reserve as ItemFormated[];

        return (
          <div>
            {items.map((i, idx) => (
              <p key={idx} className={styles.label}>{i.quantity}x {i.name}-{i.variant} - <span>{formatPrice(i.price * i.quantity)}</span></p>
            ))}
          </div>
        );
      case "KIT":
        const kit = event.reserve as Kit;

        return (
          <div>
            <p className={styles.label}>Kit: <span>{kit.kitType}</span></p>
            <p className={styles.label}>Mesas: <span>{kit.tables.name}-{kit.tables.variant}</span></p>
            <p className={styles.label}>Tema: <span>{kit.theme.name}</span></p>
            <p className={styles.label}>Valor: <span>{formatPrice(kit.kitType === "SIMPLE" ? 130 : 200)}</span></p>
          </div>
        );
      case "TABLE":
        const table = event.reserve as Table;

        return (
          <div>
            <p className={styles.label}>Cor/Tom: <span>{table.colorTone.variant}</span></p>
            <p className={styles.label}>Convidado: <span>{table.numberOfPeople}</span></p>
          </div>
        );
    }
  }

  function formatDate(isoDate: string): string {
    const date = new Date(isoDate);

    const formatted = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC"
    });

    return formatted;
  }

  function kitsAreEqual(
    original: ItemFormated[],
    current: ItemFormated[]
  ) {
    if (original.length !== current.length) return false;

    const map = new Map(original.map(i => [i.vid, i.quantity]));

    for (const item of current) {
      const quantity = map.get(item.vid);

      if (quantity === undefined || quantity !== item.quantity) {
        return false;
      }
    }

    return true;
  }

  const handleAddKitItems = async () => {
    const kitWithItems = (event.reserve as Kit).items ?? [];

    if (kitsAreEqual(kitWithItems, selectedItems)) return setOpenModal(false);

    try {
      const res = await fetch(`${config.api_url}/event/${id}/kit-items`, {
        method: "PUT",
        body: JSON.stringify(selectedItems.map(i => {
          return {
            id: i.vid,
            quantity: i.quantity
          };
        }))
      }).then(res => res.json());

      if (!res.success) throw new Error(res.message);

      setOpenModal(false);

    } catch (err) {
      console.error(err);
    }
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

        {reserveType === "KIT" && admin && (
          <>
            <div className={styles.kitItems}>
              {selectedItems.map((i, idx) => (
                <p key={idx} className={styles.label}>{i.quantity}x <span>{i.variant}</span></p>
              ))}
            </div>

            {openModal && (
              <ItemSelectionModal
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                handleAddKitItems={handleAddKitItems}
              />
            )}

            <button
              type="button"
              className={styles.button}
              onClick={() => setOpenModal(true)}
            >
              Adicionar Itens
            </button>
          </>
        )}

        {showMore && (
          <>
            <div>
              <p className={styles.labelTitle}>Local do evento</p>

              <p className={styles.label}>Cidade: <span>{address.city}</span></p>
              <p className={styles.label}>Bairro: <span>{address.neighborhood}</span></p>
              <p className={styles.label}>Rua: <span>{address.street}</span></p>
              <p className={styles.label}>Número: <span>{address.number}</span></p>
              {address.complement && (
                <p className={styles.label}>Complemento: <span>{address.complement}</span></p>
              )}
            </div>

            {reserveType === "KIT" && (
              <div>
                <p className={styles.labelTitle}>Serviço contratado</p>

                <p className={styles.label}>Serviço: <span>{service.name}</span></p>
                <p className={styles.label}>Valor: <span>{formatPrice(service.price)}</span></p>
              </div>
            )}

            <div>
              <p className={styles.labelTitle}>Detalhes da reserva</p>

              {renderReserve()}
            </div>

            <p className={styles.label}>Reserva: <span>{formatDate(event.createdAt)}</span></p>
          </>
        )}
    
        <button className={styles.button} onClick={() => setShowMore(!showMore)}>

          {showMore ? (
            <>
              Mostrar menos
              <ChevronUp className={styles.iconSvg} viewBox="0 -1 24 24" />
            </>
          ) : (
            <>
              Mostrar mais
              <ChevronDown className={styles.iconSvg} viewBox="0 -2.2 24 24" />
            </>
          )}
        </button>
      </div>
    </>
  );
}