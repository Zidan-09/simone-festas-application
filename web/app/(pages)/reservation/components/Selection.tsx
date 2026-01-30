"use client";
import { useState } from "react";
import { EventType } from "./Reserve";
import styles from "./Selection.module.css";

interface SelectionProps {
  eventType: EventType;
}

export default function Selection({}: SelectionProps) {
  const [selection, setSelection] = useState([]);

  return (
    <div className={styles.container}>

    </div>
  )
}