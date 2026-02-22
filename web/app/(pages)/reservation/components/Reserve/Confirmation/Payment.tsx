import { EventSaved } from "@/app/types";
import styles from "./Payment.module.css";

interface PaymentProps {
  reserve: EventSaved | null;
}

export default function Payment({ reserve }: PaymentProps) {
  return (
    <div className={styles.container}>

    </div>
  )
}