"use client";
import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { ItemTypes } from "@/app/lib/utils/item/itemTypes";
import config from "@/app/config.json";
import styles from './CreateItem.module.css';
import Variants from "./Variants";

export type Variant = { color: string, image: File | null, stockQuantity: number };

interface CreateItemProps {
  closePopup: () => void;
}

export default function CreateItem({ closePopup }: CreateItemProps) {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<ItemTypes>(ItemTypes.CURTAIN);
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [priceDisplay, setPriceDisplay] = useState<string>("0,00");
  const [error, setError] = useState({
    name: false,
    description: false,
    price: false
  });

  const [variants, setVariants] = useState<Variant[]>([]);

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

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateItem = async () => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("type", String(type));
    formData.append("price", price.toString());
    
    const variantsPayload = variants.map((variant, index) => {
      if (variant.image) {
        formData.append(`variant-image-${index}`, variant.image);
      }

      return {
        color: variant.color,
        stockQuantity: variant.stockQuantity,
        imageKey: `variant-image-${index}`,
      };
    });

    formData.append("variants", JSON.stringify(variantsPayload));

    try {
      await fetch(`${config.api_url}/item/`, {
        method: "POST",
        body: formData
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <button
        title="back"
        type="button"
        className={styles.back}
        onClick={closePopup}
        >
          <ArrowLeftIcon size={30} color="white" />
        </button>

        <h2 className={styles.createItemTitle}>✨Cadastrar Item</h2>
      </div>

      <div className={styles.containerWrapper}>
        <div className={styles.itemWrapper}>
          <div className={styles.nameTypeWrapper}>
            <input
            type="text"
            className={`${styles.name} ${error.name ? styles.error : ""}`}
            placeholder="Nome do item (ex: Vaso de Vidro)..."
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
          removeVariant={removeVariant}
          />
        </div>
      </div>
      
      <button
      type="submit"
      className={`${styles.submitBtn} ${variants.length === 0 ? styles.disabled : ""}`}
      onClick={handleCreateItem}
      disabled={variants.length === 0}
      >
        Salvar Item
      </button>
    </div>
  );
}