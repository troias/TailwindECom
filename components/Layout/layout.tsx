import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoadingSpinner from "../UI/Spinners/loadingSpinner";
import { useInternalRoute } from "../custom_hooks/useInternalRoute/useInternalRoute";

// Explicitly type the children prop
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useInternalRoute();
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
