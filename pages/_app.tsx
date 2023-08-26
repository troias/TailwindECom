import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navigation from "../components/navigation/navigation";
import Footer from "../components/navigation/footer";
import { getNavigation } from ".././utils/api";

import LoadingSpinner from "../components/UI/Spinners/loadingSpinner";
import Layout from "../components/Layout/layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <React.Suspense fallback={<LoadingSpinner />}>
        <Navigation navigation={pageProps.navigation} />
        <Layout>
          <Component {...pageProps} />
          <Footer />
        </Layout>
      </React.Suspense>
    </>
    // @ts-ignore
  );
}

export async function getServerSideProps() {
  try {
    const navigation = await getNavigation();

    return {
      props: {
        navigation: navigation,
      },
    };
  } catch (error) {
    // console.log("error", error);
    console.error(error);
    return {
      props: {
        navigation: [],
      },
    };
  }
}
