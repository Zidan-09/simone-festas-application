"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import { ItemType } from "@prisma/client";
import config from "@/app/config-api.json";
import styles from "./Elements.module.css";
import DeletePopup from "./DeletePopup";

const friendlyItemTypes: Record<ItemType, string> = {
  [ItemType.CURTAIN]: "cortina",
  [ItemType.PANEL]: "painel",
  [ItemType.DESSERT_STAND]: "doceiras",
  [ItemType.TABLE]: "mesas",
  [ItemType.RUG]: "carpete",
  [ItemType.EASEL]: "cavalete",
};

interface ElementsProps {
  actualSection: string;
}

export default function Elements({ actualSection }: ElementsProps) {
  const [elements, setElements] = useState<any[] | null>(null);
  const [actualId, setActualId] = useState<string | null>(null);
  const [actualName, setActualName] = useState<string | null>(null);
  const [onEditOpen, setEditOpen] = useState<boolean>(false);
  const [onDeleteOpen, setDeleteOpen] = useState<boolean>(false);

  const SECTION_CONFIG: Record<string, { label: string; key: string }[]> = {
    item: [
      { label: "Nome", key: "name" },
      { label: "Descrição", key: "description" },
      { label: "Tipo", key: "type" },
      { label: "Preço", key: "price" },
      { label: "Variação", key: "variant" },
      { label: "Quantidade", key: "quantity" }
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

  const handleDelete = async (id: string, name: string) => {
    setActualId(id);
    setActualName(name);
    setDeleteOpen(true);
  };

  const handleEdit = async (id: string) => {
    setActualId(id);
    setEditOpen(true);
  }

  useEffect(() => {
    async function getAll() {
      try {
        const result = await fetch(`${config.api_url}/${actualSection}`).then(res => res.json());
        setElements(result.data);

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

      {elements && elements.map((element, index) => (
        <div
          key={index}
          className={styles.element}
        >
          {columns.map((col) => (
            <p key={col.key} className={styles.item}>
              {col.key === "type"
                ? friendlyItemTypes[element.type as ItemType] ?? "-"
                : col.key === "price"
                  ? `R$ ${Number(element[col.key]).toFixed(2)}`
                  : element[col.key] || "-"}
            </p>
          ))}

          <div className={styles.buttonsContainer}>
            <button
              title="edit"
              type="button"
              className={styles.editBtn}
            >
              <Pencil
              color="white"
              strokeWidth={3}
              />
            </button>

            <button
              title="delete"
              type="button"
              className={styles.deleteBtn}
              onClick={() => handleDelete(element.vid, element.name)}
            >
              <Trash
              color="white"
              strokeWidth={3}
              />
            </button>
          </div>
        </div>
      ))}

      {elements?.length === 0 && <p className={styles.nothing}>Nenhum registro encontrado.</p>}

      {onDeleteOpen && (
        <DeletePopup
          actualSection={actualSection}
          id={actualId}
          name={actualName}
          onClose={() => setDeleteOpen(false)}
        />
      )}
    </div>
  );
}