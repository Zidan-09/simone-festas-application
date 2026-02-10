"use client";
import { useState } from "react";
import { useGetElements } from "../hook/useGetElements";
import { EventType } from "./Reserve";
import { type Theme, type ItemFormated, ItemType } from "@/app/types";
import Loading from "@/app/components/Loading/Loading";
import config from "@/app/config-api.json";
import styles from "./Selection.module.css";

interface SelectionProps<T extends EventType> {
  eventType: T;
}

type EventTypeMap = {
  item: ItemFormated;
  kit: Theme;
  table: ItemFormated;
}

const table: Record<EventType, { endpoint: string }> = {
  "item": { endpoint: `${config.api_url}/item` },
  "kit": { endpoint: `${config.api_url}/theme` },
  "table": { endpoint: `${config.api_url}/item/type/${ItemType.TABLE_SETTING}` },
}

export default function Selection<T extends EventType>({ eventType }: SelectionProps<T>) {
  const endpoint = table[eventType].endpoint;
  const { loading, data } = useGetElements<EventTypeMap[T]>(endpoint);
  const [selectedElements, setSelectedElements] = useState<EventTypeMap[T]>();

  console.log(data);

  return (
    <div className={styles.container}>

    </div>
  )
}