"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import type { Service } from "@/app/types";
import ServiceCard from "./ServiceCard";
import Loading from "@/app/components/Loading/Loading";
import config from "@/app/config-api.json";
import styles from "./Services.module.css";

interface ServicesProps {
  changeStep: Dispatch<SetStateAction<number>>;
  services: string[];
  setServices: Dispatch<SetStateAction<string[]>>;
}

export default function Services({ changeStep, services, setServices }: ServicesProps) {
  const [servicesToSelect, setServicesToSelect] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleToggleService = (serviceId: string) => {
    setServices(prev =>
      prev.includes(serviceId)
      ? prev.filter(s => s !== serviceId)
      : [...prev, serviceId]
    );
  }

  useEffect(() => {
    setLoading(true);

    async function fetchServices() {
      try {
        const res = await fetch(`${config.api_url}/service`).then(res => res.json());

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
          <label
            htmlFor="services"
            className={styles.label}
          >
            Escolha os serviços que gostaria
          </label>

          <div className={styles.servicesContainer}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            ) : (
              servicesToSelect.map((service, idx) => (
                <div key={idx} onClick={() => handleToggleService(service.id)}>
                  <ServiceCard service={service} selecteds={services} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.buttons}>
          <button
            className={`${styles.button} ${styles.cancel}`}
            onClick={() => changeStep(3)}
          >
            Voltar
          </button>

          <button
            className={styles.button}
            onClick={() => changeStep(5)}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}