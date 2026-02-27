"use client";
import { useState } from "react";
import { useCheckUser } from "@/app/hooks/check/useCheckUser";
import { useLoadReservations } from "@/app/hooks/events/useLoadReservations";
import type { EventItem, ReserveType, EventKit, EventTable, EventPayload, EventBase, Address, Service, EventSaved, ReserveStep } from "@/app/types";

import ReserveTable from "./components/Reserve/ReserveTable";
import LogginWarning from "./components/LogginWarning";
import ReserveInit from "./components/Reserve/ReserveInit";
import ItemSelection from "./components/Reserve/Selection/ItemSelection";
import KitSelection from "./components/Reserve/Selection/KitSelection";
import TableSelection from "./components/Reserve/Selection/TableSelection";
import AddressReserve from "./components/Reserve/AddressReserve";
import Services from "./components/Reserve/Services";
import Confirmation from "./components/Reserve/Confirmation/Confirmation";

import Loading from "@/app/components/Loading/Loading";
import styles from "./Reservation.module.css";
import Payment from "./components/Reserve/Confirmation/Payment";

export default function ReservationsPage() {
  const { logged, checking } = useCheckUser();

  const { reservations, loading } = useLoadReservations(true);
  const [reserveStep, setReserveStep] = useState<ReserveStep>("OFF");

  const [eventDate, setEventDate] = useState<string>("");
  const [eventType, setEventType] = useState<ReserveType>("KIT");

  const [items, setItems] = useState<EventItem>({
    eventType: "ITEMS",
    items: []
  });

  const [kit, setKit] = useState<EventKit>({
    eventType: "KIT",
    kitType: "SIMPLE",
    tables: "",
    theme: ""
  });

  const [table, setTable] = useState<EventTable>({
    eventType: "TABLE",
    variant: "",
    colorToneId: "",
    numberOfPeople: 0
  });

  const [address, setAddress] = useState<Address>({ cep: "", city: "", neighborhood: "", street: "", number: "", complement: ""});
  const [service, setService] = useState<Service | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [savedReserve, setSavedReserve] = useState<EventSaved | null>(null);

  function getSelectedReserveData(): EventKit | EventItem | EventTable {
    switch (eventType) {
      case "ITEMS":
        return items;
      case "KIT":
        return kit;
      case "TABLE":
        return table;
    }
  }

  const reset = () => {
    setReserveStep("OFF");
    setEventDate("");
    setEventType("ITEMS");
    setItems({
      eventType: "ITEMS",
      items: []
    });
    setKit({
      eventType: "KIT",
      kitType: "SIMPLE",
      tables: "",
      theme: ""
    });
    setTable({
      eventType: "TABLE",
      variant: "",
      colorToneId: "",
      numberOfPeople: 0
    });
    setAddress({ cep: "", city: "", neighborhood: "", street: "", number: ""});
    setService(null);
    setTotalPrice(0);
  }

  function createBody(): EventPayload {
    const base: EventBase = {
      event: {
        eventDate: new Date(eventDate).toISOString(),
        address: address.cep !== "" ? address : undefined,
        totalPrice: totalPrice,
        totalPaid: 0
      },
      service: service ? service.id : null,
    };

    const reserve = getSelectedReserveData();

    return {
      ...base,
      ...reserve
    }
  }

  if (checking || loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  if (!logged && !checking) {
    return (
      <main className={styles.container}>
        <LogginWarning />
      </main>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Minhas Reservas</h2>
        <p className={styles.subtitle}>Revise datas, itens e deixe tudo pronto para o grande dia.</p>
      </div>

      {reservations.length > 0 && (
        <ReserveTable
          reserves={reservations}
        />
      )}

      <button className={`${styles.reserveButton} ${reservations.length <= 0 ? styles.space : ""}`} onClick={() => setReserveStep("INIT")}>
        Quero Reservar!
      </button>

      <div className={styles.random}>

      </div>

      {reserveStep === "INIT" && (
        <ReserveInit
          changeStep={setReserveStep} 
          eventDate={eventDate} 
          setEventDate={setEventDate} 
          eventType={eventType} 
          setEventType={setEventType}
          reset={reset}
          resetTotalPrice={() => setTotalPrice(0)}
        />
      )}

      {reserveStep === "SELECTION" && eventType === "ITEMS" && (
        <ItemSelection
          itemsToSend={items}
          setItemsToSend={setItems}
          changeStep={setReserveStep}
          totalPrice={totalPrice}
          setTotalPrice={setTotalPrice}
        />
      )}

      {reserveStep === "SELECTION" && eventType === "KIT" && (
        <KitSelection
          setKitToSend={setKit}
          changeStep={setReserveStep}
          totalPrice={totalPrice}
          setTotalPrice={setTotalPrice}
        />
      )}

      {reserveStep === "SELECTION" && eventType === "TABLE" && (
        <TableSelection
          setTablesToSend={setTable}
          changeStep={setReserveStep}
          totalPrice={totalPrice}
          setTotalPrice={setTotalPrice}
        />
      )}

      {reserveStep === "ADDRESS" && (
        <AddressReserve
          reserveType={eventType}
          address={address}
          setAddress={setAddress}
          changeStep={setReserveStep}
        />
      ) }

      {reserveStep === "SERVICE" && eventType === "KIT" && (
        <Services
          kitType={kit.kitType}
          changeStep={setReserveStep}
          service={service}
          setService={setService}
          totalPrice={totalPrice}
          setTotalPrice={setTotalPrice}
        />
      )}

      {reserveStep === "CONFIRMATION" && (
        <Confirmation
          reserve={createBody()}
          changeStep={setReserveStep}
          serviceSelected={service}
        />
      )}

      {reserveStep === "PAYMENT" && (
        <Payment
          reserve={savedReserve}
        />
      )}
      
    </div>
  );
}
