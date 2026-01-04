"use client";
import { useState, useEffect } from "react";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";
import { ThemeCategory } from "@/app/lib/utils/theme/themeCategory";
import { ItemTypes } from "@/app/lib/utils/item/itemTypes";
import { ArrowLeftIcon, ImagePlus, X, Plus, Search } from "lucide-react";
import config from "@/app/config-api.json";
import styles from "./CreateUpdateTheme.module.css";

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
  id: string;
  url: string | File;
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

  const [dbItems, setDbItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = useState({
    name: false,
    mainImage: false
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { showFeedback } = useFeedback();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${config.api_url}/items`);
        const data = await res.json();
        setDbItems(data);
      } catch (err) {
        console.error("Erro ao carregar itens", err);
      }
    };
    fetchItems();
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
        id: Math.random().toString(36).substr(2, 9),
        url: file
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeSecondaryImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const toggleItemSelection = (item: Item) => {
    const isSelected = items.find(i => i.id === item.id);
    if (isSelected) {
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setItems(prev => [...prev, item]);
    }
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
      const isNewFile = image.url instanceof File;
      if (isNewFile) formData.append(`image-${index}`, image.url);
      return {
        id: image.id,
        url: isNewFile ? "" : image.url,
        isNewImage: isNewFile
      };
    });

    formData.append("images", JSON.stringify(imagesPayload));
    formData.append("items", JSON.stringify(items.map(i => i.id))); // Envia apenas os IDs dos itens

    const url = isEdit ? `${config.api_url}/theme/${initialData.id}` : `${config.api_url}/theme/`;
    const method = isEdit ? "PUT" : "POST";

    try {
      await fetch(url, { method, body: formData });
      showFeedback(`Tema ${isEdit ? 'atualizado' : 'cadastrado'} com sucesso!`, "success");
      refetch();
      onClose();
    } catch (err) {
      showFeedback(`Erro ao ${isEdit ? 'atualizar' : 'cadastrar'} o tema`, "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredSearch = dbItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h2 className={styles.createItemTitle}>{isEdit ? "✨Editar Tema" : "✨Cadastrar Tema"}</h2>
      </div>

      <div className={styles.containerWrapper}>
        <div className={styles.itemWrapper}>
          <div className={styles.nameTypeWrapper}>
            <input
              type="text"
              className={`${styles.name} ${error.name ? styles.error : ""}`}
              placeholder="Nome do tema..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(p => ({ ...p, name: false }));
              }}
            />
            <select
            title="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ThemeCategory)}
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
                  <img src={img.url instanceof File ? URL.createObjectURL(img.url) : (img.url as string)} alt="galeria" />
                  <button
                  type="button"
                  title="remove"
                  onClick={() => removeSecondaryImage(img.id)}
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

        <div className={styles.variantWrapper}>
          <label className={styles.label}>Itens do Tema</label>
          <div className={styles.searchContainer}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar item no banco..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.itemsList}>
            {searchTerm && (
               <div className={styles.searchResults}>
                 {filteredSearch.map(item => (
                   <div key={item.id} className={styles.itemRow} onClick={() => toggleItemSelection(item)}>
                     <span>{item.name}</span>
                     <Plus size={16} />
                   </div>
                 ))}
               </div>
            )}
            
            <div className={styles.selectedItemsList}>
               <p className={styles.miniTitle}>Itens selecionados ({items.length}):</p>
               <div className={styles.tagsContainer}>
                 {items.map(item => (
                   <div key={item.id} className={styles.tag}>
                     {item.name}
                     <X size={14} onClick={() => toggleItemSelection(item)} />
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className={`${styles.submitBtn} ${loading ? styles.disabled : ""}`}
        onClick={handleSendTheme}
        disabled={loading}
      >
        {isEdit ? "Atualizar Tema" : "Salvar Tema"}
      </button>
    </div>
  );
}