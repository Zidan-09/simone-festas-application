"use client";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import type { Address } from "@/app/types";
import styles from "./AddressReserve.module.css";
import Buttons from "@/app/components/Reservation/Buttons/Buttons";

interface AddressReserveProps {
  changeStep: Dispatch<SetStateAction<number>>;
  address: Address;
  setAddress: Dispatch<SetStateAction<Address>>;
}

export default function AddressReserve({ changeStep, address, setAddress }: AddressReserveProps) {
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

  const [isUserAddress, setIsUserAddress] = useState<boolean>(false);

  function resetErrors() {
    setCepError(false);
    setCepTouched(false);
    setCityError(false);
    setCityTouched(false);
    setNeighborhoodError(false);
    setNeighborhoodTouched(false);
    setStreetError(false);
    setStreetTouched(false);
    setNumberError(false);
    setNumberTouched(false);
    setAddress({ cep: "", city: "", neighborhood: "", street: "", number: ""});
  }

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
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.userAddressContainer}>
          <input
              id="isUserAddress" 
              type="checkbox" 
              name="isUserAddress" 
              onChange={(e) => {
                const value = e.target.checked;
                setIsUserAddress(value);
                resetErrors();
              }}
            />

            <label
              htmlFor="isUserAddress"
              className={styles.labelForCheckbox}
            >
              O evento será no seu endereço?
            </label>
        </div>

        <fieldset disabled={isUserAddress} className={styles.inputContainer}>
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

            <div className={`${styles.generalWrapper} ${styles.hideInput}`}>
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
        </fieldset>

        <Buttons
          firstText="Voltar"
          firstAction={() => changeStep(2)}
          secondText="Próximo"
          secondAction={() => changeStep(4)}
          secondDisabled={!isUserAddress && (!address.cep.trim() || !address.city.trim() || !address.number.trim())}
        />
      </div>
    </div>
  )
}