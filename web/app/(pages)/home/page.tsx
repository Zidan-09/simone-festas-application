"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Home.module.css";

export default function Home() {
  const themes: string[] = [
    "/assets/images/stitch.jpeg",
    "/assets/images/sonic.jpeg", 
    "/assets/images/festa-junina.jpeg", 
    "/assets/images/mothers-day.jpeg",
    "/assets/images/butterflies.jpeg",
    "/assets/images/circuds.jpeg"
  ];
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThemeIndex((prev) => (prev + 1) % themes.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [themes.length]);

  const options = [
    { icon: "/assets/images/bobbie-goods.jpeg", label: "Kits temáticos", description: "Decoração completa e personalizada para o seu tema." },
    { icon: "/assets/images/itens.jpeg", label: "Itens variados", description: "Aluguel de peças avulsas, painéis e mobiliário moderno." },
    { icon: "/assets/images/table.jpeg", label: "Mesa posta", description: "Louças e acessórios para um toque de charme na sua festa." },
  ];

  const inspirationImages = [
    { img: "/assets/images/stitch.jpeg", label: "Lilo e Stitch" },
    { img: "/assets/images/butterflies.jpeg", label: "Jardim Encantado" },
    { img: "/assets/images/festa-junina.jpeg", label: "Festa Junina" },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Sua festa ainda mais bonita</h2>
          <p className={styles.heroSubtitle}>
            Decorações modernas, kits personalizados e tudo para tornar sua celebração inesquecível.
          </p>
        </div>
        
        <div className={styles.heroCarousel}>
          <Image
            src={themes[themeIndex]}
            alt="Tema de Decoração"
            className={styles.carouselImage}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className={styles.heroOverlay}></div>
        </div>
      </section>

      <section className={styles.services}>
        <h2 className={styles.sectionTitle}>✨ Nossos Serviços</h2>
        <div className={styles.servicesGrid}>
          {options.map((opt, i) => (
            <div key={i} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Image 
                  src={opt.icon} 
                  alt="icon" 
                  className={styles.serviceImageIcon} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className={styles.serviceLabel}>{opt.label}</h3>
              <p className={styles.serviceDescription}>{opt.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.inspirations}>
        <h2 className={styles.sectionTitle}>📸 Inspirações Recentes</h2>
        <div className={styles.inspirationsGrid}>
          {inspirationImages.map((item, i) => (
            <div key={i} className={styles.inspirationCard}>
              <Image
                src={item.img}
                alt={item.label}
                className={styles.inspirationImage}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className={styles.inspirationOverlay}>
                <p className={styles.inspirationLabel}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>🎉 Quem Ajudamos a Celebrar</h2>
        <div className={styles.categoriesGrid}>
          {["Aniversários", "Infantil", "Casamentos", "15 anos", "Formaturas", "Chá Revelação", "Chá de Bebê", "Adulto", "Eventos Corporativos", "Bodas"].map(
            (item, i) => (
              <div key={i} className={styles.categoryTag}>{item}</div>
            )
          )}
        </div>
      </section>
    </div>
  );
}