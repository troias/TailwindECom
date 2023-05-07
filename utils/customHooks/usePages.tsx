import { useState, useEffect } from "react";
import { socialMedia } from "../../components/navigation/dummyNavigationData";
import { addSocialIconsToFooter } from "../utils";
import { getFooterMenuData } from "../api";

export const usePages = () => {
  const [footer, setFooter] = useState([]);
  useEffect(() => {
    //when the component is mounted
    const getFooterData = async () => {
      const footerData = await getFooterMenuData();
      const footer = addSocialIconsToFooter(footerData, socialMedia);
      return footer;
    };
    getFooterData();

    getFooterData().then((footer) => {
      setFooter(footer);
    });
  }, []);

  return page;
};
