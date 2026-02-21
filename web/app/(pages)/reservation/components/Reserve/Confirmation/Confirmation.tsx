"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";
import type { EventPayload, Address, Service, KitType, ItemFormated, Theme } from "@/app/types";
import { formatPrice } from "@/app/utils";

import Buttons from "@/app/components/Reservation/Buttons/Buttons";

import config from "@/app/config-api.json";
import styles from "./Confirmation.module.css";

interface ConfirmationProps {
  reserve: EventPayload;
  changeStep: Dispatch<SetStateAction<number>>;
  serviceSelected: Service | null;
}

export default function Confirmation({ reserve, changeStep, serviceSelected }: ConfirmationProps) {
  const { event, eventType } = reserve;
  const { eventDate, totalPrice, address } = event;
  const [userAddress, setUserAddress] = useState<Address | null>(null);
  const [tableAndTheme, setTableAndTheme] = useState<{ table: ItemFormated, theme: Theme } | null>(null);

  const rawDate = new Date(eventDate);

  const formattedDate = `${String(rawDate.getUTCDate()).padStart(2, "0")}/${String(rawDate.getUTCMonth() + 1).padStart(2, "0")}/${rawDate.getFullYear()}`;

  const { showFeedback } = useFeedback();

  const friendlyKitType: Record<KitType, { name: string, value: number}> = {
    "SIMPLE": { name: "Simples", value: 130 },
    "CYLINDER": { name: "Cilindro", value: 200 }
  }

  const handleSendReservation = async () => {
    try {
      const res = await fetch(`${config.api_url}/event`, {
        method: "POST",
        body: JSON.stringify({
          ...reserve,
          event: {
            ...reserve.event,
            address: reserve.event.address?.cep === "" ? null : reserve.event.address
          }
        })
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

  useEffect(() => {
    if (reserve.eventType !== "KIT") return;

    async function fetchThemeAndTables() {
      try {
        const resTable = await fetch(`${config.api_url}/item/variant/${reserve.eventType === "KIT" ? reserve.tables : ""}`).then(res => res.json());

        if (!resTable.success) throw new Error(resTable.message);

        const resTheme = await fetch(`${config.api_url}/theme/${reserve.eventType === "KIT" ? reserve.theme : ""}`).then(res => res.json());

        if (!resTheme.success) throw new Error(resTheme.message);

        setTableAndTheme({
          table: resTable.data,
          theme: resTheme.data
        });

      } catch (err) {
        console.error(err);
      }
    }

    fetchThemeAndTables();

  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>Vamos confirmar sua reserva</h2>
        <p className={styles.subtitle}>Veja se está tudo correto para prosseguir-mos</p>
      </div>

      <div className={styles.infoContainer}>
        <p className={styles.date}>Dia do evento: <span className={styles.span}>{formattedDate}</span></p>

        <hr className={styles.divisor} />

        {address?.cep || userAddress ? (
          <div className={styles.address}>
            <p className={styles.labelData}>Cidade: <span className={styles.span}>{address?.cep ? address.city : userAddress?.city}</span></p>
            <p className={styles.labelData}>Bairro: <span className={styles.span}>{address?.cep ? address.neighborhood : userAddress?.neighborhood}</span></p>
            <p className={styles.labelData}>Rua: <span className={styles.span}>{address?.cep ? address.street : userAddress?.street}</span></p>
            <p className={styles.labelData}>Número: <span className={styles.span}>{address?.cep ? address.number : userAddress?.number}</span></p>
            {address?.complement || userAddress?.complement ? (
              <p className={styles.labelData}>Complemento: <span className={styles.span}>{address?.cep ? address.complement : userAddress?.complement}</span></p>
            ) : ""}
          </div>
        ) : ""}

        <hr className={styles.divisor} />

        {eventType === "ITEMS" ? (
          <div className={styles.reserveContainer}>
            {reserve.items.map((i, idx) => (
              <div key={idx} className={styles.item}>
                <p className={styles.labelData}>{i.quantity}x {i.name}-{i.variant} - <span className={styles.span}>{formatPrice(i.price * i.quantity)}</span></p>
              </div>
            ))}
          </div>
        ) : ""}

        {eventType === "KIT" ? (
          <div className={styles.reserveContainer}>
            <p className={styles.labelData}>Kit: <span className={styles.span}>{friendlyKitType[reserve.kitType].name}</span></p>
            <p className={styles.labelData}>Mesas: <span className={styles.span}>{tableAndTheme?.table.name}-{tableAndTheme?.table.variant}</span></p>
            <p className={styles.labelData}>Tema: <span className={styles.span}>{tableAndTheme?.theme.name}</span></p>
            <p className={styles.labelData}>Valor: <span className={styles.span}>{formatPrice(friendlyKitType[reserve.kitType].value)}</span></p>
          </div>
        ) : ""}

        {eventType === "TABLE" ? (
          <div className={styles.reserveContainer}>
            <p className={styles.labelData}>Cor/Tom: <span className={styles.span}>{reserve.variant}</span></p>
            <p className={styles.labelData}>Convidados: <span className={styles.span}>{reserve.numberOfPeople}</span></p>
          </div>
        ) : ""}

        <hr className={styles.divisor} />

        {serviceSelected !== null ? (
          <div className={styles.serviceWrapper}>
            <div className={styles.serviceContainer}>
              <p className={styles.labelData}>Serviço contratado: <span className={styles.span}>{(serviceSelected.name)}</span></p>
              <p className={styles.labelData}>Valor do serviço: <span className={styles.span}>{formatPrice(serviceSelected?.price)}</span></p>
            </div>

            <hr className={styles.divisor} />
          </div>
        ) : ""}

        <div className={styles.total}>
          <p className={styles.totalPrice}>Valor total: {formatPrice(totalPrice)}</p>
        </div>

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