"use client";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { type EventTable, type ItemFormated, ItemType } from "@/app/types";
import { formatPrice } from "@/app/utils";

import TableSelectionCard from "../SelectionCards/Kit/TableSelectionCard";
import Loading from "@/app/components/Loading/Loading";
import Buttons from "@/app/components/Reservation/Buttons/Buttons";

import config from "@/app/config-api.json";
import styles from "./TableSelection.module.css";

interface TableSelectionProps {
  setTablesToSend: Dispatch<SetStateAction<EventTable>>;
  changeStep: Dispatch<SetStateAction<number>>;
  totalPrice: number;
  setTotalPrice: Dispatch<SetStateAction<number>>;
}

export default function TableSelection({ setTablesToSend, changeStep, totalPrice, setTotalPrice }: TableSelectionProps) {
  const [colorTone, setColorTone] = useState<string>("");
  const [colorToneName, setColorToneName] = useState<string>("");
  const [numberOfPeople, setNumberOfPeople] = useState<string>("");
  const [tables, setTables] = useState<ItemFormated[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [numberOfPeopleError, setNumberOfPeopleError] = useState<boolean>(false);
  const [numberOfPeopleTouched, setNumberOfPeopleTouched] = useState<boolean>(false);

  const priceTable = [
    { people: 10, price: 250 },
    { people: 20, price: 450 },
    { people: 30, price: 600 },
    { people: 40, price: 750 },
    { people: 50, price: 900 },
    { people: 60, price: 1000 },
    { people: 70, price: 1150 },
    { people: 80, price: 1200 },
  ];

  const calculatePrice = (people: number): number => {
    if (people <= 10) return 250;
    if (people >= 80) return 1200;

    for (let i = 0; i < priceTable.length - 1; i++) {
      const current = priceTable[i];
      const next = priceTable[i + 1];

      if (people >= current.people && people <= next.people) {
        const proportion =
          (people - current.people) /
          (next.people - current.people);

        return Math.round(
          current.price +
          proportion * (next.price - current.price)
        );
      }
    }

    return 0;
  };

  const handleNextStep = () => {
    changeStep(3);
    setTablesToSend({
      eventType: "TABLE",
      variant: colorToneName,
      colorToneId: colorTone,
      numberOfPeople: Number(numberOfPeople)
    });
  }

  useEffect(() => {
    setLoading(true);
    async function fetchTables() {
      try {
        const res = await fetch(`${config.api_url}/item/type/${ItemType.TABLE_SETTING}`).then(res => res.json());

        if (!res.success) throw new Error(res.message);

        setTables(res.data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTables();
  }, []);

  useEffect(() => {
    const value = calculatePrice(Number(numberOfPeople));

    setTotalPrice(value);

  }, [numberOfPeople]);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.stepTitle}>Agora Vamos Montar Seu Evento</h2>
        <p className={styles.stepSubtitle}>Personalize sua reserva do jeito que você imaginou</p>
      </div>

      <div className={styles.panel}>
        <div className={styles.fieldWrapper}>
          <label
            htmlFor="color-tone"
            className={`${styles.label} ${styles.numberOfPeopleLabel}`}
          >
            Selecione a tonalidade*
          </label>

          {loading || !tables.length ? (
            <div className={styles.loadingContainer}>
              <Loading />
            </div>
          ) : ""}

          <div className={styles.tablesContainer}>
            {tables.map((t, idx) => (
              <div key={idx} onClick={() => {
                setColorTone(t.vid);
                setColorToneName(t.variant);
              }}>
                <TableSelectionCard table={t} selected={colorTone} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.fieldWrapper}>
          <label
          htmlFor="peoples"
          className={numberOfPeopleError ? styles.labelError : styles.label}
          >
            Digite quantas pessoas estarão no evento*
          </label>

          <input
            type="number"
            value={numberOfPeople}
            min="10"
            className={numberOfPeopleError ? styles.numberOfPeopleInputError : styles.input}
            placeholder="mínimo: 10; máximo: 80"
            onChange={(e) => {
              const value = e.target.value;
              setNumberOfPeople(value);
              if (numberOfPeopleTouched) {
                setNumberOfPeopleError(Number(value) < 10 || Number(value) > 80);
              };
            }}
            onBlur={() => {
              setNumberOfPeopleTouched(true);
              setNumberOfPeopleError(Number(numberOfPeople) < 10 || Number(numberOfPeople) > 80);
            }}
          />
        </div>

        <div className={styles.total}>
          <p className={styles.totalPrice}>Valor total: {formatPrice(totalPrice)}</p>
        </div>

        <Buttons
          firstText="Voltar"
          firstAction={() => changeStep(1)}
          secondText="Próximo"
          secondAction={handleNextStep}
          secondDisabled={!colorTone.trim() || numberOfPeopleError || !numberOfPeople.trim()}
        />
      </div>
    </div>
  )
}