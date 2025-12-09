"use client";
import { useState } from "react";
import Image from "next/image";
import icon from "../../assets/icons/icon.png";
import profile from "../../assets/icons/account.png";
import Navigation from "./components/Navigation/Navigation";
import styles from "./Header.module.css";

export default function Header() {
  const [actualSection, setActualSection] = useState<string | null>("home");

  const handleNavigate = (page: string) => {
    setActualSection(page);
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

      <Image
      src={profile}
      alt="profile"
      className={styles.profile}
      />
     
    </div>
  )
}