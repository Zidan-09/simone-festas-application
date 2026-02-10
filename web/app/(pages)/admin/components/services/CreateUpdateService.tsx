"use client";
import { useState } from "react";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";
import { ArrowLeftIcon } from "lucide-react";
import type { Service } from "@/app/types";
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

  const handleSendService = async () => {
    if (done) return;
    setDone(true);

    const url = isEdit 
      ? `${config.api_url}/service/${initialData.id}`
      : `${config.api_url}/service/`;    

    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        body: JSON.stringify({
          name: name.trim().normalize("NFC").toLowerCase(),
          price
        })
      })
      .then(res => res.json());

      if (!res.success) throw new Error(res.message);
      
      showFeedback(`Item ${isEdit ? 'atualizado' : 'cadastrado'} com sucesso!`, "success")
      refetch();
      onClose();

    } catch (err) {
      showFeedback(`Erro ao ${isEdit ? 'atualizar' : 'cadastrar'} o item`, "error");
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

      <button
      type="submit"
      className={`${styles.submitBtn} ${(!name.trim() || !price || done) ? styles.disabled : ""}`}
      onClick={handleSendService}
      disabled={!name.trim() || !price || done}
      >
        Salvar Item
      </button>
    </div>
  )
}