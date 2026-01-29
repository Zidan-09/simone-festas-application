"use client";
import { useState } from "react";
import config from "@/app/config-api.json";
import styles from "./Reserve.module.css";

export default function Reserve() {
  const [eventDate, setEventDate] = useState<string>("");
  const [userAddress, setUserAddress] = useState<boolean>(true);
  const [address, setAddress] = useState<{}>({});

  const handleSubmitReserve = async () => {
    const result = await fetch(`${config.api_url}/event`, {
      method: "POST",
      body: JSON.stringify({
        event: {
          eventDate: new Date(eventDate).toISOString(),
          address: userAddress ? undefined : address,
        }
      })
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <input
          type="date"
          name="eventDate"
          className={styles.date}
          value={eventDate}
          onChange={(e) => {
            const value = e.target.value;
            setEventDate(value);
          }}
        />
      </div>
    </div>
  )
}