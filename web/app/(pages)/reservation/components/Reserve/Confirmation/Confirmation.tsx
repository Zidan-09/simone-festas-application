"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import type { EventPayload, EventKit, EventItem, EventTable, Address } from "@/app/types";

import config from "@/app/config-api.json";
import styles from "./Confirmation.module.css";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";
import Buttons from "@/app/components/Reservation/Buttons/Buttons";
import { raw } from "@prisma/client/runtime/client";

interface ConfirmationProps {
  reserve: EventPayload;
  changeStep: Dispatch<SetStateAction<number>>;
}

export default function Confirmation({ reserve, changeStep }: ConfirmationProps) {
  const { event, services, eventType } = reserve;
  const { eventDate, totalPrice, address } = event;
  const [userAddress, setUserAddress] = useState<Address | null>(null);

  const rawDate = new Date(eventDate);

  const formattedDate = `${String(rawDate.getUTCDate()).padStart(2, "0")}/${String(rawDate.getUTCMonth() + 1).padStart(2, "0")}/${rawDate.getFullYear()}`;

  const { showFeedback } = useFeedback();

  const handleSendReservation = async () => {
    try {
      const res = await fetch(`${config.api_url}/event`, {
        method: "POST",
        body: JSON.stringify(reserve)
      }).then(res => res.json());

      if (!res.success) throw new Error(res.message);
      showFeedback("Reserva agendada, faça o pagamento", "info");


    } catch (err) {
      console.error(err);
      showFeedback("Erro ao realizar a reserva", "error");
    }
  }

  useEffect(() => {
    if (address?.cep) return;

    async function getUserAddress() {
      try {
        const res = await fetch(`${config.api_url}/user`).then(res => res.json());

        if (!res.success) throw new Error(res.message);

        const address: Address = res.data.address;

        setUserAddress(address);

      } catch (err) {
        console.error(err);
      }
    }

    getUserAddress();

  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>Vamos confirmar sua reserva</h2>
        <p className={styles.subtitle}>Veja se está tudo correto para prosseguirmos</p>
      </div>

      <div className={styles.infoContainer}>
        <p className={styles.date}>Dia do evento: <span className={styles.span}>{formattedDate}</span></p>

        <hr className={styles.divisor} />

        {address?.cep || userAddress ? (
          <div className={styles.address}>
            <p className={styles.addressData}>Cidade: <span className={styles.span}>{address?.cep ? address.city : userAddress?.city}</span></p>
            <p className={styles.addressData}>Bairro: <span className={styles.span}>{address?.cep ? address.neighborhood : userAddress?.neighborhood}</span></p>
            <p className={styles.addressData}>Rua: <span className={styles.span}>{address?.cep ? address.street : userAddress?.street}</span></p>
            <p className={styles.addressData}>Número: <span className={styles.span}>{address?.cep ? address.number : userAddress?.number}</span></p>
            {address?.complement || userAddress?.complement ? (
              <p className={styles.addressData}>Complemento: <span className={styles.span}>{address?.cep ? address.complement : userAddress?.complement}</span></p>
            ) : ""}
          </div>
        ) : ""}

        <hr className={styles.divisor} />

        {eventType === "ITEMS" ? (
          <div className={styles.itemsContainer}>

          </div>
        ) : ""}

        {eventType === "KIT" ? (
          <div className={styles.kitContainer}>

          </div>
        ) : ""}

        {eventType === "TABLE" ? (
          <div className={styles.tableContainer}>

          </div>
        ) : ""}

      </div>

      <Buttons
        firstText="Voltar"
        firstAction={() => changeStep(3)}
        secondText="Reservar"
        secondAction={handleSendReservation}
        secondDisabled={false}
      />
    </div>
  );
}