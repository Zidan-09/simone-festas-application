import { EventTable } from "@/app/types";
import styles from "./TableSelection.module.css";
import { useState, Dispatch, SetStateAction } from "react";

interface TableSelectionProps {
  tablesToSend: EventTable;
  setTablesToSend: Dispatch<SetStateAction<EventTable>>;
  changeStep: Dispatch<SetStateAction<number>>;
}

export default function TableSelection({ tablesToSend, setTablesToSend, changeStep }: TableSelectionProps) {
  const [colorTone, setColorTone] = useState<string>("");
  const [numberOfPeople, setNumberOfPeople] = useState<number>(0);

  const handleUpdateTable = () => {
    
  }

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
          <button
            className={`${styles.button} ${styles.cancel}`}
            onClick={() => changeStep(1)}
          >
            Voltar
          </button>

          <button
            className={`${styles.button} ${colorTone.trim() || numberOfPeople > 0 ? styles.next : styles.disabled}`}
            disabled={!colorTone.trim() || numberOfPeople <= 0}
            onClick={() => changeStep(3)}
          >
            Próximo
          </button>
        </div>
    </div>
  )
}