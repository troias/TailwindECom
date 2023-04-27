import "../styles/globals.css";
import type { AppProps } from "next/app";

import Navigation from "../components/navigation/navigation";
import Footer from "../components/navigation/footer";
import { getNavigation } from ".././utils/api";
import { navigation } from "../components/navigation/dummyNavigationData";
import type { ExtendedNavigation } from "../components/navigation/dummyNavigationData";

export default function App({ Component, pageProps }: AppProps) {
  // console.log("navigation", pageProps);

  // console.log("navigation", navigation);
  return (
    <>
      <Navigation navigation={pageProps.navigation} />
      <Component {...pageProps} />
      <Footer />
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
    console.log("error", error);
    console.error(error);
    return {
      props: {
        navigation: [],
      },
    };
  }
}
