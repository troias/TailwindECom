import React from "react";
import { getNavigation } from "../../utils/api";

type Props = {};

export default function index({}: Props) {
  return <div>index</div>;
}

export const getStaticProps = async (ctx) => {
  //get navigation

  const navigation = await getNavigation();

  console.log("navigation", navigation);

  return {
    props: {
      navigation,
    },
  };
};
