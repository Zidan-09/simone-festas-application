"use client";
import { useState, useEffect } from "react";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";
import { useSearch } from "@/app/hooks/search/useSearch";
import SearchBar from "@/app/components/Search/SearchBar";
import { ThemeCategory } from "@/app/lib/utils/theme/themeCategory";
import { ItemTypes } from "@/app/lib/utils/item/itemTypes";
import { ArrowLeftIcon, ImagePlus, X, Plus, Search } from "lucide-react";
import config from "@/app/config-api.json";
import styles from "./CreateUpdateTheme.module.css";
import Image from "next/image";

type Item = {
  id: string;
  name: string;
  description: string;
  type: ItemTypes;
  price: number;
  vid: string;
  variant: string;
  image: string;
  quantity: number;
}

type Image = {
  id?: string;
  image: string | File;
}

interface CreateUpdateThemeProps {
  onClose: () => void;
  refetch: () => void;
  initialData?: any;
}

export default function CreateUpdateTheme({ onClose, refetch, initialData }: CreateUpdateThemeProps) {
  const isEdit = !!initialData;

  const [name, setName] = useState<string>(initialData?.name || "");
  const [mainImage, setMainImage] = useState<File | string | null>(initialData?.mainImage || null);
  const [category, setCategory] = useState(initialData?.category || ThemeCategory.KIDS);

  const [images, setImages] = useState<Image[]>(initialData?.images || []);
  const [items, setItems] = useState<Item[]>(initialData?.items || []);

  const [error, setError] = useState({
    name: false,
    mainImage: false
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { searching, results, search } = useSearch<Item>(`${config.api_url}/item/search`);
  const [initialItems, setInitialItems] = useState<Item[]>([]);
  const { showFeedback } = useFeedback();

  const itemsToRender = searching ? results : initialItems;

  useEffect(() => {
    async function getItems() {
      const result = await fetch(`${config.api_url}/item`).then(res => res.json());
      const data = (result.data as Item[]).slice(0, 10);
      setInitialItems(data);
    }
    getItems();
  }, []);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  const handleAddSecondaryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages: Image[] = files.map(file => ({
        image: file
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeSecondaryImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const toggleItemSelection = (item: Item) => {
    const exists = items.some(i => i.vid === item.vid);

    if (exists) return setItems(prev => prev.filter(i => i.vid !== item.vid));
 
    return setItems(prev => [...prev, item]);
  };

  const handleSendTheme = async () => {
    if (loading) return;
    if (!name.trim()) return setError(prev => ({ ...prev, name: true }));

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);

    if (mainImage instanceof File) {
      formData.append("mainImageFile", mainImage);
      formData.append("mainImage", JSON.stringify({ isNew: true }));
    } else {
      formData.append("mainImage", JSON.stringify(mainImage));
    }

    const imagesPayload = images.map((image, index) => {
      const isNewFile = image.image instanceof File;
      if (isNewFile) formData.append(`image-${index}`, image.image);
      return {
        id: image.id,
        key: isNewFile ? `image-${index}` : null,
        url: isNewFile ? "" : image.image,
        isNewImage: isNewFile
      };
    });

    formData.append("images", JSON.stringify(imagesPayload));
    formData.append("items", JSON.stringify(items.map(i => i.vid)));

    const url = isEdit ? `${config.api_url}/theme/${initialData.id}` : `${config.api_url}/theme/`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: formData }).then(res => res.json());

      if (!res.ok) throw new Error(res.message);

      showFeedback(`Tema ${isEdit ? 'atualizado' : 'cadastrado'} com sucesso!`, "success");
      refetch();
      onClose();
    } catch (err) {
      showFeedback(`Erro ao ${isEdit ? 'atualizar' : 'cadastrar'} o tema`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${loading ? styles.cursorLoading : ""}`}>
      <div className={styles.titleWrapper}>
        <button
        title="back"
        type="button"
        className={styles.back}
        onClick={onClose}
        >
          <ArrowLeftIcon size={30} color="white" />
        </button>
        <h2 className={styles.createThemeTitle}>{isEdit ? "✨Editar Tema" : "✨Cadastrar Tema"}</h2>
      </div>

      <div className={styles.containerWrapper}>
        <div className={styles.themeWrapper}>
          <div className={styles.nameTypeWrapper}>
            <input
              type="text"
              className={`${styles.name} ${error.name ? styles.error : ""}`}
              placeholder="Nome do tema..."
              value={name}
              onChange={(e) => {
                const value = e.target.value;
                setName(value);
                setError(prev => ({ ...prev, name: !value.trim() }));
              }}
            />
            <select
            title="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ThemeCategory)}
            className={styles.category}
            >
              <option value={ThemeCategory.KIDS}>Infantil</option>
              <option value={ThemeCategory.ADULTS}>Adulto</option>
              <option value={ThemeCategory.HOLIDAYS}>Feriados</option>
              <option value={ThemeCategory.SPECIAL_EVENTS}>Eventos Especiais</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Imagem Principal (Thumbnail)</label>
            <div className={styles.mainImageDropzone}>
              {mainImage ? (
                <div className={styles.previewMain}>
                   <img src={mainImage instanceof File ? URL.createObjectURL(mainImage) : (mainImage as any)} alt="principal" />
                   <button
                   type="button"
                   title="remove"
                   onClick={() => setMainImage(null)}><X size={16}/></button>
                </div>
              ) : (
                <label className={styles.uploadLabel}>
                  <ImagePlus size={30} />
                  <span>Selecionar Capa</span>
                  <input type="file" hidden onChange={handleMainImageChange} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Imagens Galeria</label>
            <div className={styles.secondaryGrid}>
              {images.map((img) => (
                <div key={img.id} className={styles.thumb}>
                  <img src={img.image instanceof File ? URL.createObjectURL(img.image) : (img.image as string)} alt="galeria" />
                  <button
                  type="button"
                  title="remove"
                  onClick={() => removeSecondaryImage(img.id!)}
                  ><X size={14}/></button>
                </div>
              ))}
              <label className={images.length < 4 ? styles.addThumb : styles.full}>
                <Plus color="gray"/>
                <input type="file" multiple hidden onChange={handleAddSecondaryImages} accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        <div className={styles.itemsWrapper}>
          <label className={styles.label}>Itens do Tema</label>
          <SearchBar
          onSearch={search}
          />

          <div className={styles.itemsList}>
            <div className={styles.itemResults}>
              {itemsToRender.map(item => (
                <div
                  key={item.vid}
                  className={styles.itemCard}
                  onClick={() => toggleItemSelection(item)}
                >
                  <img
                    src={item.image}
                    alt="item-image"
                    className={styles.itemImage}
                  />
                  <span className={styles.itemName}>
                    {item.name}-{item.variant}
                  </span>
                </div>
              ))}
            </div>
            
            <div className={styles.selectedItemsList}>
               <p className={styles.miniTitle}>Itens selecionados ({items.length}):</p>
               <div className={styles.tagsContainer}>
                 {items.map(item => (
                   <div key={item.vid} className={styles.tag} onClick={() => toggleItemSelection(item)}>
                     <img
                     src={item.image}
                     alt="item-image"
                     className={styles.itemImage}
                     />
                     <span
                     className={styles.itemName}
                     >{item.name}-{item.variant}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className={`${styles.submitBtn} ${loading || !name.trim() || !mainImage ? styles.disabled : ""}`}
        onClick={handleSendTheme}
        disabled={loading || !name.trim() || !mainImage}
      >
        {isEdit ? "Atualizar Tema" : "Salvar Tema"}
      </button>
    </div>
  );
}