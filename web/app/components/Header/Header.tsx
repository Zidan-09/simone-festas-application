"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
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

  if (pathname === "/auth") return;

  return (
    <div className={styles.container}>
      <div
        className={styles.logoContainer}
        onClick={() => handleNavigate("home")}
      >
        <Image
          src={"/assets/icons/icon.png"}
          alt="logo"
          width={900}
          height={900}
          className={styles.logo}
        />
        <h1 className={styles.title}>Simone Festas</h1>
      </div>

      <div className={styles.navigation}>
        <Navigation actualPage={actualSection} changePage={handleNavigate} />
      </div>
    </div>
  );
}