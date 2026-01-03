"use client";
import { useState } from "react";
import config from "@/app/config-api.json";
import styles from "./DeletePopup.module.css";

interface DeletePopupProps {
  actualSection: string;
  id: string | null;
  name: string | null;
  onClose: () => void;
  refetch: () => void;
};

export default function DeletePopup({ actualSection, id, name, onClose, refetch }: DeletePopupProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return null;
    setIsDeleting(true);

    try {
      await fetch(`${config.api_url}/${actualSection}/variant/${id}`, {
        method: "DELETE"
      }).then(res => res.json());

    } catch (err) {
      console.error(err);
    }
    onClose();
    refetch();
    setIsDeleting(false);
  }

  return (
    <div className={`${styles.container} ${isDeleting ? styles.cursorLoading : ""}`}>

      <p className={styles.text}>Tem certeza que gostaria de deletar: <br/> <strong className={styles.name}>{name}</strong>?</p>

      <div className={styles.buttons}>
        <button
          className={styles.cancel}
          onClick={onClose}
        ><p className={styles.textBtn}>Cancelar</p></button>
        <button
          className={isDeleting ? styles.disabled : styles.delete}
          onClick={handleDelete}
          disabled={isDeleting}
        ><p className={styles.textBtn}>Deletar</p></button>
      </div>
    </div>
  )
};