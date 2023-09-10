import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import useWindowDimensions from "../hooks/useWindowDimensions";
import styles from "../styles/Home.module.css";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const Home = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.backArrow}>
          <ArrowBackIcon onClick={() => router.push("/")} />
        </div>

        <Image
          src="/icons/icon.png"
          alt="placement_logo"
          height={150}
          width={150}
        />

        <div className={styles.formTitle}>Admin Login</div>
        <div className={styles.desc}>coming soon...</div>
      </main>
    </div>
  );
};

export default Home;
