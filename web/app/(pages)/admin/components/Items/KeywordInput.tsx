"use client";
import { useState } from "react";
import { KeyboardEvent } from "react";
import styles from "./KeywordInput.module.css";

interface Props {
  value: string[];
  onChange: (keywords: string[]) => void;
}

export default function KeywordInput({ value, onChange }: Props) {
  const [input, setInput] = useState("");

  const addKeyword = (word: string) => {
    const trimmed = word.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) return;

    onChange([...value, trimmed]);
    setInput("");
  };

  const removeLastKeyword = () => {
    if (value.length === 0) return;

    const last = value[value.length - 1];
    onChange(value.slice(0, -1));
    setInput(last);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      addKeyword(input);
    }

    if (e.key === "Backspace" && input === "") {
      e.preventDefault();
      removeLastKeyword();
    }
  };

  return (
    <div className={styles.wrapper}>
      {value.map((key, index) => (
        <span key={index} className={styles.chip}>
          {key}
          <button
            type="button"
            onClick={() =>
              onChange(value.filter((_, i) => i !== index))
            }
          >
            x
          </button>
        </span>
      ))}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tags de busca"
        className={styles.input}
      />
    </div>
  );
}
