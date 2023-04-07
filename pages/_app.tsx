import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navigation from "../components/navigation/navigation";
import Footer from "../components/navigation/footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navigation />
      <Component {...pageProps} />
      <Footer />
    </>
    // @ts-ignore
  );
}
