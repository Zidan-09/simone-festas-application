"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import icon from "../../assets/icons/icon.png";
import Navigation from "./components/Navigation/Navigation";
import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const actualSection =
    pathname === "/" ? "home" : pathname.replace("/", "");

  const handleNavigate = (page: string) => {
    router.push(page === "home" ? "/" : `/${page}`);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.logoContainer}
        onClick={() => handleNavigate("home")}
      >
        <Image src={icon} alt="logo" className={styles.logo} />
        <h1 className={styles.title}>Simone Festas</h1>
      </div>

      <div className={styles.navigation}>
        <Navigation actualPage={actualSection} changePage={handleNavigate} />
      </div>
    </div>
  );
}