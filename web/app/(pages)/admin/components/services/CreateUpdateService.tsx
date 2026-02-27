"use client";
import { useState } from "react";
import Image from "next/image";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";
import { ArrowLeftIcon } from "lucide-react";
import type { KitType, Service } from "@/app/types";
import config from "@/app/config-api.json";
import styles from "./CreateUpdateService.module.css";

interface CreateUpdateServiceProps {
  onClose: () => void;
  refetch: () => void;
  initialData: Service | null;
}

export default function CreateUpdateService({ onClose, refetch, initialData }: CreateUpdateServiceProps) {
  const isEdit = !!initialData;

  const [name, setName] = useState<string>(initialData?.name || "");
  const [price, setPrice] = useState<number>(initialData?.price || 0);
  const [icon, setIcon] = useState<string | File | null>(initialData?.icon ?? null);
  const [forKit, setForKit] = useState<KitType | "ALL">("SIMPLE");
  const [error, setError] = useState({
    name: false,
    description: false,
    price: false
  });
  const [priceDisplay, setPriceDisplay] = useState<string>(
    initialData?.price 
      ? initialData.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) 
      : "0,00"
  );
  const [done, setDone] = useState<boolean>(false);

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

  const imagePreview = (() => {
    if (!icon) return null;

    if (typeof icon === "string") {
      return icon;
    }

    return URL.createObjectURL(icon);
  })();

  const handleSendService = async () => {
    if (done) return;
    setDone(true);

    const url = isEdit 
      ? `${config.api_url}/service/${initialData.id}`
      : `${config.api_url}/service/`;    

    const method = isEdit ? "PUT" : "POST";

    try {
      const formData = new FormData();

      if (isEdit && initialData) {
        formData.append("id", initialData.id);
      }

      formData.append("name", name.trim().normalize("NFC").toLowerCase());
      formData.append("price", price.toString());
      formData.append("icon", icon ?? "");
      formData.append("forKit", forKit);

      const res = await fetch(url, {
        method: method,
        body: formData
      })
      .then(res => res.json());

      if (!res.success) throw new Error(res.message);
      
      showFeedback(`Serviço ${isEdit ? 'atualizado' : 'cadastrado'} com sucesso!`, "success")
      refetch();
      onClose();

    } catch (err) {
      showFeedback(`Erro ao ${isEdit ? 'atualizar' : 'cadastrar'} o serviço`, "error");
      console.error(err);

    } finally {
      setDone(false);
    }
  };

  return (
    <div className={`${styles.container} ${done ? styles.cursorLoading : ""}`}>
      <div className={styles.titleWrapper}>
        <button
        title="back"
        type="button"
        className={styles.back}
        onClick={onClose}
        >
          <ArrowLeftIcon size={30} color="white" />
        </button>

        <h2 className={styles.containerTitle}>{isEdit ? "✨Editar Serviço" : "✨Cadastrar Serviço"}</h2>
      </div>

      <div className={styles.itemWrapper}>
        <label className={icon ? styles.hasFile : styles.fileInput}>
          {imagePreview ? (
            <Image 
              src={imagePreview}
              alt="selected image"
              className={styles.userImage}
              width={200}
              height={200}
            />
          ) : "Selecionar ícone"}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;

              if (icon && typeof icon !== "string") {
                URL.revokeObjectURL(URL.createObjectURL(icon));
              }

              setIcon(file);
            }}
          />
        </label>

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

        <div className={styles.lastInputsWrapper}>
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

          <div className={styles.forKitContainer}>
            <label className={styles.label}>Serviço para o kit</label>

            <select name="forKit" id="forKit" className={styles.forKit} value={forKit} onChange={(e) => {
              const value = e.target.value;
              setForKit(value as KitType);
            }}>
              <option value="SIMPLE">Simples</option>
              <option value="CYLINDER">Cilindro</option>
              <option value="ALL">Todos</option>
            </select>
          </div>
        </div>
      </div>

      <button
      type="submit"
      className={`${styles.submitBtn} ${(!name.trim() || !price || !icon || done) ? styles.disabled : ""}`}
      onClick={handleSendService}
      disabled={!name.trim() || !price || !icon || done}
      >
        Salvar Item
      </button>
    </div>
  )
}