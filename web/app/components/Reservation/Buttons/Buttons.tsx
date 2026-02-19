import styles from "./Buttons.module.css"

interface ButtonsProps {
  firstText: string;
  secondText: string;
  firstAction: () => void;
  secondAction: () => void;
  secondDisabled: boolean;
}

export default function Buttons({ firstText, firstAction, secondText, secondAction, secondDisabled}: ButtonsProps) {
  return (
    <div className={styles.buttons}>
      <button
        type="button"
        className={`${styles.button} ${styles.cancel}`}
        onClick={firstAction}
      >
        {firstText}
      </button>

      <button
        type="submit"
        className={`${styles.button} ${secondDisabled ? styles.disabled : styles.next}`}
        disabled={secondDisabled}
        onClick={secondAction}
      >
        {secondText}
      </button>
    </div>
  );
}