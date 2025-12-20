"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import icon from "../../assets/icons/icon.png";
import Navigation from "./components/Navigation/Navigation";
import styles from "./Header.module.css";

export default function Header() {
  const [actualSection, setActualSection] = useState<string | null>("home");
  const router = useRouter();

  const handleNavigate = (page: string) => {
    setActualSection(page);
    router.push(`/${page}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer} onClick={() => handleNavigate("home")}>
        <Image
        src={icon}
        alt="logo"
        className={styles.logo}
        />
        <h1
        className={styles.title}
        >Simone Festas</h1>
      </div>
      
      <div className={styles.navigation}>
        <Navigation actualPage={actualSection} changePage={handleNavigate}/>
      </div>     
    </div>
  )
}