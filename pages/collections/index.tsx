import React from "react";
import { getNavigation } from "../../utils/api";

type Props = {};

const Collections = (props: Props) => {
  return <div>index</div>;
};

export default Collections;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const navigation = await getNavigation();

  return {
    props: {
      navigation,
    },
  };
};
