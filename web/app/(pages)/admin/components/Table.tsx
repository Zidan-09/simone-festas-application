"use client";
import { useState, useEffect } from "react";
import { useGetElements } from "@/app/hooks/admin/useGetElements";
import { useSearch } from "@/app/hooks/search/useSearch";
import { PlusCircle } from "lucide-react";
import Elements from "./Elements";
import CreateUpdateItem from "./Items/CreateUpdateItem";
import CreateUpdateTheme from "./themes/CreateUpdateTheme";
import CreateUpdateService from "./services/CreateUpdateService";
import SearchBar from "@/app/components/Search/SearchBar";
import { ItemTypes } from "@/app/lib/utils/item/itemTypes";
import config from "@/app/config-api.json";
import styles from "./Table.module.css";
import { ThemeCategory } from "@/app/lib/utils/theme/themeCategory";

export type Themes = {
  keyWords: string[];
  images: {
      id: string;
      url: string;
      themeId: string;
  }[];
  id: string;
  name: string;
  mainImage: string;
  category: ThemeCategory;
  createdAt: Date | null;
}

export type Items = {
  id: string;
  name: string;
  description: string;
  type: ItemTypes;
  price: number;
  vid: string;
  variant: string;
  image: string;
  quantity: number;
  keywords: string[];
}

export type Service = {
  id: string;
  name: string;
  price: number;
}

export type Variant = {
  variant: string | null;
  image: string | null;
  quantity: number;
  id: string;
  itemId: string;
  keyWords: string[];
}

export type ItemRaw = {
  name: string;
  type: ItemTypes;
  description: string;
  price: number;
  id: string;
  createdAt: Date | null;
  variants: Variant[]
}

export type Section = "item" | "theme" | "service";

export type SectionElementMap = {
  item: Items;
  theme: Themes;
  service: Service;
}

const createComponentMap = {
  item: CreateUpdateItem,
  theme: CreateUpdateTheme,
  service: CreateUpdateService,
};

interface TableProps {
  actualSection: Section;
}

export default function Table({ actualSection }: TableProps) {
  const { elements, refetch, loading } = useGetElements<SectionElementMap[typeof actualSection]>(actualSection);
  const { searching, results, search } = useSearch<SectionElementMap[typeof actualSection]>(`${config.api_url}/${actualSection}/search`);
  const [createOpen, setCreateOpen] = useState(false);
  const CreateComponent = createComponentMap[actualSection];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCreateOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.buttonWrapper}>
        <span>{actualSection}</span>

        <SearchBar
          onSearch={search}
        />

        <button
        type="button"
        className={styles.button}
        onClick={() => setCreateOpen(!createOpen)}
        >
          <PlusCircle size={20} />
          Cadastrar
        </button>
      </div>

      <div className={styles.table}>
        <Elements
          actualSection={actualSection}
          elements={searching ? results : elements}
          refetch={refetch}
          loading={loading}
        />
      </div>

      {createOpen && CreateComponent && (
        <div className={styles.overlay} >
          <CreateComponent
          onClose={() => setCreateOpen(false)}
          refetch={refetch}
          initialData={null}
          />
        </div>
      )}
    </div>
  )
};