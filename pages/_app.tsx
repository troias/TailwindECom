import "../styles/globals.css";
import type { AppProps } from "next/app";

import Navigation from "../components/navigation/navigation";
import Footer from "../components/navigation/footer";
import { getNavigation } from ".././utils/api";
import { navigation } from "../components/navigation/dummyNavigationData";
import type { ExtendedNavigation } from "../components/navigation/dummyNavigationData";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navigation navigation={navigation} />
      <Component {...pageProps} />
      <Footer />
    </>
    // @ts-ignore
  );
}

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
