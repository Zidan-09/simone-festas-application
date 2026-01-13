"use client";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import type { Address } from "../page";
import styles from "./Address.module.css";

interface AddressProps {
  changePart: (sum: number) => void;
  address: Address;
  setAddress: Dispatch<SetStateAction<Address>>;
}

export default function Address({ changePart, address, setAddress }: AddressProps) {
  const [cepError, setCepError] = useState<boolean>(false);
  const [cepTouched, setCepTouched] = useState<boolean>(false);
  const [cityError, setCityError] = useState<boolean>(false);
  const [cityTouched, setCityTouched] = useState<boolean>(false);
  const [neighborhoodError, setNeighborhoodError] = useState<boolean>(false);
  const [neighborhoodTouched, setNeighborhoodTouched] = useState<boolean>(false);
  const [streetError, setStreetError] = useState<boolean>(false);
  const [streetTouched, setStreetTouched] = useState<boolean>(false);
  const [numberError, setNumberError] = useState<boolean>(false);
  const [numberTouched, setNumberTouched] = useState<boolean>(false);

  return (
    <div className={styles.addressContainer}>
      <h2 className={styles.title}>Realize seu Cadastro!</h2>

      <p className={styles.registerSection}>Por fim seu endereço</p>

      <div className={styles.inputWrapper}>
        <div className={styles.fieldWrapper}>
          <input
            type="cep"
            value={address.cep}
            placeholder="Digite seu cep..."
            className={styles.cep}
            onChange={(e) => {
              const value = e.target.value;
              setAddress({ ...address, cep: Number(value) });
              if (cepTouched) setCepError(value.trim().length < 8);
            }}
            onBlur={() => {
              setCepTouched(true);
              setCepError(address.cep.toString().trim().length < 8);
            }}
          />

          <span className={cepError ? styles.cepError : styles.hide}>Insira um CEP válido!</span>
        </div>
      </div>

      <div className={styles.buttonsWrapper}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => changePart(-1)}
        >
          Voltar
        </button>

        <button
          type="submit"
          className={styles.btn}
        >
          Cadastrar
        </button>
      </div>
    </div>
  )
}