import styles from "./Filter.module.css";

interface FilterProps {
  isOpen: boolean;
}

export default function Filter({ isOpen }: FilterProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.container}>

    </div>
  )
}