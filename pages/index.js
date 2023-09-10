import Image from "next/image";
import Link from "next/link";
import Modal from "react-modal";
import Lottie from "lottie-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import useWindowDimensions from "../hooks/useWindowDimensions";
import styles from "../styles/Home.module.css";

const targets = [
  {
    name: "Students",
    page: "/students",
  },
  {
    name: "Recruiters",
    page: "/recruiters",
  },
  {
    name: "Admin",
    page: "/admin",
  },
];

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
  const { width } = useWindowDimensions();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Image
          src="/icons/icon.png"
          alt="placement_logo"
          height={150}
          width={150}
        />

        <div className={styles.btnsSection}>
          {targets.map((target, i) => (
            <div key={i} className={styles.btn}>
              <Link href={target.page}>{target.name}</Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
