import Image from "next/image";
import { Menu } from "lucide-react";
import icon from "../../assets/icons/icon.png";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Image
        src={icon}
        alt="logo"
        className={styles.logo}
        />
        <h1
        className={styles.title}
        >Simone Festas</h1>
      </div>

      <div className={styles.menu}>
        <Menu
        size={35}
        />
      </div>
    </div>
  )
}