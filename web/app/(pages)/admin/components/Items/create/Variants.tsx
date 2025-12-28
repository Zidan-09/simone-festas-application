"use client";
import { useState } from "react";
import { Variant } from "./CreateItem";
import { Plus, Trash2, Check, X } from "lucide-react";
import styles from "./Variants.module.css";
import Image from "next/image";

interface VariantsProps {
  variants: Variant[];
  addVariant: (variant: Variant) => void;
  removeVariant: (index: number) => void;
}

export default function Variants({ variants, addVariant, removeVariant }: VariantsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newVariant, setNewVariant] = useState<Variant>({ color: "", image: null, stockQuantity: 1 });

  const handleConfirmAdd = () => {
    if (newVariant.color.trim() === "") return;
    addVariant(newVariant);
    setNewVariant({ color: "", image: null, stockQuantity: 1 });
    setIsAdding(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Variações ({variants.length})</h3>
        {!isAdding && (
          <button type="button" className={styles.addBtn} onClick={() => setIsAdding(true)}>
            <Plus size={18} /> Adicionar
          </button>
        )}
      </div>

      <div className={styles.variantsGrid}>
        {isAdding && (
          <div className={styles.addCard}>
            <input
              autoFocus
              placeholder="Cor/Material"
              value={newVariant.color}
              onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
            />

            <label className={newVariant.image ? styles.hasFile : styles.fileInput}>
              {newVariant.image ? (
                <Image 
                src={URL.createObjectURL(newVariant.image)} 
                alt="selected image" 
                className={styles.userImage}
                width={10}
                height={10}
                />
              ) : "Selecionar imagem"}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setNewVariant({ ...newVariant, image: file });
                }}
              />
            </label>

           
            <input
              type="number"
              title="Estoque"
              min="1"
              value={newVariant.stockQuantity}
              onChange={(e) => setNewVariant({ ...newVariant, stockQuantity: Number(e.target.value) })}
            />
            <div className={styles.actions}>
              <button type="button" title="button" onClick={() => setIsAdding(false)} className={styles.cancelBtn}>
                <X size={25} color="white" />
              </button>

              <button type="button" title="button" onClick={handleConfirmAdd} className={styles.confirmBtn}>
                <Check size={25} color="white" />
              </button>
            </div>
        
          </div>
        )}

        {variants.map((v, index) => (
          <div key={index} className={styles.variantCard}>
            <div className={styles.info}>
              <strong className={styles.variantTitle}>{v.color}</strong>
              <span>Estoque: {v.stockQuantity}</span>
            </div>
            <button title="button" type="button" onClick={() => removeVariant(index)} className={styles.deleteBtn}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}