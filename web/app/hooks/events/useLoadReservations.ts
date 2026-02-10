import { useEffect, useState } from "react";
import { Address, ReserveType } from "@/app/lib/utils/requests/event.request";
import { Theme } from "../themes/useThemes";
import config from "@/app/config-api.json";

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

export type Reservation = {
  id: string;
  ownerId: string;
  eventDate: string;
  address: Address;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED" | "POSTPONED";
  totalPrice: number;
  totalPaid: number;
  reserveType: ReserveType;
  createdAt: string;
  services: Service[];
  reserve: ItemVariant[] | Kit | Table;
};

export function useLoadReservations(byUser: boolean) {
  const [reservations, setReservations] = useState<{ reservations: Reservation[], loading: boolean }>({
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