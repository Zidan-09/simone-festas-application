"use client";
import { useState, useEffect } from "react";
import { Variant } from "./CreateUpdateItem";
import { Plus, Trash2, Check, X, Pencil } from "lucide-react";
import styles from "./Variants.module.css";
import Image from "next/image";

interface VariantsProps {
  variants: Variant[];
  addVariant: (variant: Variant) => void;
  updateVariant: (index: number, variant: Variant) => void;
  removeVariant: (index: number) => void;
}

export default function Variants({ variants, addVariant, updateVariant, removeVariant }: VariantsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newVariant, setNewVariant] = useState<Variant>({ variant: "", image: null, quantity: 1 });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleConfirmAdd = () => {
    if (newVariant.variant.trim() === "") return;
    addVariant(newVariant);
    setNewVariant({ variant: "", image: null, quantity: 1 });
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (variant: Variant, index: number) => {
    setNewVariant(variant);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleConfirmEdit = () => {
    if (editingIndex === null) return;
    if (newVariant.variant.trim() === "") return;

    updateVariant(editingIndex, newVariant);

    setNewVariant({ variant: "", image: null, quantity: 1 });
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleDeleteVariant = (index: number) => {
    removeVariant(index);
    setNewVariant({ variant: "", image: null, quantity: 1 });
    setEditingIndex(null);
    setIsAdding(false);
  }

  useEffect(() => {
    if (!newVariant.image) {
      setImagePreview(null);
      return;
    }

    if (typeof newVariant.image === "string") {
      setImagePreview(newVariant.image);
      return;
    }

    const objectUrl = URL.createObjectURL(newVariant.image);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [newVariant.image]);

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
              value={newVariant.variant}
              onChange={(e) => setNewVariant({ ...newVariant, variant: e.target.value })}
            />

            <label className={newVariant.image ? styles.hasFile : styles.fileInput}>
              {imagePreview ? (
                <Image 
                src={imagePreview} 
                alt="selected image"
                className={styles.userImage}
                width={200}
                height={200}
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
              value={newVariant.quantity}
              onChange={(e) => setNewVariant({ ...newVariant, quantity: Number(e.target.value) })}
            />
            <div className={styles.actions}>
              <button type="button" title="button" onClick={() => setIsAdding(false)} className={styles.cancelBtn}>
                <X size={25} color="white" />
              </button>

              <button
              type="button"
              title="button"
              onClick={editingIndex !== null ? handleConfirmEdit : handleConfirmAdd}
              className={styles.confirmBtn}
              >
                <Check size={25} color="white" />
              </button>
            </div>
        
          </div>
        )}

        {variants.map((v, index) => (
          <div key={index} className={styles.variantCard}>
            <div className={styles.info}>
              <strong className={styles.variantTitle}>{v.variant}</strong>
              <span>Estoque: {v.quantity}</span>
            </div>

            <div className={styles.buttons}>
              <button title="button" type="button" onClick={() => handleEdit(v, index)} className={styles.editBtn}>
                <Pencil size={16} />
              </button>
              <button title="button" type="button" onClick={() => handleDeleteVariant(index)} className={styles.deleteBtn}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}