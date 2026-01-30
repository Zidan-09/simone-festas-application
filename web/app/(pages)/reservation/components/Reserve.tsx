"use client";
import { useState } from "react";
import Image from "next/image";

import tableOption from "../../../assets/images/table.jpeg";
import kitOption from "../../../assets/images/bobbie-goods.jpeg";
import itensOption from "../../../assets/images/itens.jpeg";

import config from "@/app/config-api.json";
import styles from "./Reserve.module.css";
import Selection from "./Selection";

export type EventType = "kit" | "item" | "table";

interface ReserveProps {
  onClose: () => void;
}

export default function Reserve({ onClose }: ReserveProps) {
  const [eventType, setEventType] = useState<EventType>("kit");
  const [eventDate, setEventDate] = useState<string>("");
  const [userAddress, setUserAddress] = useState<boolean>(true);
  const [address, setAddress] = useState<{}>({});
  const [reservedData, setReservedData] = useState<{} | undefined>(undefined);

  const [eventDateError, setEventDateError] = useState<boolean>(false);
  const [eventDateTouched, setEventDateTouched] = useState<boolean>(false);

  const [labelIdx, setLabelIdx] = useState<number>(0);

  const labelsForReserveTypes = [
    "Escolha o kit, conjunto de mesas e o tema que cuidamos do resto para você!",
    "Escolha cada item separadamente para deixar a festa a sua cara!",
    "Selecione o tom de cor para que possamos cuidar do resto para você!"
  ];

  const handleNextStep = () => {

  }

  const handleSubmitReserve = async () => {
    try {
      const result = await fetch(`${config.api_url}/event?eventType=${eventType}`, {
        method: "POST",
        body: JSON.stringify({
          event: {
            eventDate: new Date(eventDate).toISOString(),
            address: userAddress ? undefined : address,
          }
        })
      }).then(res => res.json());

      if (result.success) throw new Error(result.message);

      setReservedData(result.data);

    } catch (err) {
      throw err;
    }
  };

  function isValidEventDate(eventDate: string) {
    const reserve = new Date();
    const event = new Date(eventDate);

    reserve.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    event.setDate(event.getDate() + 1);

    if (event <= reserve) return false;

    const reserveDay = reserve.getDay();

    if (reserveDay === 5) {
      const monday = new Date(reserve);
      monday.setDate(reserve.getDate() + 3);

      return event >= monday;
    }

    return true;
  }

  function getMinEventDate() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const day = date.getDay();

    if (day === 5) {
      date.setDate(date.getDate() + 3);

    } else {
      date.setDate(date.getDate() + 1);
    }

    return date.toISOString().split("T")[0];
  }

  return (
    <div className={styles.container}>
      <div className={styles.panel}>

        <h2 className={styles.title}>Vamos fazer sua reserva!</h2>

        <div className={styles.fieldWrapper}>
          <label
          htmlFor="eventDate"
          className={eventDateError ? styles.eventDateError : styles.label}
          >
            Digite a data do evento*
          </label>

          <input
            type="date"
            value={eventDate}
            min={getMinEventDate()}
            className={eventDateError ? styles.eventDateInputError : styles.input}
            onChange={(e) => {
              const value = e.target.value;
              setEventDate(value);
              if (eventDateTouched) {
                setEventDateError(!value || !isValidEventDate(value));
              };
            }}
            onBlur={() => {
              setEventDateTouched(true);
              setEventDateError(!eventDate || !isValidEventDate(eventDate));
            }}
          />
        </div>

        <div className={styles.reserveTypeWrapper}>
          <label
          htmlFor="reserveType"
          className={styles.label}
          >
            Selecione a reserva que gostaria de fazer*
          </label>

          <div className={styles.reserveTypeContainer}>
            <div
            className={`${styles.reserveOption} ${eventType === "kit" ? styles.selectedType : ""}`}
            onClick={() => {
              setEventType("kit");
              setLabelIdx(0);
            }}>
              <Image
                src={kitOption}
                alt="Kit"
                className={styles.reserveImage}
              />

              <h3 className={styles.reserveLabel}>Kit Temático</h3>
            </div>

            <div
            className={`${styles.reserveOption} ${eventType === "item" ? styles.selectedType : ""}`}
            onClick={() => {
              setEventType("item");
              setLabelIdx(1);
            }}>
              <Image
                src={itensOption}
                alt="item"
                className={styles.reserveImage}
              />

              <h3 className={styles.reserveLabel}>Itens</h3>
            </div>

            <div
            className={`${styles.reserveOption} ${eventType === "table" ? styles.selectedType : ""}`}
            onClick={() => {
              setEventType("table");
              setLabelIdx(2);
            }}>
              <Image
                src={tableOption}
                alt="table"
                className={styles.reserveImage}
              />

              <h3 className={styles.reserveLabel}>Mesa Posta</h3>
            </div>

          </div>
        </div>

        <p className={styles.details}>{labelsForReserveTypes[labelIdx]}</p>

        <div className={styles.buttons}>
          <button
            className={`${styles.button} ${styles.cancel}`}
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className={`${styles.button} ${eventDate.trim() || !eventDateError ? styles.next : styles.disabled}`}
            disabled={!eventDate.trim() || eventDateError}
            onClick={handleNextStep}
          >
            Próximo
          </button>
        </div>
      </div>

      <Selection
        eventType={eventType}
      />
    </div>
  )
}