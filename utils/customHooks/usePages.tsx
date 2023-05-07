import { useState, useEffect } from "react";

import { getPageDataByHandle } from "../api";

export const usePages = (handle) => {
  const [pageData, setFooter] = useState([]);
  useEffect(() => {
    //when the component is mounted
    const getPageData = async () => {
      try {
        const pageData = await getPageDataByHandle(handle);
        console.log("usePagesid", handle);

        return pageData;
      } catch (err) {
        console.log("pageDataerr", err);
      }
    };

    getPageData().then((footer) => {
      setFooter(footer);
    });
  }, []);

  return pageData;
};
