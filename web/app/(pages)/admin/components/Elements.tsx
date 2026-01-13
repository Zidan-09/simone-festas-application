"use client";
import { useState } from "react";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";
import { Pencil, Trash } from "lucide-react";
import { ItemType } from "@prisma/client";
import Loading from "@/app/components/Loading/Loading";
import CreateUpdateItem from "./Items/CreateUpdateItem";
import CreateUpdateTheme from "./themes/CreateUpdateTheme";
import CreateUpdateService from "./services/CreateUpdateService";
import DeletePopup from "./DeletePopup";
import config from "@/app/config-api.json";
import { Section } from "./Table";
import styles from "./Elements.module.css";

const editComponentMap = {
  item: CreateUpdateItem,
  theme: CreateUpdateTheme,
  service: CreateUpdateService
};

interface ElementsProps {
  actualSection: Section;
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
  const [disableBtn, setDisableBtn] = useState(false);
  const { showFeedback } = useFeedback();
  const CreateUpdateElement = editComponentMap[actualSection];

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
    if (disableBtn) return null;
    setDisableBtn(true);

    setActualId(id);
    setActualName(name);
    setDeleteOpen(true);

    setDisableBtn(false);
  };

  const handleEdit = async (id: string) => {
    if (disableBtn) return null;
    setDisableBtn(true);

    try {
      const result = await fetch(`${config.api_url}/${actualSection}/${id}`).then(res => res.json());
      console.log(result);

      setEditData(result.data);
      setEditOpen(true);

    } catch (err) {
      showFeedback("Erro ao editar o item selecionado", "error");
      console.error(err);
    }
    setDisableBtn(false);
  }

  function normalizeItem(raw: any) {
    if (raw.item) {
      return {
        id: raw.item.id,
        vid: raw.id,
        name: raw.item.name,
        description: raw.item.description,
        price: Number(raw.item.price),
        type: raw.item.type,
        image: raw.image,
        keywords: raw.keyWords,
        quantity: raw.quantity,
        variant: raw.variant,
      };
    }

    return raw;
  }

  function formatElement(element: any, col: string): string {
    if (actualSection === "item") {
      if (col === "type") return friendlyItemTypes[element as ItemType] ?? "-";

      if (col === "price") return `R$ ${Number(element).toFixed(2)}`;

      return element;
    }

    if (actualSection === "theme") {
      if (col === "linkedItem") return element;

      return element;
    }

    if (actualSection === "service") return element;

    return "-";
  }

  if (loading) return (
    <Loading />
  );

  let normalizedElements: any[] = [];

  if (elements) {
    normalizedElements = elements.map(el => {
      if (actualSection === "item") return normalizeItem(el);
      return el;
    });
  }

  return (
    <div className={`${styles.container} ${disableBtn ? styles.cursorLoading : ""}`}>
      <div className={`${styles.element} ${styles.header}`}>
        {columns.map(col => (
          <strong key={col.key} className={`${styles.item} ${styles.itemHeader}`}>{col.label}</strong>
        ))}
      </div>

      {normalizedElements.map((element, index) => (
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
              className={disableBtn ? styles.disabled : styles.editBtn}
              onClick={() => handleEdit(element.id)}
              disabled={disableBtn}
            >
              <Pencil
              color="white"
              strokeWidth={3}
              />
            </button>

            <button
              title="delete"
              type="button"
              className={disableBtn ? styles.disabled : styles.deleteBtn}
              onClick={() => handleDelete(element.vid ? element.vid : element.id, element.name)}
              disabled={disableBtn}
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

      {onEditOpen && CreateUpdateElement && (
        <CreateUpdateElement
        onClose={() => setEditOpen(false)}
        refetch={refetch}
        initialData={editData}
        />
      )}
    </div>
  );
}