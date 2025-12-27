"use client";
import { useState, useEffect } from "react";
import config from "@/app/config-api.json";
import styles from "./Elements.module.css";

interface ElementsProps {
  actualSection: string;
}

export default function Elements({ actualSection }: ElementsProps) {
  const [elements, setElements] = useState<any[] | null>(null);

  const SECTION_CONFIG: Record<string, { label: string; key: string }[]> = {
    item: [
      { label: "Nome", key: "name" },
      { label: "Descrição", key: "description" },
      { label: "Tipo", key: "type" },
      { label: "Preço", key: "price" },
      { label: "Variação", key: "variantColor" },
      { label: "Quantidade", key: "variantQty" }
    ],
    theme: [
      { label: "Nome", key: "name" },
      { label: "Categoria", key: "category" },
      { label: "Item Vinculado", key: "linkedItem" },
      { label: "Qtd Item", key: "itemQty" }
    ],
    service: [
      { label: "Nome", key: "name" },
      { label: "Preço", key: "price" },
    ],
  };

  const columns = SECTION_CONFIG[actualSection] || [];

  const flattenData = (data: any[], section: string) => {
    if (section === "item") {
      return data.flatMap(item => 
        item.variants && item.variants.length > 0 
          ? item.variants.map((v: any) => ({
              ...item,
              variantColor: v.color,
              variantQty: v.quantity,
              uniqueId: v.id
            }))
          : [{ ...item, variantColor: "-", variantQty: 0, uniqueId: item.id }]
      );
    }

    if (section === "theme") {
      return data.flatMap(theme => 
        theme.theme_items && theme.theme_items.length > 0
          ? theme.theme_items.map((ti: any) => ({
              ...theme,
              linkedItem: ti.item?.name || "N/A",
              itemQty: ti.quantity,
              uniqueId: ti.theme_item_id
            }))
          : [{ ...theme, linkedItem: "-", itemQty: 0, uniqueId: theme.id }]
      );
    }

    return data.map(d => ({ ...d, uniqueId: d.id || d.service_id }));
  };

  useEffect(() => {
    async function getAll() {
      try {
        const response = await fetch(`${config.api_url}/${actualSection}`);
        const result = await response.json();
        
        const processed = flattenData(result.data, actualSection);
        setElements(processed);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    getAll();
  }, [actualSection]);

  return (
    <div className={styles.container}>
      <div className={`${styles.element} ${styles.header}`}>
        {columns.map(col => (
          <strong key={col.key} className={`${styles.item} ${styles.itemHeader}`}>{col.label}</strong>
        ))}
      </div>

      {elements && elements.map((element) => (
        <div key={element.uniqueId} className={styles.element}>
          {columns.map((col) => (
            <p key={col.key} className={styles.item}>
              {col.key === 'price' 
                ? `R$ ${Number(element[col.key]).toFixed(2)}` 
                : element[col.key] || "-"}
            </p>
          ))}
        </div>
      ))}

      {elements?.length === 0 && <p>Nenhum registro encontrado.</p>}
    </div>
  );
}