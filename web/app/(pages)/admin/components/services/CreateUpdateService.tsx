"use client";
import { useState, useEffect } from "react";
import styles from "./CreateUpdateService.module.css";

interface CreateUpdateServiceProps {
  onClose: () => void;
  refetch: () => void;
  initialData?: any;
}

export default function CreateUpdateService({ onClose, refetch, initialData }: CreateUpdateServiceProps) {
  return (
    <div className={styles.container}>
      Em breve
    </div>
  )
}