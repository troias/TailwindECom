import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navigation from "../components/navigation/navigation";
import Footer from "../components/navigation/footer";
import { getNavigation } from ".././utils/api";
import { useFooter } from "../utils/customHooks/useFooter";
import { useEffect } from "react";
import LoadingSpinner from "../components/UI/Spinners/loadingSpinner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <React.Suspense fallback={<LoadingSpinner />}>
        <Navigation navigation={pageProps.navigation} />
        <Component {...pageProps} />
        <Footer />
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
