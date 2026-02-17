"use client";
import { useState } from "react";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";
import { Pencil, Trash } from "lucide-react";
import Loading from "@/app/components/Loading/Loading";
import CreateUpdateItem from "./Items/CreateUpdateItem";
import CreateUpdateTheme from "./themes/CreateUpdateTheme";
import CreateUpdateService from "./services/CreateUpdateService";
import DeletePopup from "./DeletePopup";
import { Section } from "./Table";
import type { Item} from "@/app/types";
import type { SectionElementMap } from "./Table";
import { ItemType } from "@/app/types";
import config from "@/app/config-api.json";
import styles from "./Elements.module.css";

type SectionColumnMap = {
  item: { label: string; key: keyof SectionElementMap["item"] }[];
  theme: { label: string; key: keyof SectionElementMap["theme"] }[];
  service: { label: string; key: keyof SectionElementMap["service"] }[];
};

interface ElementsProps<S extends Section = Section> {
  actualSection: S;
  elements: SectionElementMap[S][];
  refetch: () => void;
  loading: boolean;
}

export default function Elements<S extends Section>({ actualSection, elements, refetch, loading }: ElementsProps<S>) {
  const [actualId, setActualId] = useState<string | null>(null);
  const [actualName, setActualName] = useState<string | null>(null);
  const [onEditOpen, setEditOpen] = useState<boolean>(false);
  const [onDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<SectionElementMap[Section] | Item | null>(null);
  const [disableBtn, setDisableBtn] = useState(false);
  const { showFeedback } = useFeedback();

  const SECTION_CONFIG: SectionColumnMap = {
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
    ],
    service: [
      { label: "Nome", key: "name" },
      { label: "Preço", key: "price" },
      { label: "Kit", key: "forKit"}
    ],
  };

  const friendlyItemTypes: Record<ItemType, string> = {
    [ItemType.CURTAIN]: "cortina",
    [ItemType.PANEL]: "painel",
    [ItemType.DESSERT_STAND]: "doceiras",
    [ItemType.TABLE]: "mesas",
    [ItemType.RUG]: "carpete",
    [ItemType.EASEL]: "cavalete",
    [ItemType.TABLE_SETTING]: "mesa posta",
  };

  const friendlyServiceKitTypes: Record<string, string> = {
    "SIMPLE": "simples",
    "CYLINDER": "cilindro",
    "ALL": "todos"
  }

  const columns = SECTION_CONFIG[actualSection] as SectionColumnMap[S];

  const getDeleteId = (element: SectionElementMap[Section]) => {
    if ("vid" in element && element.vid) return element.vid;
    return element.id;
  };

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
      const data: Item | SectionElementMap[S] = result.data;

      setEditData(data);
      setEditOpen(true);

    } catch (err) {
      showFeedback("Erro ao editar o item selecionado", "error");
      console.error(err);
    }
    setDisableBtn(false);
  }

  function formatElement(
    value: SectionElementMap[S][keyof SectionElementMap[S]] | null | undefined,
    col: keyof SectionElementMap[S]
  ): string {
    if (value == null) return "-";

    if (actualSection === "item") {
      if (col === "type") {
        return friendlyItemTypes[value as ItemType] ?? "-";
      }

      if (col === "price") {
        return `R$ ${Number(value).toFixed(2)}`;
      }

      return String(value);
    }

    if (actualSection === "theme") {
      return String(value);
    }

    if (actualSection === "service") {
      if (col === "forKit") {
        return friendlyServiceKitTypes[value as string] ?? "-";
      }
      
      return String(value);
    }

    return "-";
  }

  if (loading) return (
    <Loading />
  );


  return (
    <div className={`${styles.container} ${disableBtn ? styles.cursorLoading : ""}`}>
      <div className={`${styles.element} ${styles.header}`}>
        {columns.map(col => (
          <strong key={col.key} className={`${styles.item} ${styles.itemHeader}`}>{col.label}</strong>
        ))}
      </div>

      {elements.map((element: SectionElementMap[S], index) => (
        <div
          key={index}
          className={styles.element}
        >
          {columns.map((col) => {
            const columnKey = col.key as keyof SectionElementMap[S];
            const cellValue = element[columnKey];

            return (
              <p key={`${element.id}-${String(columnKey)}`} className={styles.item}>
                {formatElement(cellValue, columnKey)}
              </p>
            );
          })}

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
              onClick={() => handleDelete(getDeleteId(element), element.name)}
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

      {onEditOpen && editData && (
        <>
          {actualSection === "item" && (
            <CreateUpdateItem
              onClose={() => setEditOpen(false)}
              refetch={refetch}
              initialData={editData as Item}
            />
          )}
          {actualSection === "theme" && (
            <CreateUpdateTheme
              onClose={() => setEditOpen(false)}
              refetch={refetch}
              initialData={editData as SectionElementMap["theme"]}
            />
          )}
          {actualSection === "service" && (
            <CreateUpdateService
              onClose={() => setEditOpen(false)}
              refetch={refetch}
              initialData={editData as SectionElementMap["service"]}
            />
          )}
        </>
      )}
    </div>
  );
}