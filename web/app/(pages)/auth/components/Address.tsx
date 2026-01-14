"use client";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import type { Address } from "../page";
import styles from "./Address.module.css";

interface AddressProps {
  changePart: (sum: number) => void;
  address: Address;
  setAddress: Dispatch<SetStateAction<Address>>;
  submit: () => Promise<boolean>;
}

export default function Address({ changePart, address, setAddress, submit }: AddressProps) {
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

  const [searchingCep, setSearchingCep] = useState<boolean>(false);
  const [cepValid, setCepValid] = useState<boolean>(false);

  const [blockAll, setBlockAll] = useState<boolean>(false);

  async function searchCep(cep: string) {
    setSearchingCep(true);

    try {
      const data = await fetch(`https://viacep.com.br/ws/${cep}/json/`).then(res => res.json());

      if (data.erro) throw new Error("Invalid CEP");
      
      setCepValid(true);

      setAddress(prev => ({
        ...prev,
        city: data.localidade,
        neighborhood: data.bairro,
        street: data.logradouro
      }));

      setCityError(false);
      setNeighborhoodError(false);
      setStreetError(false);

    } catch (err) {
      console.error(err);
      setCepError(true);
      setCepValid(false);

    } finally {
      setSearchingCep(false);
    };
  };

  function maskCep(value: string) {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length === 0) return "";

    if (numbers.length <= 5) return numbers;

    if (numbers.length === 8) searchCep(numbers);

    if (numbers.length < 8) setCepValid(false);

    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  }

  return (
    <div className={styles.addressContainer}>
      <h2 className={styles.title}>Realize seu Cadastro!</h2>

      <p className={styles.registerSection}>Por fim seu endereço</p>

      <div className={styles.inputWrapper}>
        <div className={styles.fieldWrapper}>
          <label
          htmlFor="cep"
          className={cepError ? styles.cepError : styles.label}
          >
            Digite seu cep*
          </label>

          <input
            type="text"
            name="cep"
            value={address.cep}
            placeholder="Ex: 12345-678"
            className={cepError ? styles.cepInputError : styles.input}
            onChange={(e) => {
              const value = e.target.value;
              setAddress({ ...address, cep: maskCep(value) });
              if (cepTouched) setCepError(value.trim().length < 8);
            }}
            onBlur={() => {
              setCepTouched(true);
              setCepError(address.cep.toString().trim().length < 8);
            }}
          />
        </div>

        <div className={styles.generalWrapper}>
          <div className={styles.fieldWrapper}>
            <label
            htmlFor="city"
            className={cityError ? styles.cityError : styles.label}
            >
              Digite sua cidade*
            </label>

            <input
              type="text"
              name="city"
              value={address.city}
              placeholder="Ex: Parnaíba"
              className={cityError ? styles.cityInputError : styles.input}
              onChange={(e) => {
                const value = e.target.value;
                setAddress({ ...address, city: value });
                if (cityTouched) setCityError(!value.trim());
              }}
              onBlur={() => {
                setCityTouched(true);
                setCityError(!address.city.trim());
              }}
              disabled={ searchingCep || cepValid }
            />
          </div>

          <div className={styles.fieldWrapper}>
            <label
            htmlFor="neighborhood"
            className={neighborhoodError ? styles.neighborhoodError : styles.label}
            >
              Digite seu bairro*
            </label>

            <input
              type="text"
              name="neighborhood"
              value={address.neighborhood}
              placeholder="Ex: Dirceu"
              className={neighborhoodError ? styles.neighborhoodInputError : styles.input}
              onChange={(e) => {
                const value = e.target.value;
                setAddress({ ...address, neighborhood: value });
                if (neighborhoodTouched) setNeighborhoodError(!value.trim());
              }}
              onBlur={() => {
                setNeighborhoodTouched(true);
                setNeighborhoodError(!address.neighborhood.trim());
              }}
              disabled={ searchingCep || cepValid }
            />
          </div>
        </div>

        <div className={styles.fieldWrapper}>
          <label
          htmlFor="street"
          className={streetError ? styles.streetError : styles.label}
          >
            Digite sua rua / logradouro*
          </label>

          <input
            type="text"
            name="street"
            value={address.street}
            placeholder="Ex: Rua Fulano"
            className={streetError ? styles.streetInputError : styles.input}
            onChange={(e) => {
              const value = e.target.value;
              setAddress({ ...address, street: value });
              if (streetTouched) setStreetError(!value.trim());
            }}
            onBlur={() => {
              setStreetTouched(true);
              setStreetError(!address.street.trim());
            }}
            disabled={ searchingCep || cepValid }
          />
        </div>

        <div className={styles.generalWrapper}>

          <div className={styles.fieldWrapper}>
            <label
            htmlFor="number"
            className={numberError ? styles.numberError : styles.label}
            >
              Digite seu número*
            </label>

            <input
              type="text"
              value={address.number}
              placeholder="Ex: 1234 ou QBC10"
              className={numberError ? styles.numberInputError : styles.input}
              onChange={(e) => {
                const value = e.target.value;
                setAddress({ ...address, number: value });
                if (numberTouched) setNumberError(!value.trim());
              }}
              onBlur={() => {
                setNumberTouched(true);
                setNumberError(!address.number.trim());
              }}
            />
          </div>

          <div className={styles.fieldWrapper}>
            <label
            htmlFor="complement"
            className={styles.label}
            >
              Digite um complemento (opcional)
            </label>

            <input
              type="text"
              name="complement"
              value={address.complement}
              placeholder="Ex: Próximo a Escola"
              className={styles.input}
              onChange={(e) => {
                const value = e.target.value;
                setAddress({ ...address, complement: value });
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.buttonsWrapper}>
        <button
          type="button"
          className={blockAll ? styles.disabled : styles.btn}
          onClick={() => changePart(-1)}
          disabled={blockAll}
        >
          Voltar
        </button>

        <button
          type="submit"
          className={cepError || !address.cep.trim() || cityError || neighborhoodError || streetError || numberError || blockAll ? styles.disabled : styles.btn}
          disabled={cepError || !address.cep.trim() || cityError || neighborhoodError || streetError || numberError || blockAll}
          onClick={async () => {
            setBlockAll(true);
            const result = await submit();
            if (!result) setBlockAll(false);
          }}
        >
          Cadastrar
        </button>
      </div>
    </div>
  )
}