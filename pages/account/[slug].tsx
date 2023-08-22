import React from "react";
import { getNavigation } from "../../utils/api";

type Props = {};

export default function index({}: Props) {
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-gray-900 sm:text-4xl py-8">
        Account Page
      </h1>
    </div>
  );
}

export const getStaticProps = async (ctx) => {
  //get navigation

  const navigation = await getNavigation();

  // console.log("navigation", navigation);

  return {
    props: {
      navigation,
    },
  };
};
