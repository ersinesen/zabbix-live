import type { NextPage } from "next";

import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Zabbix-live</title>
        <meta
          name="description"
          content="Loadpateo"
        />
        <link rel="icon" href="./favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a href="/home.html">
          <h1 className={styles.title}>zabbix-live</h1>
        </a>
      </main>
    </div>
  );
};

export default Home;
