"use client";
import { useState } from "react";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";
import { ThemeCategory } from "@/app/lib/utils/theme/themeCategory";
import { ArrowLeftIcon, ImagePlus, X, Plus } from "lucide-react";
import KeywordInput from "@/app/components/KeywordInput/KeywordInput";
import type { Theme } from "@/app/types";
import Image from "next/image";
import config from "@/app/config-api.json";
import styles from "./CreateUpdateTheme.module.css";

type ErrorState = {
  name: boolean;
  mainImage: boolean;
};

type ExistingImage = {
  kind: "existing";
  id: string;
  url: string;
  themeId: string;
};

type NewImage = {
  kind: "new";
  file: File;
};

type ThemeImage = ExistingImage | NewImage;

interface CreateUpdateThemeProps {
  onClose: () => void;
  refetch: () => void;
  initialData: Theme | null;
}

export default function CreateUpdateTheme({ onClose, refetch, initialData }: CreateUpdateThemeProps) {
  const isEdit = !!initialData;

  const [name, setName] = useState<string>(initialData?.name || "");
  const [mainImage, setMainImage] = useState<ThemeImage | null>(
    initialData
      ? { kind: "existing", url: initialData.mainImage, id: "main", themeId: initialData.id }
      : null
  );

  const [category, setCategory] = useState(initialData?.category || ThemeCategory.KIDS);

  const [images, setImages] = useState<ThemeImage[]>(
    initialData?.images?.map(img => ({
      kind: "existing",
      ...img,
    })) ?? []
  );

  const [keywords, setKeywords] = useState<string[]>(initialData?.keyWords || []);

  const [error, setError] = useState<ErrorState>({
    name: false,
    mainImage: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { showFeedback } = useFeedback();

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainImage({ kind: "new", file });
  };

  const handleAddSecondaryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newImages: ThemeImage[] = Array.from(e.target.files).map(file => ({
      kind: "new",
      file,
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeSecondaryImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendTheme = async () => {
    if (loading) return;
    if (!name.trim()) return setError(prev => ({ ...prev, name: true }));

    if (!mainImage) {
      setError(prev => ({ ...prev, mainImage: true }));
      return;
    }

    setLoading(true);
    const formData = new FormData();

    formData.append("name", name);
    formData.append("category", category);
    formData.append("keyWords", JSON.stringify(keywords));

    if (mainImage?.kind === "new") {
      formData.append("mainImageFile", mainImage.file);
      formData.append("mainImage", JSON.stringify({ isNewImage: true }));
      
    } else if (mainImage?.kind === "existing") {
      formData.append("mainImage", JSON.stringify(mainImage));
    }

    const imagesPayload = images.map((image, index) => {
      if (image.kind === "new") {
        formData.append(`image-${index}`, image.file);

        return {
          key: `image-${index}`,
          isNewImage: true,
        };
      }

      return {
        id: image.id,
        url: image.url,
        isNewImage: false,
      };
    });

    formData.append("images", JSON.stringify(imagesPayload));

    const url = isEdit ? `${config.api_url}/theme/${initialData.id}` : `${config.api_url}/theme/`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: formData }).then(res => res.json());

      if (!res.success) throw new Error(res.message);

      showFeedback(`Tema ${isEdit ? 'atualizado' : 'cadastrado'} com sucesso!`, "success");
      refetch();
      onClose();

    } catch {
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
            <div className={`${styles.mainImageDropzone} ${error.mainImage ? styles.error : ""}`}>
              {mainImage ? (
                <div className={styles.previewMain}>
                  <Image
                    src={
                      mainImage.kind === "existing"
                        ? mainImage.url
                        : URL.createObjectURL(mainImage.file)
                    }
                    alt="principal"
                    fill
                  />

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
              {images.map((img, index) => (
                <div key={index} className={styles.thumb}>
                  <Image
                    src={
                      img.kind === "existing"
                        ? img.url
                        : URL.createObjectURL(img.file)
                    }
                    alt="galeria"
                    fill
                  />

                  <button
                  type="button"
                  title="remove"
                  onClick={() => removeSecondaryImage(index)}
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
        <div>
          <KeywordInput
            value={keywords}
            onChange={(keywords) => setKeywords(keywords)}
          />
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