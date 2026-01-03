"use client";
import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { ItemType } from "@prisma/client";
import Loading from "@/app/components/Loading/Loading";
import CreateUpdateItem from "./Items/CreateUpdateItem";
import DeletePopup from "./DeletePopup";
import config from "@/app/config-api.json";
import styles from "./Elements.module.css";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";

interface ElementsProps {
  actualSection: string;
  elements: any[];
  refetch: () => void;
  loading: boolean;
}

export default function Elements({ actualSection, elements, refetch, loading }: ElementsProps) {
  const [actualId, setActualId] = useState<string | null>(null);
  const [actualName, setActualName] = useState<string | null>(null);
  const [onEditOpen, setEditOpen] = useState<boolean>(false);
  const [onDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<any | null>(null);
  const { showFeedback } = useFeedback();

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
      { label: "Item Vinculado", key: "linkedItem" }
    ],
    service: [
      { label: "Nome", key: "name" },
      { label: "Preço", key: "price" },
    ],
  };

  const friendlyItemTypes: Record<ItemType, string> = {
    [ItemType.CURTAIN]: "cortina",
    [ItemType.PANEL]: "painel",
    [ItemType.DESSERT_STAND]: "doceiras",
    [ItemType.TABLE]: "mesas",
    [ItemType.RUG]: "carpete",
    [ItemType.EASEL]: "cavalete",
  };

  const columns = SECTION_CONFIG[actualSection] || [];

  const handleDelete = async (id: string, name: string) => {
    setActualId(id);
    setActualName(name);
    setDeleteOpen(true);
  };

  const handleEdit = async (id: string) => {
    try {
      const result = await fetch(`${config.api_url}/${actualSection}/${id}`).then(res => res.json());
      console.log(result);

      setEditData(result.data);
      setEditOpen(true);

    } catch (err) {
      showFeedback("Erro ao editar o item selecionado", "error");
      console.error(err);
    }
  }

  function formatElement(element: any, col: string): string {
    if (actualSection === "item") {
      if (col === "type") return friendlyItemTypes[element as ItemType] ?? "-";

      if (col === "price") return `R$ ${Number(element).toFixed(2)}`;

      return element;
    }

    if (actualSection === "theme") {

    }

    return "-";
  }

  if (loading) return (
    <Loading />
  )

  return (
    <div className={styles.container}>
      <div className={`${styles.element} ${styles.header}`}>
        {columns.map(col => (
          <strong key={col.key} className={`${styles.item} ${styles.itemHeader}`}>{col.label}</strong>
        ))}
      </div>

      {elements.map((element, index) => (
        <div
          key={index}
          className={styles.element}
        >
          {columns.map((col) => (
            <p key={col.key} className={styles.item}>
              {formatElement(element[col.key], col.key)}
            </p>
          ))}

          <div className={styles.buttonsContainer}>
            <button
              title="edit"
              type="button"
              className={styles.editBtn}
              onClick={() => handleEdit(element.id)}
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
              onClick={() => handleDelete(element.vid ? element.vid : element.id, element.name)}
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
          refetch={refetch}
        />
      )}

      {onEditOpen && (
        <CreateUpdateItem
        onClose={() => setEditOpen(false)}
        refetch={refetch}
        initialData={editData}
        />
      )}
    </div>
  );
}