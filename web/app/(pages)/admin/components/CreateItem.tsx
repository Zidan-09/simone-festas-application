"use client";
import { useState } from "react";
import { ItemTypes } from "@/app/lib/utils/item/itemTypes";
import config from "@/app/config.json";
import styles from './CreateItem.module.css';

export default function CreateItem() {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<ItemTypes>();
  const [description, setDescription] = useState<string>("");
  const [priceDisplay, setPriceDisplay] = useState<string>("0,00");
  const [price, setPrice] = useState<number>(0);

  const [variants, setVariants] = useState([
    { color: "", image: "", stockQuantity: 1 }
  ]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    
    const numberValue = Number(value);
    
    const formatted = (numberValue / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setPriceDisplay(formatted);
    setPrice(numberValue / 100);
  };

  const handleCreateItem = async () => {
    const test = {
      main: {
        name: name,
        description: description,
        type: type,
        price: price
      },
      variants: variants
    }

    console.log(test)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.createItemTitle}>✨Cadastrar Item</h2>
      
      <input
      type="text"
      className={styles.name}
      placeholder="Nome do item (ex: Vaso de Vidro)..."
      onChange={(e) => setName(e.target.value)}
      />
      
      <select
      title="type"
      name="type"
      value={type}
      onChange={(e) => setType(e.target.value as ItemTypes)}
      >
        <option value="" disabled selected>Selecione o tipo...</option>
        <option value={ItemTypes.CURTAIN}>Cortina</option>
        <option value={ItemTypes.DESSERT_STAND}>Doceira</option>
        <option value={ItemTypes.EASEL}>Cavalete</option>
        <option value={ItemTypes.PANEL}>Painel</option>
        <option value={ItemTypes.RUG}>Carpete</option>
        <option value={ItemTypes.TABLE}>Mesa</option>
      </select>
      
      <textarea 
        name="description" 
        className={styles.description} 
        placeholder="Descreva os detalhes do item para facilitar a busca..."
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>Valor do aluguel</label>
        <div className={styles.priceWrapper}>
          <span className={styles.currencyPrefix}>R$</span>
          <input 
            type="text" 
            className={styles.price} 
            value={priceDisplay}
            onChange={handlePriceChange}
            placeholder="0,00"
          />
        </div>
      </div>

      <div>

      </div>
      
      <button
      type="submit"
      className={styles.submitBtn}
      onClick={handleCreateItem}
      >
        Salvar Item
      </button>
    </div>
  );
}