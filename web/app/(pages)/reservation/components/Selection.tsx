"use client";
import { useState } from "react";
import { useGetElements } from "../hook/useGetElements";
import { EventType } from "./Reserve";
import { Item } from "@/app/hooks/items/useItems";
import { Theme } from "@/app/hooks/themes/useThemes";
import Loading from "@/app/components/Loading/Loading";
import config from "@/app/config-api.json";
import styles from "./Selection.module.css";
import { ItemTypes } from "@/app/lib/utils/item/itemTypes";

interface SelectionProps<T extends EventType> {
  eventType: T;
}

type EventTypeMap = {
  item: Item;
  kit: Theme;
  table: Item;
}

const table: Record<EventType, { endpoint: string }> = {
  "item": { endpoint: `${config.api_url}/item` },
  "kit": { endpoint: `${config.api_url}/theme` },
  "table": { endpoint: `${config.api_url}/item/Fazer URL pras Tonalidades de mesas postas` },
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