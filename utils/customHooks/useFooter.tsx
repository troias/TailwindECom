import { useState, useEffect } from "react";
import { socialMedia } from "../../components/navigation/dummyNavigationData";
import { addSocialIconsToFooter } from "../utils";
import { getFooterMenuData } from "../api";

export const useFooter = () => {
  const [footer, setFooter] = useState([]);

  console.log("useFooterFooter", footer);

  useEffect(() => {
    const getFooterData = async () => {
      try {
        const footerData = await getFooterMenuData();
        const footer = addSocialIconsToFooter(footerData, socialMedia);
        return footer;
      } catch (error) {
        console.error("Error retrieving footer data:", error);
        return [];
      }
    };

    getFooterData().then((footer) => {
      setFooter(footer);
    });
  }, []);

  return footer;
};
