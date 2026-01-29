"use client";
import { useState } from "react";
import Image from "next/image";

import tableOption from "../../../assets/images/table.jpeg";
import kitOption from "../../../assets/images/bobbie-goods.jpeg";
import itensOption from "../../../assets/images/itens.jpeg";

import config from "@/app/config-api.json";
import styles from "./Reserve.module.css";

export type EventType = "kit" | "item" | "table";

export default function Reserve() {
  const [eventType, setEventType] = useState<EventType | undefined>(undefined);
  const [eventDate, setEventDate] = useState<string>("");
  const [userAddress, setUserAddress] = useState<boolean>(true);
  const [address, setAddress] = useState<{}>({});
  const [reservedData, setReservedData] = useState<{} | undefined>(undefined);

  const [eventDateError, setEventDateError] = useState<boolean>(false);
  const [eventDateTouched, setEventDateTouched] = useState<boolean>(false);

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
            className={eventDateError ? styles.eventDateInputError : styles.input}
            onChange={(e) => {
              const value = e.target.value;
              setEventDate(value);
              if (eventDateTouched) setEventDateError(!value);
            }}
            onBlur={() => {
              setEventDateTouched(true);
              setEventDateError(!eventDate);
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
            <div className={styles.reserveOption}>
              <Image
                src={kitOption}
                alt="Kit"
                className={styles.reserveImage}
              />

              <h3 className={styles.reserveLabel}>Kit Temático</h3>
            </div>

            <div className={styles.reserveOption}>
              <Image
                src={itensOption}
                alt="item"
                className={styles.reserveImage}
              />

              <h3 className={styles.reserveLabel}>Itens</h3>
            </div>

            <div className={styles.reserveOption}>
              <Image
                src={tableOption}
                alt="table"
                className={styles.reserveImage}
              />

              <h3 className={styles.reserveLabel}>Mesa Posta</h3>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}