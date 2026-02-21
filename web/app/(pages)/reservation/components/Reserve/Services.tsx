"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import type { KitType, Service } from "@/app/types";

import ServiceCard from "./ServiceCard";
import Loading from "@/app/components/Loading/Loading";
import Buttons from "@/app/components/Reservation/Buttons/Buttons";

import config from "@/app/config-api.json";
import styles from "./Services.module.css";

interface ServicesProps {
  kitType: KitType;
  changeStep: Dispatch<SetStateAction<number>>;
  service: Service | null;
  setService: Dispatch<SetStateAction<Service  | null>>;
  totalPrice: number;
  setTotalPrice: Dispatch<SetStateAction<number>>;
}

export default function Services({ kitType, changeStep, service, setService, totalPrice, setTotalPrice }: ServicesProps) {
  const [servicesToSelect, setServicesToSelect] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalPrice);

  const handleToggleService = (s: Service) => {
    const diference = service !== s ? s.price - (service?.price ?? 0) : s.price * (-1);

    setTotalPrice(prev => prev + diference);

    setService(prev => prev === s ? null : s);
  }

  useEffect(() => {
    setLoading(true);

    async function fetchServices() {
      try {
        const res = await fetch(`${config.api_url}/service?kitType=${kitType}`).then(res => res.json());

        if (!res.success) throw new Error(res.message);

        setServicesToSelect(res.data);

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.stepTitle}>Deseja Adicionar Serviços?</h2>  
          <p className={styles.stepSubtitle}>Escolha os serviços que irão complementar seu evento</p>
        </div>

        <div className={styles.fieldWrapper}>
          <div className={styles.servicesContainer}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            ) : (
              servicesToSelect.map((s, idx) => (
                <div key={idx} onClick={() => handleToggleService(s)} className={styles.serviceWrapper}>
                  <ServiceCard service={s} selected={service} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.total}>
          <p className={styles.totalPrice}>Valor total: {formattedPrice}</p>
        </div>

        <Buttons
          firstText="Voltar"
          firstAction={() => changeStep(3)}
          secondText="Próximo"
          secondAction={() => changeStep(5)}
          secondDisabled={false}
        />
      </div>
    </div>
  );
}