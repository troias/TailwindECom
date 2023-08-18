import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoadingSpinner from "../UI/Spinners/loadingSpinner";

const Layout = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = (url) => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

  console.log("isLoading", isLoading);

  return (
    <div>
      {isLoading ? <LoadingSpinner /> : null}
      <div className={isLoading ? "opacity-25 pointer-events-none" : ""}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
