"use client";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { type EventTable, type ItemFormated, ItemType } from "@/app/types";
import TableSelectionCard from "../SelectionCards/Kit/TableSelectionCard";
import Loading from "@/app/components/Loading/Loading";
import config from "@/app/config-api.json";
import styles from "./TableSelection.module.css";
import Buttons from "@/app/components/Reservation/Buttons/Buttons";

interface TableSelectionProps {
  setTablesToSend: Dispatch<SetStateAction<EventTable>>;
  changeStep: Dispatch<SetStateAction<number>>;
}

export default function TableSelection({ setTablesToSend, changeStep }: TableSelectionProps) {
  const [colorTone, setColorTone] = useState<string>("");
  const [numberOfPeople, setNumberOfPeople] = useState<string>("");
  const [tables, setTables] = useState<ItemFormated[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [numberOfPeopleError, setNumberOfPeopleError] = useState<boolean>(false);
  const [numberOfPeopleTouched, setNumberOfPeopleTouched] = useState<boolean>(false);

  const handleNextStep = () => {
    changeStep(3);
    setTablesToSend({
      eventType: "TABLE",
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

  return (
    <div className={styles.container}>
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
              <div key={idx} onClick={() => setColorTone(t.vid)}>
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
            min="5"
            className={numberOfPeopleError ? styles.numberOfPeopleInputError : styles.input}
            placeholder="mínimo: 10; máximo: 50"
            onChange={(e) => {
              const value = e.target.value;
              setNumberOfPeople(value);
              if (numberOfPeopleTouched) {
                setNumberOfPeopleError(Number(value) < 10 || Number(value) > 50);
              };
            }}
            onBlur={() => {
              setNumberOfPeopleTouched(true);
              setNumberOfPeopleError(Number(numberOfPeople) < 10 || Number(numberOfPeople) > 50);
            }}
          />
        </div>

        <Buttons
          firstText="Voltar"
          firstAction={() => changeStep(1)}
          secondText="Próximo"
          secondAction={handleNextStep}
          secondDisabled={!colorTone.trim() || numberOfPeopleError}
        />
      </div>
    </div>
  )
}