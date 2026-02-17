"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import type { KitType, Service } from "@/app/types";
import ServiceCard from "./ServiceCard";
import Loading from "@/app/components/Loading/Loading";
import config from "@/app/config-api.json";
import styles from "./Services.module.css";

interface ServicesProps {
  kitType: KitType;
  changeStep: Dispatch<SetStateAction<number>>;
  services: string[];
  setServices: Dispatch<SetStateAction<string[]>>;
  totalPrice: number;
  setTotalPrice: Dispatch<SetStateAction<number>>;
}

export default function Services({ kitType, changeStep, services, setServices, totalPrice, setTotalPrice }: ServicesProps) {
  const [servicesToSelect, setServicesToSelect] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalPrice);

  const handleToggleService = (service: Service) => {
    if (services.includes(service.id)) {
      setServices(prev => prev.filter(s => s !== service.id));

      setTotalPrice(prev => prev - Number(service.price));

    } else {
      setServices(prev => [...prev, service.id]);

      setTotalPrice(prev => prev + Number(service.price));
    }
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
          <h2 className={styles.title}>Serviços Opcionais</h2>  
          <p className={styles.subtitle}>Selecione serviços que acompanharão o kit</p>
        </div>

        <div className={styles.fieldWrapper}>
          <div className={styles.servicesContainer}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            ) : (
              servicesToSelect.map((service, idx) => (
                <div key={idx} onClick={() => handleToggleService(service)}>
                  <ServiceCard service={service} selecteds={services} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.total}>
          <p className={styles.totalPrice}>Valor total: {formattedPrice}</p>
        </div>

        <div className={styles.buttons}>
          <button
            className={`${styles.button} ${styles.cancel}`}
            onClick={() => changeStep(3)}
          >
            Voltar
          </button>

          <button
            className={`${styles.button} ${styles.next}`}
            onClick={() => changeStep(5)}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}