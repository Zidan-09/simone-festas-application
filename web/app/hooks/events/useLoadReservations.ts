import { useEffect, useState } from "react";
import type { EventFormated } from "@/app/types";
import config from "@/app/config-api.json";


export function useLoadReservations(byUser: boolean) {
  const [reservations, setReservations] = useState<{ reservations: EventFormated[], loading: boolean }>({
    reservations: [],
    loading: true
  });

  useEffect(() => {
    async function fetchAllReservations() {
      try {
        const reservationsFromApi = await fetch(`${config.api_url}/event${byUser ? "?scope=me" : ""}`).then(res => res.json());

        if (!reservationsFromApi.success) throw new Error(reservationsFromApi.message);

        setReservations({
          reservations: reservationsFromApi.data,
          loading: false
        });

      } catch (err) {
        console.error(err);
        setReservations((prev) => ({
          ...prev,
          loading: false
        }));
      }
    }

    fetchAllReservations();
  }, [byUser]);

  return reservations;
}