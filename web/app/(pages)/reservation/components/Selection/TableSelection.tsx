import { EventTable } from "@/app/types";
import styles from "./TableSelection.module.css";
import { useState, Dispatch, SetStateAction } from "react";

interface TableSelectionProps {
  tablesToSend: EventTable;
  setTablesToSend: Dispatch<SetStateAction<EventTable>>;
}

export default function TableSelection({ tablesToSend, setTablesToSend}: TableSelectionProps) {
  const [colorTone, setColorTone] = useState<string>("");
  const [numberOfPeople, setNumberOfPeople] = useState<number>(0);

  const handleUpdateTable = () => {
    
  }

  return (
    <div className={styles.container}>

    </div>
  )
}