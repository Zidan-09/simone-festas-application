"use client";
import { useState } from "react";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";
import { ArrowLeftIcon } from "lucide-react";
import { ItemTypes } from "@/app/lib/utils/item/itemTypes";
import Variants from "./Variants";
import config from "@/app/config-api.json";
import styles from './CreateUpdateItem.module.css';

export type Variant = { id?: string, variant: string, image: File | string | null, quantity: number };

interface CreateUpdateItemProps {
  onClose: () => void;
  refetch: () => void;
  initialData?: any;
}

export default function CreateUpdateItem({ onClose, refetch, initialData }: CreateUpdateItemProps) {
  const isEdit = !!initialData;

  const [name, setName] = useState<string>(initialData?.name || "");
  const [type, setType] = useState<ItemTypes>(initialData?.type || ItemTypes.CURTAIN);
  const [description, setDescription] = useState<string>(initialData?.description || "");
  const [price, setPrice] = useState<number>(initialData?.price || 0);
  const [error, setError] = useState({
    name: false,
    description: false,
    price: false
  });
  const [done, setDone] = useState<boolean>(false);

  const [priceDisplay, setPriceDisplay] = useState<string>(
    initialData?.price 
      ? initialData.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) 
      : "0,00"
  );

  const [variants, setVariants] = useState<Variant[]>(initialData?.variants || []);

  const { showFeedback } = useFeedback();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    
    const numberValue = Number(value);
    
    const formatted = (numberValue / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setPriceDisplay(formatted);
    setPrice(numberValue / 100);
    setError(prev => ({ ...prev, price: numberValue / 100 === 0 }))
  };

  const addVariant = (variant: Variant) => {
    setVariants(prev => ([...prev, variant]));
  }

  const updateVariant = (index: number, updatedVariant: Variant) => {
    setVariants(prev => {
      const newVariants = [...prev];
      newVariants[index] = updatedVariant;
      return newVariants;
    });
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendItem = async () => {
    if (done) return null;
    setDone(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("type", String(type));
    formData.append("price", price.toString());

    const variantsPayload = variants.map((variant, index) => {
      const isNewFile = variant.image instanceof File;

      if (isNewFile && variant.image) formData.append(`variant-image-${index}`, variant.image);

      return {
        id: variant.id,
        variant: variant.variant,
        quantity: variant.quantity,
        image: isNewFile ? `variant-image-${index}` : variant.image,
        isNewImage: isNewFile
      };
    });

    formData.append("variants", JSON.stringify(variantsPayload));

    const url = isEdit 
      ? `${config.api_url}/item/${initialData.id}`
      : `${config.api_url}/item/`;    

    const method = isEdit ? "PUT" : "POST";

    try {
      await fetch(url, {
        method: method,
        body: formData
      });

      
      showFeedback(`Item ${isEdit ? 'atualizado' : 'cadastrado'} com sucesso!`, "success")
      refetch();

    } catch (err) {
      showFeedback(`Erro ao ${isEdit ? 'atualizar' : 'cadastrar'} o item`, "error");
      console.error(err);
    }
    onClose();
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <button
        title="back"
        type="button"
        className={styles.back}
        onClick={onClose}
        >
          <ArrowLeftIcon size={30} color="white" />
        </button>

        <h2 className={styles.createItemTitle}>{isEdit ? "✨Editar Item" : "✨Cadastrar Item"}</h2>
      </div>

      <div className={styles.containerWrapper}>
        <div className={styles.itemWrapper}>
          <div className={styles.nameTypeWrapper}>
            <input
            type="text"
            className={`${styles.name} ${error.name ? styles.error : ""}`}
            placeholder="Nome do item (ex: Vaso de Vidro)..."
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              setName(value);
              setError(prev => ({ ...prev, name: !value.trim() }))
            }}
            />
            
            <select
            title="type"
            name="type"
            value={type}
            onChange={(e) => {
              const value = e.target.value;
              setType(value as ItemTypes);
            }}
            >
              <option value={ItemTypes.CURTAIN}>Cortina</option>
              <option value={ItemTypes.DESSERT_STAND}>Doceira</option>
              <option value={ItemTypes.EASEL}>Cavalete</option>
              <option value={ItemTypes.PANEL}>Painel</option>
              <option value={ItemTypes.RUG}>Carpete</option>
              <option value={ItemTypes.TABLE}>Mesa</option>
            </select>
          </div>
          
          <textarea 
            name="description" 
            className={`${styles.description} ${error.description ? styles.error : ""}`} 
            placeholder="Descreva os detalhes do item para facilitar a busca..."
            value={description}
            onChange={(e) => {
              const value = e.target.value;
              setDescription(value);
              setError(prev => ({ ...prev, description: !value.trim() }))
            }}
          ></textarea>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Valor do aluguel</label>
            <div className={styles.priceWrapper}>
              <span className={styles.currencyPrefix}>R$</span>
              <input 
                type="text" 
                className={`${styles.price} ${error.price ? styles.error : ""}`} 
                value={priceDisplay}
                onChange={handlePriceChange}
                placeholder="0,00"
              />
            </div>
          </div>
        </div>  

        <div className={styles.variantWrapper}>
          <Variants
          variants={variants}
          addVariant={addVariant}
          updateVariant={updateVariant}
          removeVariant={removeVariant}
          />
        </div>
      </div>
      
      <button
      type="submit"
      className={`${styles.submitBtn} ${(variants.length === 0 || done) ? styles.disabled : ""}`}
      onClick={handleSendItem}
      disabled={variants.length === 0}
      >
        Salvar Item
      </button>
    </div>
  );
}